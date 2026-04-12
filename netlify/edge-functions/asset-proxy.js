/**
 * Netlify Edge Function to proxy assets from multiple origins.
 *
 * Tries the local site first. If the asset is not local, fetches from
 * all remote origins in parallel and returns the first successful response.
 * Sets immutable cache headers on proxied remote responses if none are present.
 */

const REMOTE_ORIGINS = [
  'https://seqera-docs-api.netlify.app',
  'https://docs-migration.netlify.app',
];

const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';

function addCacheHeaders(response) {
  const headers = new Headers(response.headers);
  if (!headers.has('Cache-Control')) {
    headers.set('Cache-Control', IMMUTABLE_CACHE);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default async function handler(request, context) {
  const url = new URL(request.url);
  const assetPath = url.pathname;

  // Try local first
  const localResponse = await context.next();
  if (localResponse.ok) {
    return localResponse;
  }

  const controller = new AbortController();
  const fetches = REMOTE_ORIGINS.map(async (origin) => {
    const response = await fetch(`${origin}${assetPath}`, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`${response.status} from ${origin}`);
    }
    return response;
  });

  try {
    const remoteResponse = await Promise.any(fetches);
    controller.abort();
    return addCacheHeaders(remoteResponse);
  } catch {
    return new Response('Asset not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
