import React, { useState, useRef, useEffect } from "react";
import {
  useVersions,
  useDocsVersion,
  useDocsPreferredVersion,
} from "@docusaurus/plugin-content-docs/client";
import { useLocation } from "@docusaurus/router";
import Link from "@docusaurus/Link";
import Caret from "../ProductSwitcher/images/caret.svg";

const VersionSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { preferredVersion, savePreferredVersionName } =
    useDocsPreferredVersion("platform");
  const versions = useVersions("platform");
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
  if (!location.pathname.startsWith("/platform")) return null;

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className={`flex justify-between items-center w-full rounded-md mb-4 py-2 px-4 cursor-pointer text-sm bg-white dark:bg-brand-1400 border border-gray-300 dark:border-brand-800 hover:bg-[#e8ebfc] dark:hover:bg-brand-1300 border-solid ${
          isOpen ? "rounded-b-none" : ""
        }`}
        ref={dropdownRef}
      >
        <span>v{currentVersion.label} {currentVersion.label == versions[0].label ? " (current)": ""}</span>
        <Caret
          className={`w-6 h-6 ml-2 transition-transform duration-200 fill-black dark:fill-white ${isOpen ? "rotate-0" : "-rotate-90"}`}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-10 bg-white dark:bg-brand-1400 border-solid border border-gray-300 dark:border-brand-800 border-t-0 rounded-b-md">
          {versions?.map((version, idx) => (
            <Link
              key={version.name}
              to={version.path}
              className="block w-full py-3 px-4 border-solid border-0 border-b border-gray-300 dark:border-brand-800 last:border-b-0 text-gray-1000 hover:text-gray-1000 hover:no-underline text-sm dark:text-white hover:bg-[#e8ebfc] dark:hover:bg-brand-1300"
              onClick={() => handleSelectVersion(version.name)}
            >
              v{version.label} {idx == 0 ? " (current)" : ""}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default VersionSwitcher;
