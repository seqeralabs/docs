/**
 * Thankfully borrowed from material ui
 */
import React from "react";

export default function useMediaQuery(queryInput, options = {}) {
  const query = queryInput.replace(/^@media( ?)/m, "");

  // Wait for jsdom to support the match media feature.
  // All the browsers Material-UI support have this built-in.
  // This defensive check is here for simplicity.
  // Most of the time, the match media logic isn't central to people tests.
  const supportMatchMedia =
    typeof window !== "undefined" && typeof window.matchMedia !== "undefined";

  const {
    defaultMatches = false,
    matchMedia = supportMatchMedia ? window.matchMedia : null,
    noSsr = false,
    ssrMatchMedia = null,
  } = {
    ...options,
  };

  const [match, setMatch] = React.useState(() => {
    if (noSsr && supportMatchMedia) {
      return matchMedia(query).matches;
    }
    if (ssrMatchMedia) {
      return ssrMatchMedia(query).matches;
    }

    // Once the component is mounted, we rely on the
    // event listeners to return the correct matches value.
    return defaultMatches;
  });

  React.useEffect(() => {
    let active = true;

    if (!supportMatchMedia) {
      return undefined;
    }

    const queryList = matchMedia(query);
    const updateMatch = () => {
      // Workaround Safari wrong implementation of matchMedia
      // TODO can we remove it?
      // https://github.com/mui-org/material-ui/pull/17315#issuecomment-528286677
      if (active) {
        setMatch(queryList.matches);
      }
    };
    updateMatch();
    queryList.addListener(updateMatch);
    return () => {
      active = false;
      queryList.removeListener(updateMatch);
    };
  }, [query, matchMedia, supportMatchMedia]);

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useDebugValue({ query, match });
  }

  return match;
}
