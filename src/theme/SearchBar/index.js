/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Swizzled from docusaurus-theme-search-typesense SearchBar.
 * Adds full hierarchy breadcrumbs and product labels to the path shown
 * under each modal result. Product routes are configured via
 * themeConfig.typesense.productRoutes.
 */
import React, { useState, useRef, useCallback, useMemo } from 'react';
// @ts-ignore
import { createPortal } from 'react-dom';
// @ts-ignore
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// @ts-ignore
import { useHistory } from '@docusaurus/router';
// @ts-ignore
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
// @ts-ignore
import Link from '@docusaurus/Link';
// @ts-ignore
import { isRegexpStringMatch } from '@docusaurus/theme-common';
import { DocSearchButton, useDocSearchKeyboardEvents, } from 'typesense-docsearch-react';
import { useTypesenseContextualFilters } from 'docusaurus-theme-search-typesense/client';
// @ts-ignore
import Translate from '@docusaurus/Translate';
// @ts-ignore
import translations from '@theme/SearchTranslations';
import { DocsPreferredVersionContextProvider } from '@docusaurus/plugin-content-docs/lib/client/index.js';
let DocSearchModal = null;
function Hit({ hit, children, }) {
    return <Link to={hit.url}>{children}</Link>;
}
function ResultsFooter({ state, onClose }) {
    const { siteConfig: { baseUrl }, } = useDocusaurusContext();
    return (<Link to={`${baseUrl}search?q=${encodeURIComponent(state.query)}`} onClick={onClose}>
      <Translate id="theme.SearchBar.seeAll" values={{ count: state.context.nbHits }}>
        {'See all {count} results'}
      </Translate>
    </Link>);
}
/**
 * Resolve a product label from a URL pathname using the configured productRoutes.
 */
function getProductLabel(pathname, productRoutes) {
    const match = productRoutes.find(([prefix]) => pathname.startsWith(prefix));
    return match ? match[1] : null;
}
/**
 * Build a breadcrumb string from all ancestor hierarchy levels of a hit.
 * For lvl2+ and content hits this replaces the single-level hierarchy.lvl1
 * path with the full parent chain (e.g. "Nextflow › Getting Started › Installation").
 *
 * When productRoutes are provided, the first level (lvl0, typically "Documentation")
 * is replaced with the product name derived from the hit URL.
 */
function buildBreadcrumb(item, productLabel) {
    const { type } = item;
    const maxLevel = type === 'content' ? 7 : parseInt(type.replace('lvl', ''), 10);
    const parts = [];
    for (let i = 0; i < maxLevel; i++) {
        const val = item[`hierarchy.lvl${i}`];
        if (val)
            parts.push(val);
    }
    // Replace lvl0 (typically "Documentation") with the product label
    if (parts.length > 0 && productLabel) {
        parts[0] = productLabel;
    }
    if (parts.length <= 1)
        return null;
    const SEP = ' › ';
    const MAX_LEN = 50;
    const full = parts.join(SEP);
    if (full.length <= MAX_LEN || parts.length <= 2)
        return full;
    // Always keep first and last. Add middle parts (left to right) until
    // the next one would push the string over the limit.
    const first = parts[0];
    const last = parts[parts.length - 1];
    const middle = [];
    for (let i = 1; i < parts.length - 1; i++) {
        const candidate = [first, ...middle, parts[i], '\u2026', last].join(SEP);
        if (candidate.length > MAX_LEN)
            break;
        middle.push(parts[i]);
    }
    // If all middle parts fit, no ellipsis needed (edge case: full was
    // over limit due to rounding but each candidate fit).
    if (middle.length === parts.length - 2)
        return full;
    return [first, ...middle, '\u2026', last].join(SEP);
}
function DocSearch({ contextualSearch, externalUrlRegex, productRoutes = [], ...props }) {
    const contextualSearchFacetFilters = useTypesenseContextualFilters();
    const configFacetFilters = props.typesenseSearchParameters?.filter_by ?? '';
    const facetFilters = contextualSearch
        ? [contextualSearchFacetFilters, configFacetFilters]
            .filter((e) => e)
            .join(' && ')
        : configFacetFilters;
    const typesenseSearchParameters = {
        filter_by: facetFilters,
        ...props.typesenseSearchParameters,
    };
    const { withBaseUrl } = useBaseUrlUtils();
    const history = useHistory();
    const searchContainer = useRef(null);
    const searchButtonRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [initialQuery, setInitialQuery] = useState(undefined);
    const importDocSearchModalIfNeeded = useCallback(() => {
        if (DocSearchModal) {
            return Promise.resolve();
        }
        return Promise.all([
            // @ts-ignore
            import('typesense-docsearch-react/modal'),
            // @ts-ignore
            import('typesense-docsearch-react/style'),
            // @ts-ignore
            import('./styles.css'),
        ]).then(([{ DocSearchModal: Modal }]) => {
            DocSearchModal = Modal;
        });
    }, []);
    const onOpen = useCallback(() => {
        importDocSearchModalIfNeeded().then(() => {
            searchContainer.current = document.createElement('div');
            document.body.insertBefore(searchContainer.current, document.body.firstChild);
            setIsOpen(true);
        });
    }, [importDocSearchModalIfNeeded]);
    const onClose = useCallback(() => {
        setIsOpen(false);
        searchContainer.current?.remove();
    }, []);
    const onInput = useCallback((event) => {
        importDocSearchModalIfNeeded().then(() => {
            setIsOpen(true);
            setInitialQuery(event.key);
        });
    }, [importDocSearchModalIfNeeded]);
    const navigator = useRef({
        navigate({ itemUrl }) {
            if (isRegexpStringMatch(externalUrlRegex, itemUrl)) {
                window.location.href = itemUrl;
            }
            else {
                history.push(itemUrl);
            }
        },
    }).current;
    const transformItems = useRef((items) => items.map((item) => {
        // Extract product label from the original absolute URL
        // (before transforming to relative, so new URL() works).
        let productLabel = null;
        if (productRoutes.length > 0) {
            try {
                const pathname = new URL(item.url).pathname;
                productLabel = getProductLabel(pathname, productRoutes);
            }
            catch {
                // URL parsing failed
            }
        }
        // Transform absolute URL to relative.
        const withRelativeUrl = isRegexpStringMatch(externalUrlRegex, item.url)
            ? item
            : {
                ...item,
                url: withBaseUrl(`${new URL(item.url).pathname}${new URL(item.url).hash}`),
            };
        // Helper to override a field and its highlight/snippet results
        // so the Snippet component renders our text instead of the original.
        const overrideField = (base, field, value) => ({
            ...base,
            [field]: value,
            _highlightResult: {
                ...base._highlightResult,
                [field]: { value, matchLevel: 'none', matchedWords: [] },
            },
            _snippetResult: {
                ...base._snippetResult,
                [field]: { value, matchLevel: 'none', matchedWords: [] },
            },
        });
        // For lvl1 results the path slot renders 'content' — put the product label there.
        if (item.type === 'lvl1' && productLabel) {
            return overrideField(withRelativeUrl, 'content', productLabel);
        }
        // For lvl2+/content results the path slot renders 'hierarchy.lvl1'.
        const breadcrumb = buildBreadcrumb(item, productLabel);
        if (breadcrumb) {
            return overrideField(withRelativeUrl, 'hierarchy.lvl1', breadcrumb);
        }
        return withRelativeUrl;
    })).current;
    const resultsFooterComponent = useMemo(() => 
    // eslint-disable-next-line react/no-unstable-nested-components
    (footerProps) => (<ResultsFooter {...footerProps} onClose={onClose}/>), [onClose]);
    useDocSearchKeyboardEvents({
        isOpen,
        onOpen,
        onClose,
        onInput,
        searchButtonRef,
    });
    return (<>
      <DocSearchButton onTouchStart={importDocSearchModalIfNeeded} onFocus={importDocSearchModalIfNeeded} onMouseOver={importDocSearchModalIfNeeded} onClick={onOpen} ref={searchButtonRef} translations={translations.button}/>
      {isOpen &&
            DocSearchModal &&
            searchContainer.current &&
            createPortal(<DocSearchModal onClose={onClose} initialScrollY={window.scrollY} initialQuery={initialQuery} navigator={navigator} transformItems={transformItems} hitComponent={Hit} {...(props.searchPagePath && { resultsFooterComponent })} {...props} typesenseSearchParameters={typesenseSearchParameters} typesenseServerConfig={props.typesenseServerConfig} typesenseCollectionName={props.typesenseCollectionName} placeholder={translations.placeholder} translations={translations.modal}/>, searchContainer.current)}
    </>);
}
export default function SearchBar() {
    const { siteConfig } = useDocusaurusContext();
    return (<DocsPreferredVersionContextProvider>
      <DocSearch {...siteConfig.themeConfig.typesense}/>
    </DocsPreferredVersionContextProvider>);
}
