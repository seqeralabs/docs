import React, {type ReactNode} from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  ErrorCauseBoundary,
  ThemeClassNames,
  useThemeConfig,
} from "@docusaurus/theme-common";
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from "@docusaurus/theme-common/internal";
import NavbarItem, {type Props as NavbarItemConfig} from "@theme/NavbarItem";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import SearchBar from "@theme/SearchBar";
import NavbarMobileSidebarToggle from "@theme/Navbar/MobileSidebar/Toggle";
import NavbarLogo from "@theme/Navbar/Logo";
import Submenu from "@seqera/docusaurus-theme-seqera/lib/theme/Navbar/Submenu";
import styles from "@seqera/docusaurus-theme-seqera/lib/theme/Navbar/Content/styles.module.css";

interface CustomFields {
  docsSiteMode?: string;
  supportedEnterpriseDocsUrl?: string;
}

function useNavbarItems() {
  return useThemeConfig().navbar.items as NavbarItemConfig[];
}

function NavbarItems({items}: {items: NavbarItemConfig[]}): ReactNode {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error) =>
            new Error(
              `A theme navbar item failed to render.
Please double-check the following navbar item (themeConfig.navbar.items) of your Docusaurus config:
${JSON.stringify(item, null, 2)}`,
              {cause: error},
            )
          }>
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

function NavbarContentLayout({
  left,
  right,
}: {
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <div className="navbar__inner">
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerLeft,
          "navbar__items",
        )}>
        {left}
      </div>
      <div
        className={clsx(
          ThemeClassNames.layout.navbar.containerRight,
          "navbar__items navbar__items--right",
        )}>
        {right}
      </div>
    </div>
  );
}

function ArchiveNavbarContent({
  supportedEnterpriseDocsUrl,
}: {
  supportedEnterpriseDocsUrl?: string;
}) {
  const mobileSidebar = useNavbarMobileSidebar();

  return (
    <div className="w-full flex flex-col justify-center">
      <NavbarContentLayout
        left={<NavbarLogo />}
        right={
          <>
            {supportedEnterpriseDocsUrl && (
              <a
                className="navbar__link font-normal whitespace-nowrap"
                href={supportedEnterpriseDocsUrl}>
                Supported versions
              </a>
            )}
            <div className="ml-1.5 mr-2">
              <NavbarColorModeToggle className={styles.colorModeToggle} />
            </div>
            {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          </>
        }
      />
    </div>
  );
}

export default function NavbarContent(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const customFields = (siteConfig.customFields ?? {}) as CustomFields;

  if (customFields.docsSiteMode === "enterprise-archive") {
    return (
      <ArchiveNavbarContent
        supportedEnterpriseDocsUrl={customFields.supportedEnterpriseDocsUrl}
      />
    );
  }

  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);

  return (
    <div className="w-full flex flex-col justify-center md:justify-start">
      <div className="md:pt-3 md:pb-1">
        <NavbarContentLayout
          left={<NavbarLogo />}
          right={
            <>
              <NavbarItems items={rightItems} />

              <SearchBar />
              <div className="ml-1.5 mr-2">
                <NavbarColorModeToggle className={styles.colorModeToggle} />
              </div>
              <div className="hidden md:flex!">
                <a
                  className="btn btn-secondary mr-2 "
                  href="https://cloud.seqera.io/oauth/login/auth0">
                  Log In
                </a>
                <a
                  className="btn btn-outline"
                  href="https://cloud.seqera.io/oauth/login/auth0">
                  Sign Up
                </a>
              </div>
              {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}

              <div className="hidden md:flex!">
                <Submenu />
              </div>
            </>
          }
        />
      </div>
      <div className="hidden md:flex! text-[.9rem] pt-1">
        <div className="flex flex-row justify-between w-full">
          <div>
            <NavbarItems items={leftItems} />
          </div>
          <div className="mr-2">
            <a
              className="navbar__link ml-8 font-normal"
              href="/platform-api/"
              aria-label="Platform API">
              Platform API
            </a>
            <a
              className="navbar__link ml-8 font-normal"
              href="/changelog/"
              aria-label="Changelog">
              Changelog
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
