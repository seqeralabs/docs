import React, { useEffect } from "react";
import { useLocation, useHistory } from "@docusaurus/router";

import platform_enterprise_latest_version from "@site/platform-enterprise_latest_version";

export default function Platform(): JSX.Element {
  const location = useLocation();
  const history = useHistory();
  const { pathname } = location;

  // Only perform the replacement if the path actually contains "latest"
  const containsLatest = pathname.includes("latest");
  const actualPath = containsLatest ? pathname.replace("latest", "") : pathname;

  useEffect(
    function redirectToActualPath() {
      // Only redirect if we actually changed the path
      if (typeof window === "undefined" || pathname === actualPath) return;
      history.push(actualPath);
    },
    [pathname, actualPath, history],
  );

  return <div />;
}
