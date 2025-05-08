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
    <div className="items-center hidden md:flex">
      <button
        onClick={() => setColorMode(colorMode === "dark" ? "light" : "dark")}
        aria-label="Toggle Light or Dark Mode"
        className="flex flex-row mr-3"
      >
        <span className={`${styles.lightDarkMode}`}>
          {" "}
          {/* {colorMode === "light" ? <Sun size={50} /> : <Moon size={24} />} */}
        </span>
      </button>
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
