import React from "react";
import TOC from "@theme-original/DocSidebar/Desktop";
import NavbarColorModeToggle from "@theme/Navbar/ColorModeToggle";
import ProductSwitcher from "./ProductSwitcher";

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
      <div className={styles.sidebarHeader}>
        {/* <ProductSwitcher isDropdown={!!props.sidebar} />
        <div className={styles.sidebarHeaderFade}></div> */}
      </div>
      <div className={styles.sidebarNav}>
        {!!props.sidebar && <TOC {...props} />}
        <hr />
        <NavbarColorModeToggle className={styles.colorModeToggle} />
      </div>
    </div>
  );
};

export default DesktopWrapper;
