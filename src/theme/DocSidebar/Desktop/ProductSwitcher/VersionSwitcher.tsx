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
  if (!location.pathname.startsWith("/platform-enterprise/")) return null;

  const items = versions.filter(
    (version) => version.label !== currentVersion.label,
  );

  // Extract the part of the URL after the current version
  const currentVersionPrefix = `/platform-enterprise/${currentVersion.label}`;
  const urlSuffix = location.pathname.replace(currentVersionPrefix, "");

  return (
    <div ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={clsx(styles.item, styles.button, {
          [styles.active]: isOpen,
        })}
      >
        <span>
          v{currentVersion.label}{" "}
          {currentVersion.label == versions[0].label ? " (current)" : ""}
        </span>
      </button>
      {isOpen && (
        <div
          className={clsx(styles.dropdown, styles.secondary, styles.items, {
            [styles.open]: true,
          })}
        >
          {items?.map((version, index) => (
            <div
              key={version.name}
              className="w-full"
              onClick={() => handleSelectVersion(version.name)}
            >
              {index == 0 ?
              (
                <a
                href={`/platform-enterprise`} 
                className={`${styles.item} `}
              >
                v{version.label}{" "}
                {version.label === versions[0].label ? " (current)" : ""}
              </a>
              ) :( 
                <a
                href={`https://deploy-preview-604--seqera-docs.netlify.app${version.path}${urlSuffix}`} 
                className={`${styles.item} `}
              >
                v{version.label}{" "}
                {version.label === versions[0].label ? " (current)" : ""}
              </a>
              )
              }
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionSwitcher;