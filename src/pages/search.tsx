import React, { useState, useEffect } from 'react';
import { InstantSearch, SearchBox, Hits, Pagination } from 'react-instantsearch-dom';
import { SearchClient } from '@algolia/client-search';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import ProductItem from '../components/Search/ProductItem';
import '../css/search.css';

// @ts-ignore
const getSearchClient = async (appId: string, apiKey: string): Promise<SearchClient> => {
  const algoliasearch = await import('algoliasearch');
  return algoliasearch(appId, apiKey);
};

export default function SearchPage() {
  const { siteConfig } = useDocusaurusContext();
  const algoliaConfig = siteConfig.customFields?.algolia as any || {};
  const [searchClient, setSearchClient] = useState<SearchClient | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getSearchClient(algoliaConfig.appId, algoliaConfig.apiKey).then(client => {
      setSearchClient(client);
    });
  }, [algoliaConfig.appId, algoliaConfig.apiKey]);

  // Get query from URL on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, []);

  if (!searchClient) {
    return (
      <Layout title="Search">
        <div className="container-xl px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="typo-h1 mb-8">Loading search...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Search">
      <div className="container-xl px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="typo-h1 mb-8">Search Documentation</h1>
          
          <InstantSearch 
            searchClient={searchClient} 
            indexName={algoliaConfig.indexName}
            insights={true}
          >
            <div className="mb-8">
              <SearchBox 
                placeholder="Search documentation..."
                className="w-full"
                defaultRefinement={query}
                searchAsYouType={true}
                submit={<></>}
                reset={<></>}
                translations={{
                  submitButtonTitle: 'Submit your search query',
                  resetButtonTitle: 'Clear your search query',
                  inputPlaceholder: 'Search documentation...',
                }}
              />
            </div>

            <div className="mb-8">
              <Hits 
                hitComponent={ProductItem}
                classNames={{
                  list: 'space-y-4',
                  item: 'p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors',
                }}
              />
            </div>

            <div className="flex justify-center">
              <Pagination 
                classNames={{
                  root: 'flex items-center space-x-2',
                  list: 'flex items-center space-x-2',
                  item: 'px-3 py-1 rounded hover:bg-gray-100',
                  selectedItem: 'bg-blue-500 text-white hover:bg-blue-600',
                  disabledItem: 'opacity-50 cursor-not-allowed',
                }}
              />
            </div>
          </InstantSearch>
        </div>
      </div>
    </Layout>
  );
} 