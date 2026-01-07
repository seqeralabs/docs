import React from "react";
import clsx from "clsx";
import Link from "../../../_shared/Link";
import styles from "./styles.module.css";
import { useColorMode } from "@docusaurus/theme-common";
import Sun from "../images/SunIcon.svg";
import Moon from "../images/MoonIcon.svg";

const NavMeta = ({ isDark }) => {
  let altStyle = false;
  if (typeof window !== "undefined")
    if (window.location.pathname === "/") altStyle = true;
  const { colorMode, setColorMode } = useColorMode();
  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
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
          styles.signUpButton,
          { [styles.darkMode]: isDark }
        )}
        target="_self"
        to="https://cloud.seqera.io/login"
      >
        <span className={styles.signUpText}>Sign Up</span>
      </Link>
    </div>
  );
};

export default NavMeta;
