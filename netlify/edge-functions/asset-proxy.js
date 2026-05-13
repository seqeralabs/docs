/**
 * Netlify Edge Function to proxy assets from multiple origins.
 *
 * Tries the local site first. If the asset is not local, fetches from
 * all remote origins in parallel and returns the first successful response.
 */

const REMOTE_ORIGINS = [
  'https://seqera-docs-api.netlify.app',
  'https://docs-migration.netlify.app',
];

export default async function handler(request, context) {
  const url = new URL(request.url);
  const assetPath = url.pathname;

  const localResponse = await context.next();
  if (localResponse.ok) {
    return localResponse;
  }

  const entries = REMOTE_ORIGINS.map((origin) => {
    const controller = new AbortController();
    const promise = fetch(`${origin}${assetPath}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} from ${origin}`);
        return { response, controller };
      });
    return { controller, promise };
  });

  try {
    const { response: remoteResponse, controller: winner } = await Promise.any(
      entries.map((e) => e.promise),
    );
    for (const { controller } of entries) {
      if (controller !== winner) controller.abort();
    }
    return remoteResponse;
  } catch {
    return new Response('Asset not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
