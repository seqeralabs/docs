import React from "react";
import clsx from "clsx";

import Link from "../../../_shared/Link";

import styles from "./styles.module.css";

const NavMeta = ({ isDark }) => {
  let altStyle = false;
  if (typeof window !== "undefined")
    if (window.location.pathname === "/") altStyle = true;

  return (
    <div className="items-center hidden md:flex">
      <Link
        className={clsx(
          styles.button,
          { [styles.dark]: isDark },
          "hidden xl:flex",
        )}
        target="_self"
        to="https://cloud.seqera.io/login"
      >
        Login
      </Link>
      <Link
        className={clsx(
          styles.button,
          styles.cta,
          { [styles.dark]: isDark, [styles.altStyle]: altStyle },
          "ml-4",
        )}
        target="_self"
        to="https://cloud.seqera.io/login"
      >
        <span className="hidden xl:inline">Sign up</span>
        <span className="xl:hidden">Login / Sign up</span>
      </Link>
    </div>
  );
};

export default NavMeta;
