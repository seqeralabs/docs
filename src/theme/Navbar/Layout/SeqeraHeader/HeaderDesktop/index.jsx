import React from "react";
import clsx from "clsx";
import Submenu from "./Submenu";
import NavItems from "./NavItems";
import { useHeaderContext } from "../context";

import styles from "./styles.module.css";

const Layout = ({ headerRef }) => {
  const { hasScrolled, closeMenu, hideMenu } = useHeaderContext();
  const timeoutRef = React.useRef(null);

  return (
    <header
      className={clsx(styles.header, {
        [styles.hasScrolled]: hasScrolled,
      })}
      ref={headerRef}
      onMouseEnter={() => clearTimeout(timeoutRef.current)}
      onMouseLeave={() => (timeoutRef.current = setTimeout(closeMenu, 200))}
    >
      <div className="flex flex-row justify-center w-full relative">
        <NavItems hideMenu={hideMenu} />
        <Submenu hideMenu={hideMenu} />
      </div>
    </header>
  );
};

export default Layout;
