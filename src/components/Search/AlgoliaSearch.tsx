import { autocomplete } from '@algolia/autocomplete-js';
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import '@algolia/autocomplete-theme-classic';
import { createRoot } from 'react-dom/client';
import './algolia-theme.css';

import algoliaStyles from "./AlgoliaSearch.module.css";

export function Autosearch(props) {
  const containerRef = useRef(null);
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const search = autocomplete({
      container: containerRef.current,
      placeholder: 'Search documentation, pipelines, case studies...',
      openOnFocus: true,
      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;

          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        panelRootRef.current.render(children);
      },
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, [props]);

  return <div className="w-full rounded-md text-sm bg-white " ref={containerRef} />;
}


export default Autosearch;