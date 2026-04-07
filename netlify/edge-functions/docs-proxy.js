/**
 * Netlify Edge Function to proxy documentation from external origins
 * and override X-Robots-Tag headers to ensure content is indexable.
 *
 * The upstream sites (seqera-docs-api.netlify.app and docs-migration.netlify.app)
 * may return X-Robots-Tag: noindex. This function intercepts the proxied response
 * and sets X-Robots-Tag: index so search engines index the content on this domain.
 *
 * Path mapping:
 *   /platform-api/* → https://seqera-docs-api.netlify.app/platform-api/:splat
 *   /nextflow/*     → https://docs-migration.netlify.app/nextflow/:splat
 */

const ORIGINS = {
  '/platform-api/': 'https://seqera-docs-api.netlify.app',
  '/nextflow/': 'https://docs-migration.netlify.app',
};

export default async function handler(request, context) {
  const url = new URL(request.url);
  const path = url.pathname;

  const prefix = Object.keys(ORIGINS).find((p) => path.startsWith(p));
  if (!prefix) {
    return context.next();
  }

  const origin = ORIGINS[prefix];

  try {
    const response = await fetch(`${origin}${path}`);
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'index');

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error(`Failed to proxy ${path} from ${origin}:`, error);
    return new Response('Proxy error', { status: 502 });
  }
}