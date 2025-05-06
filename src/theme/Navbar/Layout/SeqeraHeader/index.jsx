import React, { useState, useRef, useEffect } from "react";

import HeaderDesktop from "./HeaderDesktop";
import useOutsideClick from "./hooks/useOutsideClick";
import useMediaQuery from "./hooks/useMediaQuery";
import { HeaderContext } from "./context";

const Header = ({ theme }) => {
  const headerRef = useRef();

  const [activeMenu, setActiveMenu] = useState("");

  const closeMenu = () => {
    setActiveMenu("");
  };

  const handleNav = (path) => {
    if (path === activeMenu) {
      setActiveMenu("");
      return;
    }
    setActiveMenu(path);
  };

  const handleHover = (path) => {
    if (path === activeMenu) return;
    setActiveMenu(path);
  };

  const handleBack = () => {
    let newPath = activeMenu.split("/").slice(0, -1).join("/");

    setActiveMenu(newPath || "/");
  };

  const isActiveNested = (path) => {
    return activeMenu.includes(path);
  };

  const isActive = (path) => {
    return activeMenu === path;
  };

  const isSmallScreen = useMediaQuery("(max-width: 995px)");

  useOutsideClick(headerRef, closeMenu, true);

  const isMenuOpen = activeMenu !== "";

  if (isSmallScreen) return null;

  return (
    <HeaderContext.Provider
      value={{
        activeMenu,
        isMenuOpen,
        handleNav,
        handleHover,
        handleBack,
        isActiveNested,
        isActive,
        isSmallScreen,
        closeMenu,
        theme,
      }}
    >
      {!isSmallScreen && <HeaderDesktop headerRef={headerRef} />}
    </HeaderContext.Provider>
  );
};

export default Header;
