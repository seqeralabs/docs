import React from 'react';
import BlogPostItems from '@theme-original/BlogPostItems';

import Heading from '@theme/Heading'

export default function BlogPostItemsWrapper(props) {
  const {isTagPage} = props;
  return (
    <>
      {!isTagPage && <Heading as='h1' style={{fontSize: '3rem', marginBottom: '3rem'}}>Changelog</Heading> }
      <BlogPostItems {...props} />
    </>
  );
}
