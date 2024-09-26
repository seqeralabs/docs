import React from "react";
import TOC from "@theme-original/DocSidebar/Desktop";
import SearchBar from "@theme-original/SearchBar";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import ProductSwitcher from "./ProductSwitcher";
import VersionSwitcher from "./VersionSwitcher";

import styles from "./styles.module.css";

type SidebarItem = {
  docId?: string;
  href?: string;
  label: string;
  type: "category" | "link";
  items?: SidebarItem[];
  collapsed?: boolean;
  collapsible?: boolean;
  unlisted?: boolean;
};

type Props = {
  sidebar?: SidebarItem[];
  isHidden?: boolean;
  onCollapse?: () => void;
  path: string;
};

const DesktopWrapper: React.FC<Props> = (props) => {
  return (
    <div className={styles.sidebar}>
      <SearchBar />
      <ProductSwitcher isDropdown={!!props.sidebar} />
      {!!props.sidebar && (
        <>
          <VersionSwitcher />
          <TOC {...props} />
        </>
      )}
      <hr />
      <NavbarColorModeToggle className={styles.colorModeToggle} />
    </div>
  );
};

export default DesktopWrapper;
