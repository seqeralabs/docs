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
      onSubmit: ({ state }) => {
        // Try to get the first result
        const firstResult = state.collections.find(c => c.items.length > 0)?.items[0] as SearchHit | undefined;
        
        if (firstResult?.url) {
          // If we have a result, navigate to it
          window.location.href = firstResult.url;
        } else {
          // If no results, redirect to Seqera AI with the query as prompt
          window.location.href = `https://seqera.io/ask-ai?prompt=${encodeURIComponent(state.query)}`;
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