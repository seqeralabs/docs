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
  return (
    <a 
      href={hit.url} 
      className="aa-ItemLink search-item-link px-2 py-2 flex whitespace-pre-wrap  text-blu-600"
    >
      <div className="flex flex-row w-full gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start pb-2 last:pb-0 text-sm text-slate-1000 break-words">
            <span className="break-words"><components.Highlight hit={hit._highlightResult.hierarchy.lvl0} attribute="value" tagName="b" /></span>
          </div>
          <div className="flex items-start pb-2 last:pb-0 text-xs text-slate-500 break-words">
            <span className="break-words"><components.Highlight hit={hit._highlightResult.hierarchy.lvl1} attribute="value" tagName="b" /></span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          {(hit.url.includes('https://docs.seqera.io/platform-enterprise') || hit.url.includes('https://docs.seqera.io/changelog/page') || hit.url.includes('https://docs.seqera.io/changelog/seqera-enterprise/')) && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productItemCta} text-xs mr-2 px-2 py-1  rounded-md `}>Seqera Enterprise</span>
              {hit._highlightResult?.version?.[0]?.value && (
                <span className={`${styles.productItemVersion} text-xs px-2 py-1  rounded-md whitespace-pre-wrap`}><components.Highlight hit={hit._highlightResult.version[0]} attribute="value" tagName="b" className="whitespace-pre-wrap" /></span>
              )}
            </div>
          )}
          {(hit.url.includes('https://docs.seqera.io/platform-cloud') || hit.url.includes('https://docs.seqera.io/changelog/seqera-cloud/')) && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productItemCta} text-xs mr-2 px-2 py-1  rounded-md `}>Seqera Cloud</span>
              {hit._highlightResult?.version?.[0]?.value && (
                <span className={`${styles.productItemVersion} text-xs px-2 py-1 rounded-md whitespace-pre-wrap`}>Latest</span>
              )}
            </div>
          )}
          {(hit.url.includes('https://docs.seqera.io/platform-api') || hit.url.includes('https://docs.seqera.io/changelog/seqera-api/')) && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productApi} text-xs mr-2 px-2 py-1 rounded-md `}>Seqera Platform API</span>
            </div>
          )}
          {(hit.url.includes('https://docs.seqera.io/wave') || hit.url.match(/https:\/\/docs\.seqera\.io\/([^\/]+)/)?.[1] === 'wave' || hit.url.includes('https://docs.seqera.io/changelog/tags/wave') || hit.url.includes('https://docs.seqera.io/changelog/wave')) && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productWave} text-xs mr-2 px-2 py-1 rounded-md`}>Wave</span>
              {hit._highlightResult?.version?.[0]?.value && (
                <span className={`${styles.productItemVersion} text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-1000 whitespace-pre-wrap`}>Latest</span>
              )}
            </div>
          )}
          {(hit.url.match(/https:\/\/docs\.seqera\.io\/([^\/]+)/)?.[1] === 'multiqc' || hit.url.includes('https://docs.seqera.io/changelog/tags/multiqc') || hit.url.includes('https://docs.seqera.io/changelog/multiqc')) && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productMultiQC} text-xs mr-2 px-2 py-1 rounded-md `}>MultiQC</span>
              {hit._highlightResult?.version?.[0]?.value && (
                <span className={`${styles.productItemVersion} text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-1000 whitespace-pre-wrap`}>Latest</span>
              )}
            </div>
          )}
          {(hit.url.match(/https:\/\/docs\.seqera\.io\/([^\/]+)/)?.[1] === 'fusion' || hit.url.includes('https://docs.seqera.io/changelog/tags/fusion') || hit.url.includes('https://docs.seqera.io/changelog/fusion')) && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productFusion} text-xs mr-2 px-2 py-1 rounded-md `}>Fusion</span>
              {hit._highlightResult?.version?.[0]?.value && (
                <span className={`${styles.productItemVersion} text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-1000 whitespace-pre-wrap`}>Latest</span>
              )}
            </div>
          )}
          {(hit.url.match(/https:\/\/docs\.seqera\.io\/([^\/]+)/)?.[1] === 'nextflow' || hit.url.includes('https://docs.seqera.io/changelog/tags/nextflow') || hit.url.includes('https://docs.seqera.io/changelog/nextflow')) && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className={`${styles.productNextflow} text-xs mr-2 px-2 py-1 rounded-md `}>Nextflow</span>
              {hit._highlightResult?.version?.[0]?.value && (
                <span className={`${styles.productItemVersion} text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-1000 whitespace-pre-wrap`}>Latest</span>
              )}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}