import React from 'react';
import clsx from 'clsx';
import {useDateTimeFormat} from '@docusaurus/theme-common/internal';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';

function DateTime({date, formattedDate}) {
  return <time dateTime={date}>{formattedDate}</time>;
}
export default function BlogPostItemHeaderInfo({className}) {
  const {metadata} = useBlogPost();
  const {date, tags} = metadata;
  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const tagsExists = tags.length > 0;
  const formatDate = (blogDate) => dateTimeFormat.format(new Date(blogDate));
  return (
    <div className={styles.container}>
      <DateTime date={date} formattedDate={formatDate(date)} />
      {tagsExists && tags.map((tag) => (
        <div className={clsx(styles.tag, styles[tag.label.replace(' ', '-')])} key={tag.permalink}>
          <Link to={tag.permalink}>{tag.label}</Link>
        </div>
      ))}
    </div>
  );
}
