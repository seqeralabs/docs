import React, { createElement, useState, useEffect, useRef } from "react";

// Import the required components
import ProductItem, { setCloseSearchModalCallback } from './ProductItem';
import { getAlgoliaResults } from '@algolia/autocomplete-js';
// Use direct CommonJS import pattern
import Autosearch from "./AlgoliaSearch";
import AiIcon from "../../theme/Navbar/Layout/SeqeraHeader/HeaderDesktop/NavItems/images/AiIcon";
import SearchIcon from "./SearchIcon";
// Import algoliasearch
import algoliasearch from 'algoliasearch';

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Search() {
  const {siteConfig} = useDocusaurusContext();
  const algoliaConfig = siteConfig.customFields?.algolia as any || {};
  const appId = algoliaConfig.appId;
  const apiKey = algoliaConfig.apiKey;
  const envIndexName = algoliaConfig.indexName;

  // Create the search client
  const searchClient = algoliasearch(appId, apiKey);
  
  // Add getRecommendations method to the client to fix the linter error
  (searchClient as any).getRecommendations = async () => ({ results: [] });

  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle keyboard shortcut (Command+K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Command+K (Mac) or Ctrl+K (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(prevIsOpen => !prevIsOpen);
      }
      // Close on Escape key
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Disable body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current scroll position
      const scrollY = window.scrollY;
      
      // Add styles to prevent scrolling on the body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Re-enable scrolling when component unmounts or modal closes
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small timeout to ensure the input is in the DOM
      setTimeout(() => {
        // Direct focus to the input element inside the Autosearch container
        const inputElement = containerRef.current?.querySelector('input');
        if (inputElement) {
          inputElement.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is inside the modal or any Algolia autocomplete elements
      const isInsideModal = modalRef.current && modalRef.current.contains(event.target as Node);
      
      // Check if the click is inside any Algolia autocomplete elements
      const isInsideAutocomplete = 
        (event.target as Element)?.closest('.aa-Panel')
      
      if (!isInsideModal && !isInsideAutocomplete) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Add custom styling to fix z-index issues
  useEffect(() => {
    if (isOpen) {
      // Apply CSS to ensure dropdowns appear above the modal
      const style = document.createElement('style');
      style.id = 'search-z-index-fix';
      style.innerHTML = `
        .aa-Panel {
          z-index: 9999 !important;
        }
        .aa-DetachedOverlay {
          z-index: 9998 !important;
        }
        .aa-DetachedContainer {
          z-index: 9999 !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        // Clean up when component unmounts or modal closes
        const styleElement = document.getElementById('search-z-index-fix');
        if (styleElement) {
          styleElement.remove();
        }
      };
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-40 flex items-start justify-center pt-1">
          <div 
            ref={modalRef} 
            className="w-full max-w-2xl bg-white rounded-tl-md rounded-tr-md top-20 border-blue-500 border p-2"
            style={{ position: 'relative', zIndex: 50, maxHeight: '80vh', overflowY: 'auto' }}
          >
            <div ref={containerRef}>
              <Autosearch
                openOnFocus={true}
                classNames={{
                  form: 'custom-search-form',
                  input: 'custom-search-input',
                  panel: 'custom-search-panel',
                  item: 'custom-search-item',
                }}
                getSources={({ query }) => {
                  if (!query) {
                    return [{
                      sourceId: 'empty-state',
                      getItems() {
                        return [];
                      },
                      templates: {
                        header() {
                          return (
                            <div className="flex flex-col w-full m-0 p-0">
                              <ul className="typo-small flex flex-col w-full p-0 m-0">
                                <li className=" hover:bg-gray-100 flex flex-row w-full">
                                  <a 
                                    href={`https://seqera.io/ask-ai`} 
                                    onClick={(e) => {
                                      e.preventDefault();
                                      window.location.href = 'https://seqera.io/ask-ai';
                                    }}
                                    className="aa-ItemLink flex items-center p-3"
                                  >
                                    <div className="aa-ItemContent">
                                      <div className="flex items-center font-normal">
                                        <AiIcon className="mr-2 w-5 h-5" />
                                        Start a new thread with Seqera AI
                                      </div>
                                    </div>
                                  </a>
                                </li>
                              </ul>
                              <div className="text-gray-1000 font-medium typo-small px-3 py-2 mt-1">Documentation</div>
                            </div>
                          );
                        },
                        noResults() {
                          return (
                            <div className="pt-0 pb-6 text-sm text-gray-500">
                              Search documentation or ask with Seqera AI...
                            </div>
                          );
                        }
                      }
                    }];
                  }
                  
                  return [{
                    sourceId: 'docs',
                    getItems() {
                      return getAlgoliaResults({
                        searchClient,
                        queries: [
                          {
                            indexName: envIndexName,
                            params: {
                              query,
                              hitsPerPage: 5,
                              attributesToHighlight: ['*'],
                            },
                          },
                        ],
                      });
                    },
                    templates: {
                      item({ item, components }) {
                        return <ProductItem hit={item} components={components} />;
                      },
                      header({state}) {
                        return (
                          <div className="flex flex-col w-full m-0 p-0">
                            <ul className="typo-small flex flex-col w-full p-0 m-0">
                              <li className=" hover:bg-gray-100 flex flex-row w-full">
                                <a 
                                  href={`https://seqera.io/ask-ai?prompt=${state?.query || ''}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    window.location.href = `https://seqera.io/ask-ai?prompt=${state?.query || ''}`;
                                  }}
                                  className="aa-ItemLink flex items-center p-3"
                                >
                                  <div className="aa-ItemContent">
                                    <div className="flex items-center font-normal">
                                      <AiIcon className="mr-2 w-5 h-5" />
                                      Start a new thread with Seqera AI
                                    </div>
                                  </div>
                                </a>
                              </li>
                            </ul>
                            <div className="text-gray-1000 font-medium typo-small px-3 py-2 mt-1">Documentation</div>
                          </div>
                        );
                      },
                      noResults({ state }) {
                        return (
                          <div className="typo-small">
                            <p className="text-gray-1000 font-medium typo-small">No results for "<b>{`${state?.query}`}</b>"</p>
                          </div>
                        );
                      }
                    }
                  }];
                }}
                debug={true}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Optional: Add a button to open the search */}
      <div 
        onClick={() => setIsOpen(true)}
        className="md:flex items-center px-3 py-2 rounded-md text-sm text-gray-800 cursor-pointer hover:text-gray-1000 transition-all duration-100 min-w-50"
        style={{ 
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.25)',
          height: '44px',
        }}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search docs... 
        <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ border: '1px solid #d1d5db' }}>⌘K</span>
      </div>
    </>
  );
}