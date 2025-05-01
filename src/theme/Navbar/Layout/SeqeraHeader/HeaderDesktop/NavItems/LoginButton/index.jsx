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
      <div className="hidden md:flex">
        <Link
          sameTab
          className={clsx(styles.button, { [styles.darkMode]: isDark })}
          target="_self"
          to="https://cloud.seqera.io/login"
        >
          Log In
        </Link>
      </div>
      <Link
        sameTab
        className={clsx(
          styles.button,
          styles.secondary,
          { [styles.darkMode]: isDark },
          "ml-3",
        )}
        target="_self"
        to="https://cloud.seqera.io/login"
      >
        <span className="hidden md:inline">Sign Up</span>
      </Link>
    </div>
  );
};

export default NavMeta;
