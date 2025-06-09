import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import styles from './styles.module.css';

export default function BlogPostItemHeaderTitle({className}) {
  const {metadata, isBlogPostPage} = useBlogPost();
  const {permalink, title} = metadata;
  const TitleHeading = isBlogPostPage ? 'h1' : 'h2';
  return (
    <TitleHeading 
      className={clsx(
        isBlogPostPage ? styles.blogPostPageTitle : styles.listTitle,
        className
      )}
      style={!isBlogPostPage ? { fontSize: '2rem' } : undefined}
    >
      {isBlogPostPage ? title : <Link to={permalink} className={styles.blogTitleLink}>{title}</Link>}
    </TitleHeading>
  );
}
