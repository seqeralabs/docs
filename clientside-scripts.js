var allowedHost = 'docs.seqera.io';
var hotjarAppID = 3836890;

function canProceed() {
  if (typeof window === 'undefined') return false;
  if (window.location.hostname !== allowedHost) return false;
  return true;
}

function addScripts() {

  if(!canProceed()) return;

  // HotJar
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:hotjarAppID,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

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

// Track search queries to PostHog
function trackSearch() {
  if(!canProceed()) return;

  // Rate limiting: track last search time
  let lastSearchTime = 0;
  const RATE_LIMIT_MS = 500; // Minimum 500ms between tracked searches

  const observer = new MutationObserver(() => {
    const searchInput = document.querySelector('.DocSearch-Input, input[type="search"]');
    if (searchInput && !searchInput.dataset.searchTracked) {
      searchInput.dataset.searchTracked = 'true';

      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          const now = Date.now();

          // Rate limiting check
          if (now - lastSearchTime < RATE_LIMIT_MS) {
            return;
          }

          const query = e.target.value.trim();
          if (query.length > 2 && window.posthog) {
            const sanitizedQuery = sanitizeQuery(query);

            // Only track if query isn't entirely redacted
            if (sanitizedQuery && sanitizedQuery !== '[REDACTED_KEY]') {
              window.posthog.capture('docs_search', {
                search_query: sanitizedQuery,
                page: window.location.pathname
              });
              lastSearchTime = now;
            }
          }
        }, 1000);
      });
    }
  });

  // Optimize: observe only header/nav instead of entire body
  const searchContainer = document.querySelector('header, nav, .navbar') || document.body;
  observer.observe(searchContainer, { childList: true, subtree: true });
}

addScripts();
trackSearch();
