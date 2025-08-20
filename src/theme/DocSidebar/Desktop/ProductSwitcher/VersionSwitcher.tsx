import React, { useState, useRef, useEffect } from "react";
import {
  useVersions,
  useDocsVersion,
  useDocsPreferredVersion,
} from "@docusaurus/plugin-content-docs/client";
import { useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";
import clsx from "clsx";
import archivedVersions from "../../../../../archivedVersions.json";

const VersionSwitcher = ({ isOpen, setIsOpen }) => {
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { preferredVersion, savePreferredVersionName } =
    useDocsPreferredVersion("platform-enterprise");
  const versions = useVersions("platform-enterprise");
  const currentVersion = useDocsVersion();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current?.contains(event.target)) return;
      setTimeout(() => setIsOpen(false), 100);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  function handleSelectVersion(version) {
    savePreferredVersionName(version);
  }

  if (typeof window === "undefined") return null;
  if (!versions) return null;
  if (!location.pathname.startsWith("/platform-enterprise")) return null;

  const docusaurusItems = versions.filter(
    (version) => version.label !== currentVersion?.label,
  );

  const archivedItems = Object.entries(archivedVersions).map(([key, url]) => ({
    name: key,
    label: key.replace('enterprise-', ''),
    path: url,
    isExternal: true
  })).filter((item) => item.label !== currentVersion?.label);

  const items = [...docusaurusItems, ...archivedItems];

  let urlSuffix = "";

  if (
    currentVersion &&
    location.pathname.startsWith(`/platform-enterprise/${currentVersion.label}`)
  ) {
    const currentVersionPrefix = `/platform-enterprise/${currentVersion.label}`;
    urlSuffix = location.pathname.replace(currentVersionPrefix, "");
  }

  return (
    <div ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={clsx(styles.item, styles.button, {
          [styles.active]: isOpen,
        })}
      >
        <span>
          {currentVersion ? `v${currentVersion.label}` : "Version"}{" "}
          {currentVersion && currentVersion.label === versions[0].label
            ? " (current)"
            : ""}
        </span>
      </button>
      {isOpen && (
        <div
          className={clsx(styles.dropdown, styles.secondary, styles.items, {
            [styles.open]: true,
          })}
        >
          {items?.map((version) => (
            <div
              key={version.name}
              className="w-full"
              onClick={() => !version.isExternal && handleSelectVersion(version.name)}
            >
              <Link
                to={version.isExternal ? version.path : `${version.path}${urlSuffix}`}
                className={`${styles.item} `}
                {...(version.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
              >
                v{version.label}{" "}
                {version.label === versions[0].label ? " (current)" : ""}
                {version.isExternal && "(archived)"}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionSwitcher;
