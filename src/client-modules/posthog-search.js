let debounceTimer;

function trackSearch() {
  // Use the globally available PostHog instance (loaded via snippet)
  const ph = window.posthog;

  if (!ph) {
    console.warn('PostHog not available. Search tracking will be disabled.');
    return;
  }

  document.addEventListener('input', (e) => {
    const input = e.target.closest('.DocSearch-Input, [class*="searchBox"] input');
    if (!input) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = input.value;
      if (query && query.length > 2) {
        ph.capture('docs_search_performed', { query });
      }
    }, 500);
  });

  document.addEventListener('click', (e) => {
    const resultLink = e.target.closest('.DocSearch-Hit a, [class*="searchResult"] a');
    if (!resultLink) return;

    ph.capture('docs_search_result_clicked', {
      result_url: resultLink.href,
      result_title: resultLink.textContent?.trim() || '',
    });
  });
}

if (typeof window !== 'undefined') {
  trackSearch();
}
