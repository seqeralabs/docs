import { autocomplete } from '@algolia/autocomplete-js';
import React, { createElement, Fragment, useEffect, useRef } from 'react';
import '@algolia/autocomplete-theme-classic';
import { createRoot } from 'react-dom/client';

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
    //   onStateChange({ state }) {
    //     if (state.isOpen) {
    //       document.addEventListener('click', handleClickOutside);
    //     } else {
    //       document.removeEventListener('click', handleClickOutside);
    //     }
    //   },
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


    // // Function to detect clicks outside
    // function handleClickOutside(event) {
    //   const container = document.querySelector(containerRef.current);
    //   if (container && !container.contains(event.target)) {
    //     search.setStatus('idle'); // Close the panel
    //     document.removeEventListener('click', handleClickOutside);
    //   }
    // }

    return () => {
      search.destroy();
    };
  }, [props]);

  return <div className={algoliaStyles.searchContainer} ref={containerRef} />;
}


export default Autosearch;