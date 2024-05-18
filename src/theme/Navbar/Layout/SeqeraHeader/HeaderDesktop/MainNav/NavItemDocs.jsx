import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";

const NavItemDocs = () => {
  return (
    <Link className={clsx(styles.navItem, styles.docs)} to="/">
      Docs
    </Link>
  );
};

export default NavItemDocs;
