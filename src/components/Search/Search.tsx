import React, { createElement, useState, useEffect, useRef } from "react";

// Import the required components
import ProductItem from './ProductItem';
import { getAlgoliaResults } from '@algolia/autocomplete-js';
// Use direct CommonJS import pattern
import Autosearch from "./AlgoliaSearch";
import AiIcon from "../../theme/Navbar/Layout/SeqeraHeader/HeaderDesktop/NavItems/images/AiIcon";
// import algoliasearch from "algoliasearch/lite";
import {algoliasearch} from 'algoliasearch';

// Define environment variable types
declare global {
  interface ImportMeta {
    env: {
      PUBLIC_ALGOLIA_APP_ID: string;
      PUBLIC_ALGOLIA_API_KEY: string;
    };
  }
}

// const appId = import.meta.env.PUBLIC_ALGOLIA_APP_ID;
// const apiKey = import.meta.env.PUBLIC_ALGOLIA_API_KEY;
// Initialize the client the correct way
const searchClient = algoliasearch(appId, apiKey);

// Add getRecommendations method manually
// searchClient.getRecommendations = async () => ({ results: [] });
(searchClient as any).getRecommendations = async () => ({ results: [] });

export default function Search() {
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
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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
            className="w-full max-w-2xl bg-white rounded-md left-20 border-blue-500 border p-2"
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
                  // Add more class overrides as needed
                }}
                getSources={({ query }) => [
                  {
                    sourceId: 'docs',
                    getItems() {
                      return getAlgoliaResults({
                        searchClient,
                        queries: [
                          {
                            indexName: 'Docs crawler',
                            params: {
                              query,
                              hitsPerPage: 4,
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
                      header() {
                        return <div className="text-gray-1000 font-medium typo-small">Documentation</div>;
                      },
                      footer({ state }) {
                        return (
                          <ul className="typo-small">
                            <li className="text-gray-1000 font-medium typo-small aa-SourceFooterHeader">Suggested</li>
                            <li className="aa-Item hover:bg-gray-100">
                              <a href={`/ask-ai?prompt=${state?.query || ''}`} className="aa-ItemLink flex items-center p-3">
                                <div className="aa-ItemContent">
                                  <div className="aa-ItemTitle flex items-center">
                                    <AiIcon className="mr-2 w-5 h-5" />
                                    Ask Seqera AI
                                  </div>
                                </div>
                              </a>
                            </li>
                          </ul>
                        );
                      },
                    },
                  },
                ]}
                renderNoResults={({ render, html, state }, root) => { 
                  render(
                    <ul className="typo-small">
                      <li className="text-gray-1000 font-medium typo-small">Suggested</li>
                      <li className="aa-Item hover:bg-gray-100">
                        <a href="/ask-ai/" className="aa-ItemLink flex items-center p-3">
                          <div className="aa-ItemContent">
                            <div className="aa-ItemTitle flex items-center">
                              <AiIcon className="mr-2 w-5 h-5" />
                              Ask Seqera AI
                            </div>
                          </div>
                        </a>
                      </li>
                    </ul>,
                    root
                  );
                }}
                renderFooter={null}
                debug={true}
                onClose={() => setIsOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Optional: Add a button to open the search */}
      <div 
        onClick={() => setIsOpen(true)}
        className="md:flex items-center px-3 py-2 rounded-md text-sm text-gray-700 cursor-pointer"
        style={{ 
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.15)',
          height: '44px',
        }}
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search docs... 
        <span className="ml-2 text-xs border border-gray-300 px-1.5 py-0.5 rounded">⌘K</span>
      </div>
    </>
  );
}