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

// Track search queries to PostHog
function trackSearch() {
  if(!canProceed()) return;

  const observer = new MutationObserver(() => {
    const searchInput = document.querySelector('.DocSearch-Input, input[type="search"]');
    if (searchInput && !searchInput.dataset.searchTracked) {
      searchInput.dataset.searchTracked = 'true';

      let searchTimeout;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          const query = e.target.value.trim();
          if (query.length > 2 && window.posthog) {
            window.posthog.capture('docs_search', {
              search_query: query,
              page: window.location.pathname
            });
          }
        }, 1000);
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

addScripts();
trackSearch();
