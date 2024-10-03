import React from 'react';
import BlogLayout from '@theme-original/BlogLayout';
import Link from '@docusaurus/Link';

export default function BlogLayoutWrapper(props) {
  return (
    <>
      <BlogLayout {...props} />
      <div style={{ marginTop: '2rem' }}>
        <Link to="/docs/">Back to Docs</Link>
      </div>
    </>
  );
}

export default function BlogLayoutWrapper(props) {
  return (
    <>
      <BlogLayout {...props} />
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a href="/blog/rss.xml" target="_blank" rel="noopener noreferrer">
          <button style={{ padding: '0.5rem 1rem', fontSize: '16px' }}>Subscribe to RSS</button>
        </a>
      </div>
    </>
  );
}
