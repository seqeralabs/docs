import React from "react";
import classnames from "classnames";

import AngleDown from "../../_shared/angle-down.inline.svg";

import styles from "./styles.module.css";
import { useHeaderContext } from "../../context";

const NavItem = ({ id, children }) => {
  const [lastClickTime, setLastClickTime] = React.useState(null);
  const context = useHeaderContext();
  const { isActiveNested, isMenuOpen } = context;
  const delay = 100;
  const timeoutTime = isMenuOpen ? 0 : delay;
  const timeoutRef = React.useRef(null);

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
      className={classnames(styles.navItem, {
        [styles.active]: isActiveNested(id),
        [styles.menuOpen]: isMenuOpen,
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
      <AngleDown style={{ width: "12px", height: "12px" }} />
    </button>
  );
};

export default NavItem;
