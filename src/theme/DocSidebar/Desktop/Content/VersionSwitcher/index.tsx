import React, {type Dispatch, type SetStateAction, useEffect, useRef} from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {useLocation} from "@docusaurus/router";
import {useAllPluginInstancesData} from "@docusaurus/useGlobalData";
import {
  useActiveDocContext,
  useDocsPreferredVersion,
  useVersions,
} from "@docusaurus/plugin-content-docs/client";
import {useVersionDropdownConfig} from "@seqera/docusaurus-theme-seqera/lib/theme/hooks/useVersionDropdownConfig";
import {getVersionTargetDoc, processVersions} from "@seqera/docusaurus-theme-seqera/lib/theme/utils/versionHelpers";

interface VersionSwitcherProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

interface DocsPluginData {
  path: string;
}

interface CustomFields {
  docsSiteMode?: string;
  legacyEnterpriseArchiveUrl?: string;
}

function useActiveDocsPlugin(): string | null {
  const location = useLocation();
  const allDocsData = useAllPluginInstancesData(
    "docusaurus-plugin-content-docs",
  ) as Record<string, DocsPluginData>;

  for (const [pluginId, pluginData] of Object.entries(allDocsData)) {
    if (pluginData?.path && location.pathname.startsWith(pluginData.path)) {
      return pluginId;
    }
  }

  return null;
}

interface VersionSwitcherInnerProps extends VersionSwitcherProps {
  pluginId: string;
}

function VersionSwitcherInner({
  isOpen,
  setIsOpen,
  pluginId,
}: VersionSwitcherInnerProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {siteConfig} = useDocusaurusContext();
  const customFields = (siteConfig.customFields ?? {}) as CustomFields;
  const location = useLocation();
  const versions = useVersions(pluginId);
  const {savePreferredVersionName} = useDocsPreferredVersion(pluginId);
  const activeDocContext = useActiveDocContext(pluginId);
  const currentVersion = activeDocContext.activeVersion;
  const config = useVersionDropdownConfig(pluginId);

  const showLegacyArchiveLink =
    customFields.docsSiteMode === "main" &&
    pluginId === "platform-enterprise" &&
    Boolean(customFields.legacyEnterpriseArchiveUrl);

  if (!config.enabled) return null;

  const processedVersions = processVersions(versions, config);

  if (
    !processedVersions ||
    (processedVersions.length < 2 && !showLegacyArchiveLink)
  ) {
    return null;
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current?.contains(event.target as Node)) return;
      setTimeout(() => setIsOpen(false), 100);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  function handleSelectVersion(version: string) {
    savePreferredVersionName(version);
  }

  const displayCurrentVersion =
    currentVersion?.name === "current" && config.showCurrent
      ? {...currentVersion, label: config.currentLabel}
      : currentVersion;

  const items = processedVersions.filter(
    (version) => version.label !== displayCurrentVersion?.label,
  );

  return (
    <div ref={dropdownRef} className="relative px-4">
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden ${
          isOpen ? "rounded-b-none" : ""
        }`}>
        <button
          onClick={toggleDropdown}
          className="h-9 w-full flex items-center justify-between px-3 text-sm bg-transparent border-none cursor-pointer relative z-10 text-gray-900 dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">
          <span>
            {displayCurrentVersion ? `v${displayCurrentVersion.label}` : "Version"}{" "}
            {displayCurrentVersion &&
            displayCurrentVersion.label === processedVersions[0]?.label
              ? "(current)"
              : ""}
          </span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? "rotate-0" : "-rotate-90"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="4 4 16 16"
            fill="currentColor">
            <path d="M11.8152 13.1989L10.0167 11.1432C9.80447 10.9013 9.97697 10.5214 10.2991 10.5214H13.8961C13.9682 10.5214 14.0388 10.5421 14.0994 10.5811C14.16 10.6201 14.2081 10.6758 14.2379 10.7414C14.2677 10.8071 14.2779 10.8799 14.2674 10.9512C14.2569 11.0226 14.226 11.0893 14.1785 11.1435L12.38 13.1985C12.3448 13.2388 12.3014 13.2711 12.2527 13.2932C12.204 13.3153 12.1511 13.3268 12.0976 13.3268C12.0441 13.3268 11.9912 13.3153 11.9425 13.2932C11.8938 13.2711 11.8504 13.2388 11.8152 13.1985V13.1989Z" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute left-4 right-4 top-full -mt-0.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 border-t-gray-200 dark:border-t-gray-600 rounded-b-lg overflow-hidden z-50 transition-all duration-100">
            {items.map((version) => {
              const targetDoc = getVersionTargetDoc(version, activeDocContext);
              return (
                <div key={version.name} className="w-full">
                  <a
                    href={`${targetDoc.path}${location.search}${location.hash}`}
                    className="h-9 w-full flex items-center justify-between px-3 text-sm bg-transparent cursor-pointer text-gray-900 dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 no-underline border-t border-gray-200 dark:border-gray-700 first:border-t-0"
                    onClick={() => {
                      handleSelectVersion(version.name);
                      setIsOpen(false);
                    }}>
                    v{version.label}{" "}
                    {version.label === processedVersions[0]?.label
                      ? "(current)"
                      : ""}
                  </a>
                </div>
              );
            })}
            {showLegacyArchiveLink && (
              <a
                href={customFields.legacyEnterpriseArchiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-full flex items-center justify-between px-3 text-sm text-gray-900 dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 no-underline border-t border-gray-200 dark:border-gray-700"
                onClick={() => setIsOpen(false)}>
                <span>Legacy versions</span>
                <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  External
                </span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VersionSwitcher(props: VersionSwitcherProps) {
  const activePluginId = useActiveDocsPlugin();

  if (typeof window === "undefined") return null;
  if (!activePluginId) return null;

  return <VersionSwitcherInner {...props} pluginId={activePluginId} />;
}
