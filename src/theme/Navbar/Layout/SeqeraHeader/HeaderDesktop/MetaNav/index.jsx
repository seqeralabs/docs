import React from "react";
import classNames from "classnames";

import Link from "../../_shared/Link";

import styles from "./styles.module.css";

const NavMeta = () => {
  return (
    <div className="flex items-center">
      <Link
        className={classNames(styles.button, "hidden xl:flex")}
        to="https://tower.nf/login"
      >
        Login
      </Link>
      <Link
        className={classNames(styles.button, styles.cta, "ml-4 flex")}
        to="https://tower.nf/login"
      >
        <span className="hidden xl:inline">Sign up for free</span>
        <span className="xl:hidden">Login / Sign up</span>
      </Link>
    </div>
  );
};

export default NavMeta;
