import React from "react";
import clsx from "clsx";
import NavItem from "./NavItem";
import Logo from "./images/Logo.svg";
import LogoWhite from "./images/LogoWhite.svg";
import LoginButton from "./LoginButton";
import Search from "@site/src/components/Search/Search";
import styles from "./styles.module.css";
import Hamburger from "./Hamburger";
import { useHeaderContext } from "../../context";
import ActiveLink from "./ActiveLink";
import NavbarLogo from '@theme/Navbar/Logo';

const NavItems = ({ isDark = false, hideMenu }) => {
  const {
    hasScrolled,
    isMenuOpen,
    toggleMobileMenu,
    headerType,
    isHeaderVisible,
  } = useHeaderContext();

  return (
    <div className="px-4 w-full flex flex-col">
      <div className="h-[72px] w-full flex items-center justify-between">
        <div className="flex items-center w-[16rem]">
          <a href="/">
            <NavbarLogo/>
          </a>
        </div>
        <div className="flex items-center">
          <Search />
        </div>

        {!hideMenu && (
          <nav className={clsx(styles.nav, { [styles.dark]: isDark }, 'flex justify-end w-[16rem]')}>
            <div className="mr-3">
              {!hideMenu && <LoginButton isDark={isDark} />}
            </div>
            <NavItem id="resources">
              <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMobileMenu} />
            </NavItem>
          </nav>
        )}
      </div>
      <div className="w-full flex items-center justify-between">
        <ul className={`${styles.navList} flex flex-row`}>
          <li>
            <ActiveLink to="/platform-cloud" customClasses={`mr-8`}>
              Cloud
            </ActiveLink>
          </li>
          <li>
            <ActiveLink url="/platform-enterprise" customClasses={`mr-8`}>
              Enterprise
            </ActiveLink>
          </li>
          <li>
            <a
              className="mr-8"
              href="https://nextflow.io/docs/latest/index.html"
            >
              Nextflow
            </a>
          </li>
          <li>
            <ActiveLink url="/wave" customClasses={`mr-8`}>
              Wave
            </ActiveLink>
          </li>
          <li>
            <ActiveLink url="/multiqc" customClasses={`mr-8`}>
              MultiQC
            </ActiveLink>
          </li>
          <li>
            <ActiveLink url="/fusion" customClasses={`mr-8`}>
              Fusion
            </ActiveLink>
          </li>
        </ul>
        <ul className={`${styles.navList} flex flex-row mr-2`}>
          <li>
            <a className="ml-8" href="https://training.nextflow.io/latest/">
              Training
            </a>
          </li>
          <li>
            <ActiveLink url="/platform-api" customClasses={`ml-8`}>
              Platform API
            </ActiveLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavItems;
