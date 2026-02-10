var allowedHost = 'docs.seqera.io';

function canProceed() {
  if (typeof window === 'undefined') return false;
  if (window.location.hostname !== allowedHost) return false;
  return true;
}

// Sanitize search queries to prevent PII leakage
function sanitizeQuery(query) {
  return query
    // Redact potential API keys (20+ char alphanumeric strings)
    .replace(/\b[A-Za-z0-9_-]{20,}\b/g, '[REDACTED_KEY]')
    // Redact IP addresses
    .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]')
    // Redact AWS keys
    .replace(/\b(AKIA|ASIA)[A-Z0-9]{16}\b/gi, '[AWS_KEY]')
    .replace(/aws_[a-z_]+/gi, '[AWS_KEY]')
    // Redact common secret patterns
    .replace(/\b(secret|token|password|key)[=:]\S+/gi, '[REDACTED]')
    // Redact email addresses
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
    // Limit length
    .substring(0, 200);
}

// Helper to get the current search query from the DocSearch input
function getCurrentQuery() {
  const input = document.querySelector('.DocSearch-Input, input[type="search"]');
  return input ? input.value.trim() : '';
}

// Safe PostHog event tracking with error handling
function trackEvent(eventName, properties) {
  try {
    if (window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(eventName, properties);
      return true;
    }
  } catch (e) {
    console.warn('PostHog tracking failed:', e);
  }
  return false;
}

// Track search queries to PostHog
function trackSearch() {
  if(!canProceed()) return;

  let lastSearchTime = 0;
  let lastNoResultsTime = 0;
  let lastClickTime = 0;
  const RATE_LIMIT_MS = 500;
  const REDACTED_TOKENS = ['[REDACTED_KEY]', '[IP]', '[AWS_KEY]', '[REDACTED]', '[EMAIL]'];

  const observer = new MutationObserver(() => {
    const searchInput = document.querySelector('.DocSearch-Input, input[type="search"]');
    if (searchInput && !searchInput.dataset.searchTracked) {
      searchInput.dataset.searchTracked = 'true';

      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          const now = Date.now();

          if (now - lastSearchTime < RATE_LIMIT_MS) {
            return;
          }

          const query = e.target.value.trim();
          if (query.length > 2) {
            const sanitizedQuery = sanitizeQuery(query);

            if (sanitizedQuery && !REDACTED_TOKENS.some(token => sanitizedQuery === token)) {
              if (trackEvent('docs_search', {
                search_query: sanitizedQuery,
                page: window.location.pathname
              })) {
                lastSearchTime = now;
              }
            }
          }
        }, 1000);
      });
    }

    // Track "no results" state
    const noResults = document.querySelector('.DocSearch-NoResults');
    if (noResults && !noResults.dataset.noResultsTracked) {
      noResults.dataset.noResultsTracked = 'true';

      const now = Date.now();
      if (now - lastNoResultsTime < RATE_LIMIT_MS) return;

      const query = getCurrentQuery();
      if (query.length > 2) {
        const sanitizedQuery = sanitizeQuery(query);
        if (sanitizedQuery && !REDACTED_TOKENS.some(token => sanitizedQuery === token)) {
          if (trackEvent('docs_search_no_results', {
            search_query: sanitizedQuery,
            page: window.location.pathname
          })) {
            lastNoResultsTime = now;
          }
        }
      }
    }

    // Track result clicks
    const hits = document.querySelectorAll('.DocSearch-Hit a');
    hits.forEach((hit) => {
      if (!hit.dataset.clickTracked) {
        hit.dataset.clickTracked = 'true';
        hit.addEventListener('click', () => {
          const now = Date.now();
          if (now - lastClickTime < RATE_LIMIT_MS) return;

          const query = getCurrentQuery();
          if (query.length > 2) {
            const sanitizedQuery = sanitizeQuery(query);
            if (sanitizedQuery && !REDACTED_TOKENS.some(token => sanitizedQuery === token)) {
              if (trackEvent('docs_search_click', {
                search_query: sanitizedQuery,
                result_url: hit.getAttribute('href'),
                page: window.location.pathname
              })) {
                lastClickTime = now;
              }
            }
          }
        });
      }
    });
  });

  // Optimize: observe only header/nav instead of entire body
  const searchContainer = document.querySelector('header, nav, .navbar') || document.body;
  observer.observe(searchContainer, { childList: true, subtree: true });
}

trackSearch();
