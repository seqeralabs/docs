import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import BlogSidebar from '@theme/BlogSidebar';

import styles from './styles.module.css';


export default function BlogLayout(props) {
  const {sidebar, toc, children, ...layoutProps} = props;
  const hasSidebar = sidebar && sidebar.items.length > 0;
  return (
    <Layout {...layoutProps}>
      <div className={styles.blogWrapper}>
        <BlogSidebar sidebar={sidebar} />
        <main className={styles.blogMain}>
          <div className="container padding-top--lg padding-bottom--lg">
            <div className="row">
              <div className="col">
                {children}
              </div>
              {toc && <div className="col col--3">{toc}</div>}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
