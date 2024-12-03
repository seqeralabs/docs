// src/pages/404.js

import React, { useEffect } from 'react';

function NotFound() {
  useEffect(() => {
    // Change the tab title for the 404 page
    document.title = 'Page Not Found | Seqera Docs';

    // Google Analytics tracking for 404 page
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: '/404',
        page_title: '404 - Not Found',
      });
    }
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Page not found</h1>
      <p>The page you're looking for may have been moved or renamed.</p>
    </div>
  );
}

export default NotFound;
