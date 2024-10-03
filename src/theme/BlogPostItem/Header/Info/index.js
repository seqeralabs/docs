import React from 'react';
import clsx from 'clsx';
import {useDateTimeFormat} from '@docusaurus/theme-common/internal';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import styles from './styles.module.css';

function DateTime({date, formattedDate}) {
  return <time dateTime={date}>{formattedDate}</time>;
}
export default function BlogPostItemHeaderInfo({className}) {
  const {metadata} = useBlogPost();
  const {date} = metadata;
  const dateTimeFormat = useDateTimeFormat({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
  const formatDate = (blogDate) => dateTimeFormat.format(new Date(blogDate));
  return (
    <div className={clsx(styles.container, 'margin-vert--md', className)}>
      <DateTime date={date} formattedDate={formatDate(date)} />
    </div>
  );
}
