import React, { createElement } from "react";

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
  return (
    <Autosearch
      openOnFocus={true}
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
                    // filters: "type:content",
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
                  <li className="text-gray-1000 font-medium typo-small">Suggested</li>
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
    />
  );
}