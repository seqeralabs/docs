import React from "react";
import clsx from "clsx";
import NavItem from "./NavItem";
import Logo from "./images/Logo.svg";
import LogoWhite from "./images/LogoWhite.svg";
import LoginButton from "./LoginButton";
import styles from "./styles.module.css";
import Hamburger from "./Hamburger";
import { useHeaderContext } from "../../context";
import ActiveLink from "./ActiveLink";
import NavbarLogo from '@theme/Navbar/Logo';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle'; 
import SearchBar from "@theme/SearchBar";


const NavItems = ({ isDark = false, hideMenu }) => {
  const {
    hasScrolled,
    isMenuOpen,
    toggleMobileMenu,
    headerType,
    isHeaderVisible,
  } = useHeaderContext();



  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.logoContainer}>
            <NavbarLogo/>
        </div>

        {!hideMenu && (
          <nav className={clsx(styles.nav, { [styles.dark]: isDark })}>
            <div className={styles.navItemContainer}>
              <SearchBar />
            </div>
            <div className={styles.navItemContainer}>
              <NavbarColorModeToggle />
            </div>
            <div className={styles.navItemContainer}>
              {!hideMenu && <LoginButton isDark={isDark} />}
            </div>
            <NavItem id="resources">
              <Hamburger isOpen={isMenuOpen} toggleMenu={toggleMobileMenu} />
            </NavItem>
          </nav>
        )}
      </div>
      <div className={styles.contentRow}>
          <ul className={styles.navList}>
            <li>
            <ActiveLink url="/platform-cloud" customClasses={styles.navItemSpacing}>
                Cloud
              </ActiveLink>
            </li>
            <li>
            <ActiveLink url="/platform-enterprise" customClasses={styles.navItemSpacing}>
                Enterprise
              </ActiveLink>
            </li>
            <li>
            <ActiveLink url="/nextflow" customClasses={styles.navItemSpacing}> 
                Nextflow
              </ActiveLink>
            </li>
            <li>
            <ActiveLink url="/multiqc" customClasses={styles.navItemSpacing}> 
                MultiQC
              </ActiveLink>
            </li>
            <li>
            <ActiveLink url="/wave" customClasses={styles.navItemSpacing}>
                Wave
              </ActiveLink>
            </li>
            <li>
            <ActiveLink url="/fusion" customClasses={styles.navItemSpacing}>
                Fusion
              </ActiveLink>
            </li>
             </ul>
        <ul className={styles.navList} style={{marginRight: '0.5rem'}}>
          <li>
            <a className={styles.linkContainer} href="https://training.nextflow.io/latest/">
            <div className={styles.linkContent}>
               Nextflow Training
              <svg width="10" height="10" aria-hidden="true" viewBox="0 0 24 24" className={styles.linkIcon}><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>
              </div>
            </a>
          </li>
          <li>
            <ActiveLink apiLink url="/platform-api" customClasses={styles.linkContainer}>
              Platform API
            </ActiveLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavItems;
