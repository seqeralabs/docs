import React, {type ReactNode, useState, useRef, useEffect} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import {useLocation} from '@docusaurus/router';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import styles from './styles.module.css';

function useSyntheticTitle() {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) {
    return null;
  }
  return metadata.title;
}

function MarkdownButtons(): ReactNode {
  const {pathname} = useLocation();
  const [copied, setCopied] = useState(false);
  const copyBtnRef = useRef<HTMLButtonElement>(null);

  const mdUrl = `${pathname.replace(/\/$/, '')}.md`;

  // Pin the button width to its natural size so it doesn't shrink when
  // the label changes from "Copy markdown" to "Copied!"
  useEffect(() => {
    if (copyBtnRef.current) {
      copyBtnRef.current.style.minWidth = `${copyBtnRef.current.offsetWidth}px`;
    }
  }, []);

  const handleCopy = async () => {
    try {
      const response = await fetch(mdUrl);
      if (!response.ok) return;
      await navigator.clipboard.writeText(await response.text());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently fail if clipboard or fetch is unavailable
    }
  };

  return (
    <div className={styles.markdownActions}>
      <button
        ref={copyBtnRef}
        onClick={handleCopy}
        className={`btn btn-outline ${styles.btnSm}`}
      >
        {copied ? 'Copied!' : 'Copy markdown'}
      </button>
      <a
        href={mdUrl}
        target="_blank"
        rel="noreferrer"
        className={`btn btn-outline ${styles.btnSm}`}
      >
        View markdown
      </a>
    </div>
  );
}

export default function DocItemContent({children}: {children: ReactNode}): ReactNode {
  const syntheticTitle = useSyntheticTitle();

  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {syntheticTitle && (
        <header>
          <Heading as="h1">{syntheticTitle}</Heading>
        </header>
      )}
      <MarkdownButtons />
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
