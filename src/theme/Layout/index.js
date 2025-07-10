import React from "react";
import Layout from "@theme-original/Layout";
import Head from "@docusaurus/Head";
import platform_enterprise_latest_version from "@site/platform-enterprise_latest_version";
import CookieBanner from "./CookieBanner";

export default function LayoutWrapper(props) {
  return (
    <>
      <Head>
        <meta
          name="version:platform-enterprise"
          content={platform_enterprise_latest_version}
        />
        <meta name="theme-color" content="#160F26" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#160F26" />
      </Head>
      <Layout {...props} />
      <CookieBanner />
    </>
  );
}
