import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';

export default function BlogPostItemWrapper(props) {
  return (
    <>
      {/* The original blog post content */}
      <BlogPostItem {...props} />
    </>
  );
}
