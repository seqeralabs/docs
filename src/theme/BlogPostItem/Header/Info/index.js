import React from 'react';
import clsx from 'clsx';
import {useDateTimeFormat} from '@docusaurus/theme-common/internal';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';
import Link from '@docusaurus/Link';

import styles from './styles.module.css';

function DateTime({date, formattedDate}) {
  return <time dateTime={date}>{formattedDate}</time>;
}
function capitalize(str) {
  return str.replace(/\b\w/g, function(char) { return char.toUpperCase(); });
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
  tags.forEach(function(tag) {
    tag.title = tag.label.toLowerCase() === 'multiqc' ? 'MultiQC' : capitalize(tag.label);
  });
  return (
    <div className={styles.container}>
      <DateTime date={date} formattedDate={formatDate(date)} />
      {tagsExists && tags.map((tag) => (
        <div className={clsx(styles.tag, styles[tag.label.replace(' ', '-')])} key={tag.permalink}>
          <Link to={tag.permalink}>{tag.title}</Link>
        </div>
      ))}
    </div>
  );
}
