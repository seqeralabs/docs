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

    // Add form submission prevention
    const preventFormSubmission = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Find and handle the form element
    const formElement = containerRef.current.querySelector('form');
    if (formElement) {
      formElement.addEventListener('submit', preventFormSubmission);
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
        // Call the user's getSources, but inject onSelect into each source
        const userSources = props.getSources ? props.getSources(params) : [];
        return userSources.map(source => ({
          ...source,
          onSelect({ item }) {
            if (item && item.url) {
              window.location.href = item.url;
            }
          },
        }));
      },
      onSubmit: ({ state }) => {
        // Find the currently highlighted item (if any)
        const { activeItemId, collections, query } = state;
        let selectedItem = null;

        // Flatten all items with their sourceId
        const allItems = collections.flatMap((collection, sourceIdx) =>
          collection.items.map((item, itemIdx) => ({
            item,
            sourceId: collection.source.sourceId,
            globalIndex: collections.slice(0, sourceIdx).reduce((acc, c) => acc + c.items.length, 0) + itemIdx,
            itemIdx,
            sourceIdx,
          }))
        );

        // If an item is highlighted, use it
        if (typeof activeItemId === 'number' && allItems[activeItemId]) {
          selectedItem = allItems[activeItemId].item;
        } else {
          // Otherwise, find the first docs result (first item in 'docs' source)
          const docsCollection = collections.find(c => c.source.sourceId === 'docs');
          if (docsCollection && docsCollection.items.length > 0) {
            selectedItem = docsCollection.items[0];
          } else {
            // Fallback: use the first AI result if present
            const aiCollection = collections.find(c => c.source.sourceId === 'ai-thread');
            if (aiCollection && aiCollection.items.length > 0) {
              selectedItem = aiCollection.items[0];
            }
          }
        }

        if (selectedItem && selectedItem.url) {
          window.location.href = selectedItem.url;
        } else {
          // Fallback: redirect to AI with the query
          window.location.href = `https://seqera.io/ask-ai?prompt=${encodeURIComponent(query)}`;
        }
        return false;
      },
      ...props,
    });

    return () => {
      // Clean up event listeners
      if (formElement) {
        formElement.removeEventListener('submit', preventFormSubmission);
      }
      search.destroy();
    };
  }, [props]);

  return <div className="w-full rounded-md text-sm bg-white " ref={containerRef} />;
}

export default Autosearch;