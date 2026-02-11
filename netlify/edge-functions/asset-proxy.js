/**
 * Netlify Edge Function to proxy assets from multiple origins
 *
 * This function tries each origin in sequence until it finds the requested asset.
 * It handles both /assets/* and /img/* paths to ensure CSS, JavaScript, and images
 * are correctly served from the appropriate documentation site.
 *
 * The function checks origins in order and returns the first successful response.
 * If no origin has the asset, it returns a 404.
 */

export default async function handler(request, context) {
  const url = new URL(request.url);
  const assetPath = url.pathname; // e.g., /assets/css/styles.abc123.css
  const referer = request.headers.get('referer') || '';

  // First, try to serve the asset from the local site (bypass edge function)
  const localResponse = await context.next();
  if (localResponse.ok) {
    return localResponse;
  }

  // Smart origin selection based on referer URL
  const originMap = {
    '/nextflow/': 'https://docs-migration.netlify.app',
    '/platform-api/': 'https://seqera-docs-api.netlify.app',
    // Add more route mappings as needed
  };

  // Determine priority origin from referer
  let priorityOrigin = 'https://seqera-docs.netlify.app'; // default
  for (const [route, origin] of Object.entries(originMap)) {
    if (referer.includes(route)) {
      priorityOrigin = origin;
      break;
    }
  }

  // Build origin list with priority origin first
  const allOrigins = [
    'https://seqera-docs.netlify.app',
    'https://docs-migration.netlify.app',
    'https://seqera-docs-api.netlify.app',
    'https://deploy-preview-1011--seqera-docs.netlify.app',
  ];

  // Move priority origin to front, remove duplicates
  const origins = [
    priorityOrigin,
    ...allOrigins.filter(o => o !== priorityOrigin)
  ];

  // Try priority origin first, then fallbacks in parallel (race)
  const fetchPromises = origins.slice(0, 2).map(origin =>
    fetch(`${origin}${assetPath}`, {
      signal: AbortSignal.timeout(3000)
    }).catch(err => null)
  );

  // Race the first 2 origins
  const response = await Promise.race(fetchPromises);

  if (response && response.ok) {
    // Clone response with cache headers
    return new Response(response.body, {
      status: response.status,
      headers: {
        ...Object.fromEntries(response.headers),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // If race failed, try remaining origins sequentially
  for (const origin of origins.slice(2)) {
    try {
      const response = await fetch(`${origin}${assetPath}`);
      if (response.ok) {
        return new Response(response.body, {
          status: response.status,
          headers: {
            ...Object.fromEntries(response.headers),
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    } catch (error) {
      continue;
    }
  }

  // If none of the origins worked, return 404
  return new Response('Asset not found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
