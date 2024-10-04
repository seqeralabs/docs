import React, {memo} from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import {
  useVisibleBlogSidebarItems,
  BlogSidebarItemList,
} from '@docusaurus/plugin-content-blog/client';
import BlogSidebarContent from '@theme/BlogSidebar/Content';
import SearchBar from "@theme-original/SearchBar";
import Link from '@docusaurus/Link';

import RssIcon from "./rss.svg";
import styles from './styles.module.css';


const ListComponent = ({items}) => {
  return (
    <BlogSidebarItemList
      items={items}
      ulClassName={clsx(styles.sidebarItemList, 'clean-list')}
      liClassName={styles.sidebarItem}
      linkClassName={styles.sidebarItemLink}
      linkActiveClassName={styles.sidebarItemLinkActive}
    />
  );
};
function BlogSidebarDesktop({sidebar}) {
  const items = useVisibleBlogSidebarItems(sidebar.items);

  // Figure out if we're looking at a product tag or changelog entry
  const pathMatch = location.pathname.match(/\/changelog\/(?:tags\/)?([^\/]+)(?:\/v[\d.]+.*)?/);
  const product = pathMatch ? pathMatch[1] : null;
  const product_platform = product?.includes('seqera') ? 'platform' : product;
  const returnToDocs = '/' + ['multiqc', 'fusion', 'platform', 'wave', 'nextflow'].includes(product_platform) ? product_platform : '';

  // Filter the sidebar for just this product
  const filteredItems = product ? items.filter(item => item.permalink.includes(`/changelog/${product}/`)) : items;

  return (
    <aside className={styles.blogAside}>
      <nav
        className={clsx(styles.sidebar, 'thin-scrollbar')}
        aria-label={translate({
          id: 'theme.blog.sidebar.navAriaLabel',
          message: 'Blog recent posts navigation',
          description: 'The ARIA label for recent posts in the blog sidebar',
        })}>
        <SearchBar />
        <div className={styles.sidebarItemTitle}>
          <Link href="/changelog">{sidebar.title}</Link>
          <Link href="/changelog/rss.xml" target="_blank" rel="noopener noreferrer" title="Subscribe to RSS" className={styles.RssIconLink}>
            <RssIcon />
          </Link>
        </div>
        <Link href={`/${returnToDocs}`} className={styles.backToDocs}>
          &larr; back to docs
        </Link>
        <BlogSidebarContent
          items={filteredItems}
          ListComponent={ListComponent}
          yearGroupHeadingClassName={styles.yearGroupHeading}
        />
      </nav>
    </aside>
  );
}
export default memo(BlogSidebarDesktop);
