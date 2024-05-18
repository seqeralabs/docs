import React from "react";
import clsx from "clsx";
import Link from "../../_shared/Link";

import NavItem from "./NavItem";
import Logo from "./images/seqera-logo.inline.svg";
import LogoDark from "./images/seqera-logo-dark.inline.svg";

import styles from "./styles.module.css";

const NavMain = () => {
  return (
    <div className="flex items-center">
      <Link to="https://seqera.io" noBorder className={styles.logo}>
        <LogoDark height={36} width={175} className={styles.darkLogo} />
        <Logo height={36} width={175} className={styles.lightLogo} />
      </Link>
      <nav className={styles.nav}>
        <NavItem id="products">Products</NavItem>
        <NavItem id="resources">Resources</NavItem>
        <NavItem id="community">Community</NavItem>
        <NavItem id="company">Company</NavItem>
      </nav>
    </div>
  );
};

export default NavMain;
