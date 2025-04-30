import React from "react";
import clsx from "clsx";
import Link from "../../_shared/Link";
import NavItem from "./NavItem";
import Logo from "./images/Logo.svg";
import LogoWhite from "./images/LogoWhite.svg";
import HamburgerIcon from "./images/HamburgerIcon.svg";
import LoginButton from "./LoginButton";
import Search from "@site/src/components/Search/Search";
import styles from "./styles.module.css";
import Hamburger from "./Hamburger"
import { useHeaderContext } from "../../context";

const NavItems = ({ isDark = false, hideMenu }) => {
  const { hasScrolled, isMenuOpen, toggleMobileMenu, headerType, isHeaderVisible } =
  useHeaderContext();
  
  return (
    <div className="container-lg w-full flex flex-col">
      <div className="h-[72px] w-full flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" noBorder className="leading-[0]" sameTab>
            {isDark ? (
              <LogoWhite className={`${styles.logo} ml-[3px]`} />
            ) : (
              <Logo className={`${styles.logo} ml-[3px]`}  />
            )}
          </Link>
        </div>
        <div className="flex items-center">
          <Search />
        </div>

        {!hideMenu && (
            <nav className={clsx(styles.nav, { [styles.dark]: isDark })}>
              <div className="mr-3">
                {!hideMenu && <LoginButton isDark={isDark} />}
              </div>
              <NavItem id="resources">
                <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMobileMenu} />
              </NavItem>
            </nav>
          )}
      </div>
      <div className="w-full flex items-center justify-between pb-1">
        <ul className={`${styles.navList} flex flex-row`}>
          <li><a className="mr-8" href="">Cloud</a></li>
          <li><a className="mr-8" href="">Enterprise</a></li>
          <li><a className="mr-8" href="">Nextflow</a></li>
          <li><a className="mr-8" href="">Wave</a></li>
          <li><a className="mr-8" href="">MultiQC</a></li>
          <li><a className="mr-8" href="">Fusion</a></li>
        </ul>
        <ul className={`${styles.navList} flex flex-row mr-2`}>
          <li><a className="ml-8" href="">Training</a></li>
          <li><a className="ml-8" href="">Platform API</a></li>
        </ul>
      </div>
    </div>
  );
};

export default NavItems;
