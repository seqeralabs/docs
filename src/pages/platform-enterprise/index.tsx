import React from "react";
import { Redirect } from "react-router-dom";

import platform_enterprise_latest_version from "@site/platform-enterprise_latest_version";

export default function Platform(): JSX.Element {
  return (
    <Redirect
      to={`https://docs.seqera.io/platform-enterprise/`}
    />
  );
}
