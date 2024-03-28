import React from "react";
import Submenu from "./Submenu";
import MainNav from "./MainNav";
import MetaNav from "./MetaNav";
import { useHeaderContext } from "../context";

import styles from "./styles.module.css";

const Layout = ({ headerRef }) => {
  const { closeMenu } = useHeaderContext();
  const timeoutRef = React.useRef(null);
  return (
    <header
      className={styles.header}
      ref={headerRef}
      onMouseEnter={() => clearTimeout(timeoutRef.current)}
      onMouseLeave={() => (timeoutRef.current = setTimeout(closeMenu, 200))}
    >
      <div className="container-lg px-4 flex items-center justify-between">
        <MainNav />
        <MetaNav />
      </div>
      <Submenu />
    </header>
  );
};

export default Layout;
