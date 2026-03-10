import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import SearchBar from "@theme-original/SearchBar";

interface CustomFields {
  docsSiteMode?: string;
}

export default function SearchBarWrapper() {
  const {siteConfig} = useDocusaurusContext();
  const customFields = (siteConfig.customFields ?? {}) as CustomFields;

  if (customFields.docsSiteMode === "enterprise-archive") {
    return null;
  }

  return <SearchBar />;
}
