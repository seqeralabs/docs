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
import { useLocation } from 'react-router-dom';


const NavItems = ({ isDark = false, hideMenu }) => {
  const {
    hasScrolled,
    isMenuOpen,
    toggleMobileMenu,
    headerType,
    isHeaderVisible,
  } = useHeaderContext();


  // Note: This workaround was added to resolve pages from 404ing when navigating away from platform-api paths, due to separate build implementation. 
  // TODO: Revert this workaround once we have docs in a single build
  const location = useLocation();
  const isOnPlatformAPI = location.pathname.includes('/platform-api');

  return (
    <div className="px-4 w-full flex flex-col">
      <div className="h-[72px] w-full flex items-center justify-between">
        <div className="flex items-center w-[16rem]">
            <NavbarLogo/>
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
         
         {/* TODO: links from platform-api paths direct to an absolute url, otherwise they direct from relative paths. Revert this workaround once we have docs in a single build*/}
        {isOnPlatformAPI ? (
            <ul className={`${styles.navList} flex flex-row`}>
            <li>
            <ActiveLink externalLink url="https://docs.seqera.io/platform-cloud/platform-cloud" customClasses={`mr-6`}>
                Cloud
              </ActiveLink>
            </li>
            <li>
            <ActiveLink externalLink url="https://docs.seqera.io/platform-enterprise/latest/platform-enterprise" customClasses={`mr-6`}>
                Enterprise
              </ActiveLink>
            </li>
            <li>
              <a
                className="mr-6"
                href="https://nextflow.io/docs/latest/index.html"
              >
                <div className="flex flex-row items-center">
                 Nextflow 
                <svg width="10" height="10" aria-hidden="true" viewBox="0 0 24 24" className="opacity-50 ml-1"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>
                </div>
              </a>
            </li>
            <li>
            <ActiveLink externalLink url="https://docs.seqera.io/multiqc" customClasses={`mr-6`}> 
                MultiQC
              </ActiveLink>
            </li>
            <li>
            <ActiveLink externalLink url="https://docs.seqera.io/wave" customClasses={`mr-6`}>
                Wave
              </ActiveLink>
            </li>
            <li>
            <ActiveLink externalLink url="https://docs.seqera.io/fusion" customClasses={`mr-6`}>
                Fusion
              </ActiveLink>
            </li>
             </ul>
        ) : (
          <ul className={`${styles.navList} flex flex-row`}>
            <li>
            <ActiveLink url="/platform-cloud/platform-cloud" customClasses={`mr-6`}>
                Cloud
              </ActiveLink>
            </li>
            <li>
            <ActiveLink url="/platform-enterprise/platform-enterprise" customClasses={`mr-6`}>
                Enterprise
              </ActiveLink>
            </li>
            <li>
              <a
                className="mr-6"
                href="https://nextflow.io/docs/latest/index.html"
              >
                <div className="flex flex-row items-center">
                 Nextflow 
                <svg width="10" height="10" aria-hidden="true" viewBox="0 0 24 24" className="opacity-50 ml-1"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>
                </div>
              </a>
            </li>
            <li>
            <ActiveLink url="/multiqc" customClasses={`mr-6`}> 
                MultiQC
              </ActiveLink>
            </li>
            <li>
            <ActiveLink url="/wave" customClasses={`mr-6`}>
                Wave
              </ActiveLink>
            </li>
            <li>
            <ActiveLink url="/fusion" customClasses={`mr-6`}>
                Fusion
              </ActiveLink>
            </li>
             </ul>
        )}
        <ul className={`${styles.navList} flex flex-row mr-2`}>
          <li>
            <a className="ml-8" href="https://training.nextflow.io/latest/">
            <div className="flex flex-row items-center">
               Nextflow Training
              <svg width="10" height="10" aria-hidden="true" viewBox="0 0 24 24" className="opacity-50 ml-1"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>
              </div>
            </a>
          </li>
          <li>
            <ActiveLink externalLink url="https://docs.seqera.io/platform-api/seqera-api" customClasses={`ml-8`}>
              Platform API
            </ActiveLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavItems;