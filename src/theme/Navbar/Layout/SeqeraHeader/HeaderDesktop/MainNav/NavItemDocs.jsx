import React from "react";
import classnames from "classnames";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";

const NavItemDocs = () => {
  return (
    <Link className={classnames(styles.navItem, styles.docs)} to="/">
      Docs
    </Link>
  );
};

export default NavItemDocs;
