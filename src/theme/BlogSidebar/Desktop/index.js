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
  return (
    <aside>
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
        <Link href="https://docs.seqera.io/platform/latest" className={styles.backToDocs}>
          &larr; back to docs
        </Link>
        <BlogSidebarContent
          items={items}
          ListComponent={ListComponent}
          yearGroupHeadingClassName={styles.yearGroupHeading}
        />
      </nav>
    </aside>
  );
}
export default memo(BlogSidebarDesktop);
