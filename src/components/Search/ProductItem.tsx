import React, { createElement } from 'react';
import styles from "./AlgoliaSearch.module.css";

// Create a simple event system for closing the modal
// This will be a globally accessible function that components can call
let closeSearchModalCallback = null;

// Function to set the callback
export const setCloseSearchModalCallback = (callback) => {
  closeSearchModalCallback = callback;
};

// Function to trigger the callback
export const closeSearchModal = () => {
  if (typeof closeSearchModalCallback === 'function') {
    closeSearchModalCallback();
  }
};

export default function ProductItem({ hit, components }) {
  // Handle both array format (current data) and object format (new indexing script)
  let lvl0, lvl1;
  
  if (Array.isArray(hit.hierarchy)) {
    // Current format: hierarchy is an array
    lvl0 = hit.hierarchy[0] || '';
    lvl1 = hit.hierarchy[1] || '';
  } else if (hit.hierarchy && typeof hit.hierarchy === 'object') {
    // New format: hierarchy is an object
    lvl0 = hit.hierarchy.lvl0 || '';
    lvl1 = hit.hierarchy.lvl1 || '';
  } else {
    lvl0 = '';
    lvl1 = '';
  }

  // Extract version from URL path
  const getVersionFromUrl = (url) => {
    const versionMatch = url.match(/\/platform-enterprise\/(\d+\.\d+)\//);
    return versionMatch ? versionMatch[1] : null;
  };

  const urlVersion = getVersionFromUrl(hit.url);

  return (
    <a 
      href={hit.url} 
      className="aa-ItemLink search-item-link px-2 py-2 flex whitespace-pre-wrap text-blu-600"
    >
      <div className="flex flex-row w-full gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start pb-2 last:pb-0 text-sm text-slate-1000 break-words">
            <span className="break-words">
              {/* Try highlighting first, fallback to plain text */}
              {hit._highlightResult?.hierarchy?.lvl0?.value ? (
                <components.Highlight hit={hit._highlightResult.hierarchy.lvl0} attribute="value" tagName="b" />
              ) : (
                lvl0
              )}
            </span>
          </div>
          <div className="flex items-start pb-2 last:pb-0 text-xs text-slate-500 break-words">
            <span className="break-words">
              {hit._highlightResult?.hierarchy?.lvl1?.value ? (
                <components.Highlight hit={hit._highlightResult.hierarchy.lvl1} attribute="value" tagName="b" />
              ) : (
                lvl1
              )}
            </span>
          </div>
          
          {/* Content preview */}
          {hit.content && (
            <div className="flex items-start pb-2 last:pb-0 text-xs text-slate-400 break-words">
              <span className="break-words line-clamp-2">
                {hit._highlightResult?.content?.value ? (
                  <components.Highlight hit={hit._highlightResult.content} attribute="value" tagName="b" />
                ) : (
                  hit.content.substring(0, 120) + (hit.content.length > 120 ? '...' : '')
                )}
              </span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          {hit.url.includes('/platform/') && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productItemCta} text-xs mr-2 px-2 py-1 rounded-md`}>Seqera Enterprise</span>
              {(hit._highlightResult?.version?.[0]?.value || urlVersion) && (
                <span className={`${styles.productItemVersion} text-xs px-2 py-1 rounded-md whitespace-pre-wrap`}>
                  {hit._highlightResult?.version?.[0]?.value ? (
                    <components.Highlight hit={hit._highlightResult.version[0]} attribute="value" tagName="b" className="whitespace-pre-wrap" />
                  ) : (
                    `v${urlVersion}`
                  )}
                </span>
              )}
            </div>
          )}
          {hit.url.includes('/platform-cloud/') && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productItemCta} text-xs mr-2 px-2 py-1 rounded-md`}>Seqera Cloud</span>
              <span className={`${styles.productItemVersion} text-xs px-2 py-1 rounded-md whitespace-pre-wrap`}>Latest</span>
            </div>
          )}
          {hit.url.includes('/api/') && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productApi} text-xs mr-2 px-2 py-1 rounded-md`}>Seqera Platform API</span>
            </div>
          )}
          {hit.url.includes('/wave/') && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productWave} text-xs mr-2 px-2 py-1 rounded-md`}>Wave</span>
              <span className={`${styles.productItemVersion} text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-1000 whitespace-pre-wrap`}>Latest</span>
            </div>
          )}
          {hit.url.includes('/multiqc/') && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productMultiQC} text-xs mr-2 px-2 py-1 rounded-md`}>MultiQC</span>
              <span className={`${styles.productItemVersion} text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-1000 whitespace-pre-wrap`}>Latest</span>
            </div>
          )}
          {hit.url.includes('/fusion/') && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productFusion} text-xs mr-2 px-2 py-1 rounded-md`}>Fusion</span>
              <span className={`${styles.productItemVersion} text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-1000 whitespace-pre-wrap`}>Latest</span>
            </div>
          )}
          {hit.url.includes('/nextflow/') && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productNextflow} text-xs mr-2 px-2 py-1 rounded-md`}>Nextflow</span>
              <span className={`${styles.productItemVersion} text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-1000 whitespace-pre-wrap`}>Latest</span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
