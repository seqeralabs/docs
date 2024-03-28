import React from "react";
import { Redirect } from "react-router-dom";

import platform_latest_version from "@site/platform_latest_version";

export default function Platform(): JSX.Element {
  return <Redirect to={`/platform/${platform_latest_version}/`} />;
}
