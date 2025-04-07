import React, { useEffect } from "react";
import { useLocation, useHistory } from "@docusaurus/router";

import platform_enterprise_latest_version from "@site/platform-enterprise_latest_version";

export default function Platform(): JSX.Element {
  const match = useLocation();
  const history = useHistory();
  const { pathname } = match;
  const actualPath = pathname.replace(
    "latest",
    platform_enterprise_latest_version,
  );

  useEffect(function redirectToActualPath() {
    if (typeof window === "undefined") return;
    history.push(actualPath);
  }, []);

  return <div />;
}
