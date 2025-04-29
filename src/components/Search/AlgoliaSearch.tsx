import { autocomplete } from '@algolia/autocomplete-js';
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import '@algolia/autocomplete-theme-classic';
import { createRoot } from 'react-dom/client';
import './algolia-theme.css';

import algoliaStyles from "./AlgoliaSearch.module.css";

interface SearchHit {
  url: string;
  [key: string]: any;
}

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
      placeholder: 'Search docs or ask with Seqera AI...',
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
      shouldPanelOpen: ({ state, ...rest }) => {
        if (typeof props.shouldPanelOpen === 'function') {
          return props.shouldPanelOpen({ state, ...rest });
        }
        return true;
      },
      getSources: (params) => {
        // Call the user's getSources, but inject getItemUrl into each source
        const userSources = props.getSources ? props.getSources(params) : [];
        return userSources.map(source => ({
          ...source,
          getItemUrl: ({ item }) => {
            return item.url;
          },
        }));
      },
      navigator: {
        navigate({ itemUrl }) {
          window.location.assign(itemUrl);
        },
        navigateNewTab({ itemUrl }) {
          const windowReference = window.open(itemUrl, '_blank', 'noopener');
          if (windowReference) {
            windowReference.focus();
          }
        },
        navigateNewWindow({ itemUrl }) {
          window.open(itemUrl, '_blank', 'noopener');
        },
      },
      onSubmit: ({ state, event }) => {
        event.preventDefault(); // Prevents panel from closing and input from blurring
        // You can add custom logic here, for example:
        // window.location.href = `https://seqera.io/ask-ai?prompt=${encodeURIComponent(state.query)}`;
      },
      ...props,
    });

    return () => {
      // Clean up event listeners
      search.destroy();
    };
  }, [props]);

  return <div className="w-full rounded-md text-sm bg-white " ref={containerRef} />;
}

export default Autosearch;