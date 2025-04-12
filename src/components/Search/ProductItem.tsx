import React, { createElement } from 'react';

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
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = hit.url;
  };
  
  return (
    <a 
      href={hit.url} 
      onClick={handleClick}
      className="search-item-link px-2 py-2 flex whitespace-pre-wrap  text-blue-600"
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
          {(hit.url.includes('https://docs.seqera.io/platform') || hit.url.includes('https://docs.seqera.io/changelog/page') || hit.url.includes('https://docs.seqera.io/changelog/tags/seqera-enterprise')) && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className="text-xs mr-2 px-2 py-1 bg-product-100 rounded-md text-product-1000">Seqera Platform</span>
              {hit._highlightResult?.version?.[0]?.value && (
                <span className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-1000 whitespace-pre-wrap"><components.Highlight hit={hit._highlightResult.version[0]} attribute="value" tagName="b" className="whitespace-pre-wrap" /></span>
              )}
            </div>
          )}
          {(hit.url.match(/https:\/\/docs\.seqera\.io\/([^\/]+)/)?.[1] === 'wave' || hit.url.includes('https://docs.seqera.io/changelog/tags/wave') || hit.url.includes('https://docs.seqera.io/changelog/wave')) && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className="text-xs mr-2 px-2 py-1 bg-wave-100 rounded-md text-wave-1000">Wave</span>
              {hit._highlightResult?.version?.[0]?.value && (
                <span className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-1000 whitespace-pre-wrap"><components.Highlight hit={hit._highlightResult.version[0]} attribute="value" tagName="b" className="whitespace-pre-wrap" /></span>
              )}
            </div>
          )}
          {(hit.url.match(/https:\/\/docs\.seqera\.io\/([^\/]+)/)?.[1] === 'multiqc' || hit.url.includes('https://docs.seqera.io/changelog/tags/multiqc') || hit.url.includes('https://docs.seqera.io/changelog/multiqc')) && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className="text-xs mr-2 px-2 py-1 bg-multiqc-100 rounded-md text-multiqc-1000">MultiQC</span>
              {hit._highlightResult?.version?.[0]?.value && (
                <span className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-1000 whitespace-pre-wrap"><components.Highlight hit={hit._highlightResult.version[0]} attribute="value" tagName="b" className="whitespace-pre-wrap" /></span>
              )}
            </div>
          )}
          {(hit.url.match(/https:\/\/docs\.seqera\.io\/([^\/]+)/)?.[1] === 'fusion' || hit.url.includes('https://docs.seqera.io/changelog/tags/fusion') || hit.url.includes('https://docs.seqera.io/changelog/fusion')) && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className="text-xs mr-2 px-2 py-1 bg-fusion-100 rounded-md text-fusion-1000">Fusion</span>
              {hit._highlightResult?.version?.[0]?.value && (
                <span className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-1000 whitespace-pre-wrap"><components.Highlight hit={hit._highlightResult.version[0]} attribute="value" tagName="b" className="whitespace-pre-wrap" /></span>
              )}
            </div>
          )}
          {(hit.url.match(/https:\/\/docs\.seqera\.io\/([^\/]+)/)?.[1] === 'nextflow' || hit.url.includes('https://docs.seqera.io/changelog/tags/nextflow') || hit.url.includes('https://docs.seqera.io/changelog/nextflow')) && (
            <div className="flex items-start pb-2 last:pb-0">
              <span className="text-xs mr-2 px-2 py-1 bg-nextflow-100 rounded-md text-nextflow-1000">Nextflow</span>
              {hit._highlightResult?.version?.[0]?.value && (
                <span className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-1000 whitespace-pre-wrap"><components.Highlight hit={hit._highlightResult.version[0]} attribute="value" tagName="b" className="whitespace-pre-wrap" /></span>
              )}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}