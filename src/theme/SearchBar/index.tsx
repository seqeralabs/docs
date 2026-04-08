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

import React, {useState, useRef, useCallback, useMemo} from 'react';
// @ts-ignore
import {createPortal} from 'react-dom';
// @ts-ignore
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
// @ts-ignore
import {useHistory} from '@docusaurus/router';
// @ts-ignore
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
// @ts-ignore
import Link from '@docusaurus/Link';
// @ts-ignore
import {isRegexpStringMatch} from '@docusaurus/theme-common';
import {
  DocSearchButton,
  useDocSearchKeyboardEvents,
} from 'typesense-docsearch-react';
import {useTypesenseContextualFilters} from 'docusaurus-theme-search-typesense/client';
// @ts-ignore
import Translate from '@docusaurus/Translate';
// @ts-ignore
import translations from '@theme/SearchTranslations';
import {DocsPreferredVersionContextProvider} from '@docusaurus/plugin-content-docs/lib/client/index.js';

import type {
  DocSearchModal as DocSearchModalType,
  DocSearchModalProps,
} from 'typesense-docsearch-react';
import type {
  InternalDocSearchHit,
  StoredDocSearchHit,
} from 'typesense-docsearch-react/dist/esm/types';

type DocSearchProps = Omit<
  DocSearchModalProps,
  'onClose' | 'initialScrollY'
> & {
  contextualSearch?: string;
  externalUrlRegex?: string;
  searchPagePath: boolean | string;
  productRoutes?: [string, string, string | null, string | null][];
};

let DocSearchModal: typeof DocSearchModalType | null = null;

function Hit({
  hit,
  children,
}: {
  hit: InternalDocSearchHit | StoredDocSearchHit;
  children: React.ReactNode;
}) {
  return <Link to={hit.url}>{children}</Link>;
}

type ResultsFooterProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any;
  onClose: () => void;
};

function ResultsFooter({state, onClose}: ResultsFooterProps) {
  const {
    siteConfig: {baseUrl},
  } = useDocusaurusContext();

  return (
    <Link
      to={`${baseUrl}search?q=${encodeURIComponent(state.query)}`}
      onClick={onClose}>
      <Translate
        id="theme.SearchBar.seeAll"
        values={{count: state.context.nbHits}}>
        {'See all {count} results'}
      </Translate>
    </Link>
  );
}

/**
 * Resolve a product label from a URL pathname using the configured productRoutes.
 */
function getProductLabel(
  pathname: string,
  productRoutes: [string, string, string | null, string | null][],
): string | null {
  const match = productRoutes.find(([prefix]) =>
    pathname.startsWith(prefix),
  );
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
function buildBreadcrumb(
  item: InternalDocSearchHit | StoredDocSearchHit,
  productLabel: string | null,
): string | null {
  const {type} = item;
  const maxLevel =
    type === 'content' ? 7 : parseInt(type.replace('lvl', ''), 10);

  const parts: string[] = [];
  for (let i = 0; i < maxLevel; i++) {
    const val = (item as unknown as Record<string, string | null>)[
      `hierarchy.lvl${i}`
    ];
    if (val) parts.push(val);
  }

  // Replace lvl0 (typically "Documentation") with the product label
  if (parts.length > 0 && productLabel) {
    parts[0] = productLabel;
  }

  return parts.length > 1 ? parts.join(' › ') : null;
}


function DocSearch({
  contextualSearch,
  externalUrlRegex,
  productRoutes = [],
  ...props
}: DocSearchProps) {
  const contextualSearchFacetFilters =
    useTypesenseContextualFilters() as string;
  const configFacetFilters: string =
    props.typesenseSearchParameters?.filter_by ?? '';
  const facetFilters = contextualSearch
    ? [contextualSearchFacetFilters, configFacetFilters]
        .filter((e) => e)
        .join(' && ')
    : configFacetFilters;

  const typesenseSearchParameters = {
    filter_by: facetFilters,
    ...props.typesenseSearchParameters,
  };

  const {withBaseUrl} = useBaseUrlUtils();
  const history = useHistory();
  const searchContainer = useRef<HTMLDivElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | undefined>(
    undefined,
  );

  const importDocSearchModalIfNeeded = useCallback(() => {
    if (DocSearchModal) {
      return Promise.resolve();
    }
    return Promise.all([
      // @ts-ignore
      import('typesense-docsearch-react/modal') as Promise<
        typeof import('typesense-docsearch-react')
      >,
      // @ts-ignore
      import('typesense-docsearch-react/style'),
      // @ts-ignore
      import('./styles.css'),
    ]).then(([{DocSearchModal: Modal}]) => {
      DocSearchModal = Modal;
    });
  }, []);

  const onOpen = useCallback(() => {
    importDocSearchModalIfNeeded().then(() => {
      searchContainer.current = document.createElement('div');
      document.body.insertBefore(
        searchContainer.current,
        document.body.firstChild,
      );
      setIsOpen(true);
    });
  }, [importDocSearchModalIfNeeded]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    searchContainer.current?.remove();
  }, []);

  const onInput = useCallback(
    (event: KeyboardEvent) => {
      importDocSearchModalIfNeeded().then(() => {
        setIsOpen(true);
        setInitialQuery(event.key);
      });
    },
    [importDocSearchModalIfNeeded],
  );

  const navigator = useRef({
    navigate({itemUrl}: {itemUrl?: string}) {
      if (isRegexpStringMatch(externalUrlRegex, itemUrl)) {
        window.location.href = itemUrl!;
      } else {
        history.push(itemUrl!);
      }
    },
  }).current;

  const transformItems = useRef<DocSearchModalProps['transformItems']>(
    (items) =>
      items.map((item) => {
        // Extract product label from the original absolute URL
        // (before transforming to relative, so new URL() works).
        let productLabel: string | null = null;
        if (productRoutes.length > 0) {
          try {
            const pathname = new URL(item.url).pathname;
            productLabel = getProductLabel(pathname, productRoutes);
          } catch {
            // URL parsing failed
          }
        }

        // Transform absolute URL to relative.
        const withRelativeUrl = isRegexpStringMatch(externalUrlRegex, item.url)
          ? item
          : {
              ...item,
              url: withBaseUrl(
                `${new URL(item.url).pathname}${new URL(item.url).hash}`,
              ),
            };

        // Helper to override a field and its highlight/snippet results
        // so the Snippet component renders our text instead of the original.
        const overrideField = (
          base: typeof withRelativeUrl,
          field: string,
          value: string,
        ) => ({
          ...base,
          [field]: value,
          _highlightResult: {
            ...(base as Record<string, unknown>)._highlightResult as Record<string, unknown>,
            [field]: {value, matchLevel: 'none', matchedWords: []},
          },
          _snippetResult: {
            ...(base as Record<string, unknown>)._snippetResult as Record<string, unknown>,
            [field]: {value, matchLevel: 'none', matchedWords: []},
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
      }),
  ).current;

  const resultsFooterComponent: DocSearchProps['resultsFooterComponent'] =
    useMemo(
      () =>
        // eslint-disable-next-line react/no-unstable-nested-components
        (footerProps: Omit<ResultsFooterProps, 'onClose'>): JSX.Element => (
          <ResultsFooter {...footerProps} onClose={onClose} />
        ),
      [onClose],
    );

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen,
    onClose,
    onInput,
    searchButtonRef,
  });

  return (
    <>
      <DocSearchButton
        onTouchStart={importDocSearchModalIfNeeded}
        onFocus={importDocSearchModalIfNeeded}
        onMouseOver={importDocSearchModalIfNeeded}
        onClick={onOpen}
        ref={searchButtonRef}
        translations={translations.button}
      />
      {isOpen &&
        DocSearchModal &&
        searchContainer.current &&
        createPortal(
          <DocSearchModal
            onClose={onClose}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            navigator={navigator}
            transformItems={transformItems}
            hitComponent={Hit}
            {...(props.searchPagePath && {resultsFooterComponent})}
            {...props}
            typesenseSearchParameters={typesenseSearchParameters}
            typesenseServerConfig={props.typesenseServerConfig}
            typesenseCollectionName={props.typesenseCollectionName}
            placeholder={translations.placeholder}
            translations={translations.modal}
          />,
          searchContainer.current,
        )}
    </>
  );
}

export default function SearchBar(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <DocsPreferredVersionContextProvider>
      <DocSearch {...(siteConfig.themeConfig.typesense as DocSearchProps)} />
    </DocsPreferredVersionContextProvider>
  );
}
