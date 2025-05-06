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
        event.preventDefault();
        const query = state.query?.trim();
        if (!query) {
          // If the input is empty, do nothing
          return;
        }
        // If there is text but no item is selected
        if (typeof state.activeItemId !== 'number') {
          // Find the first non-ai item (docs result) in the collections
          const collections = state.collections || [];
          for (const collection of collections) {
            if (collection.source && collection.source.sourceId === 'docs') {
              const firstDoc = collection.items && collection.items[0];
              if (firstDoc && firstDoc.url) {
                window.location.assign(String(firstDoc.url));
                return;
              }
            }
          }
          // If no docs result, do nothing
          return;
        }
        // Otherwise, let Algolia handle navigation (should be handled by navigator)
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