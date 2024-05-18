import React from "react";
import clsx from "clsx";

import Link from "@docusaurus/Link";
import AngleDown from "../../_shared/angle-down.inline.svg";
import { useHeaderContext } from "../../context";

import styles from "./styles.module.css";

const NavItem = ({ id, children, simple, isActive }) => {
  const [lastClickTime, setLastClickTime] = React.useState(null);
  const context = useHeaderContext();
  const { isActiveNested, isMenuOpen } = context;
  const delay = 100;
  const timeoutTime = isMenuOpen ? 0 : delay;
  const timeoutRef = React.useRef(null);

  let to = id;
  if (!id.startsWith("http")) to = `https://seqera.io${id}`;

  if (simple) {
    return (
      <a
        href={to}
        className={clsx(styles.navItem, {
          [styles.active]: isActive,
        })}
      >
        {children}
      </a>
    );
  }

  function timeSinceLastOpened() {
    if (lastClickTime === null) return 1000;
    const now = new Date().getTime();
    return now - lastClickTime;
  }

  function updateTime() {
    const now = new Date().getTime();
    setLastClickTime(now);
  }

  function handleNav(id) {
    if (timeSinceLastOpened() < delay) return;
    updateTime();
    context.handleNav(id);
  }

  function handleHover(id) {
    if (timeSinceLastOpened() < 400) return;
    updateTime();
    context.handleHover(id);
  }

  return (
    <button
      type="button"
      className={clsx(styles.navItem, {
        [styles.active]: isActiveNested(id),
      })}
      onClick={() => {
        clearTimeout(timeoutRef.current);
        handleNav(id);
      }}
      onMouseOver={() => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => handleHover(id), timeoutTime);
      }}
      onMouseOut={() => {
        clearTimeout(timeoutRef.current);
      }}
    >
      {children}
      <AngleDown
        className={styles.chevron}
        style={{ width: "12px", height: "12px" }}
      />
    </button>
  );
};

export default NavItem;
