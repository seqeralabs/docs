import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';

export default function BlogPostItemWrapper(props) {
  return (
    <>
      {/* Links at the top */}
      <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
        {/* External link to the docs page */}
        <a href="https://docs.seqera.io/platform/latest" style={{ marginRight: '1rem' }}>
          Back to Docs
        </a>
        <a href="/cloud_changelog/rss.xml" target="_blank" rel="noopener noreferrer">
          Subscribe to RSS
        </a>
      </div>

      {/* The original blog post content */}
      <BlogPostItem {...props} />
    </>
  );
}
