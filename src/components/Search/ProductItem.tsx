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
  // Modify highlight results to preserve spaces between highlighted terms
  // const modifyHighlightValue = (highlightObj) => {
  //   if (!highlightObj || !highlightObj.value) return highlightObj;
    
  //   const modified = { ...highlightObj };
  //   modified.value = modified.value.replace(/(<\/b>)(<b>)/g, '$1&nbsp;$2');
  //   return modified;
  // };

  // // Create modified versions of all highlight results
  // const modifiedHighlights = {
  //   hierarchy: {
  //     lvl0: modifyHighlightValue(hit._highlightResult?.hierarchy?.lvl0),
  //     lvl1: modifyHighlightValue(hit._highlightResult?.hierarchy?.lvl1),
  //     content: modifyHighlightValue(hit._highlightResult?.hierarchy?.content)
  //   },
  //   version: Array.isArray(hit._highlightResult?.version) 
  //     ? hit._highlightResult.version.map(v => modifyHighlightValue(v)) 
  //     : []
  // };

  // // Replace the original highlight results with modified ones
  // hit._highlightResult = {
  //   ...hit._highlightResult,
  //   hierarchy: modifiedHighlights.hierarchy,
  //   version: modifiedHighlights.version
  // };
  
  return (
    <a 
      href={hit.url} 
      className="search-item-link px-2 py-2 flex whitespace-pre-wrap"
    >
      {/* <div className="flex flex-col flex-1/12">
        <img src="/images/icons/docs_search.svg" alt="Documentation search" className="w-6 h-6" />
      </div> */}
      <div className="flex flex-col flex-11/12 whitespace-pre-wrap">
        <div className="flex items-start pb-2 last:pb-0 text-sm text-slate-1000 whitespace-pre-wrap">
          {/* {hit._highlightResult.hierarchy.lvl0.value} */}
          <span className="whitespace-pre-wrap"><components.Highlight hit={hit._highlightResult.hierarchy.lvl0} attribute="value" tagName="b" className="whitespace-pre-wrap" /></span>
        </div>
        <div className="flex items-start pb-2 last:pb-0 text-xs text-slate-500 whitespace-pre-wrap">
          {/* {hit.hierarchy.lvl1} */}
          {/* <components.Snippet hit={hit.hierarchy} attribute="lvl1" tagName="em" /> */}
          <span className="whitespace-pre-wrap"><components.Highlight hit={hit._highlightResult.hierarchy.lvl1} attribute="value" tagName="b" className="whitespace-pre-wrap" /></span>
          {/* <span className="whitespace-pre-wrap"><components.Highlight hit={hit._snippetResult.content} attribute="value" tagName="b" className="whitespace-pre-wrap" /></span> */}
        </div>
        {/* <div className="flex items-start pb-2 last:pb-0 text-xs text-slate-500 whitespace-pre-wrap"> */}
          {/* {hit.hierarchy.lvl1} */}
          {/* <components.Snippet hit={hit.hierarchy} attribute="content" tagName="em" /> */}
          {/* <components.Snippet hit={hit._highlightResult.hierarchy.content} attribute="value" tagName="b" className="whitespace-pre-wrap" /> */}
          {/* <span className="whitespace-pre-wrap"><components.Highlight hit={hit._snippetResult.content} attribute="value" tagName="b" className="whitespace-pre-wrap" /></span> */}
        {/* </div> */}
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
        {/* {hit.url.match(/https:\/\/docs\.seqera\.io\/([^\/]+)/)?.[1] !== 'platform' && 
         hit.url.match(/https:\/\/docs\.seqera\.io\/([^\/]+)/)?.[1] !== 'wave' &&
         hit.url.match(/https:\/\/docs\.seqera\.io\/([^\/]+)/)?.[1] !== 'multiqc' &&
         hit.url.match(/https:\/\/docs\.seqera\.io\/([^\/]+)/)?.[1] !== 'fusion' &&
         hit.url.match(/https:\/\/docs\.seqera\.io\/([^\/]+)/)?.[1] !== 'nextflow' &&
         !hit.url.includes('https://docs.seqera.io/changelog') && (
          <div className="flex items-start pb-2 last:pb-0">
            Seqera
          </div>
        )} */}
      </div>
    </a>
  );
}