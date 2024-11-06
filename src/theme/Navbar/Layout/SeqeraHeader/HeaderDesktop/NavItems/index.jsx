import React from "react";
import clsx from "clsx";
import Link from "../../_shared/Link";

import NavItem from "./NavItem";
import Logo from "./images/Logo.svg";
import LogoDark from "./images/LogoDark.svg";
import ContainersIcon from "./images/ContainersIcon.svg";
import DocsIcon from "./images/DocsIcon.svg";
import HamburgerIcon from "./images/HamburgerIcon.svg";
import ForumIcon from "./images/ForumIcon.svg";
import PipelinesIcon from "./images/PipelinesIcon.svg";
import LoginButton from "./LoginButton";

import styles from "./styles.module.css";

const NavItems = ({ isDark = false, hideMenu }) => {
  return (
    <div className="container-lg w-full px-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" noBorder className="leading-[0]" sameTab>
          {isDark ? (
            <LogoDark height={22} width={112} className={styles.logo} />
          ) : (
            <Logo height={22} width={112} className={styles.logo} />
          )}
        </Link>
        {!hideMenu && (
          <nav className={clsx(styles.nav, { [styles.dark]: isDark })}>
            <NavItem id="/pipelines/" simple>
              <PipelinesIcon className="mr-2" />
              Pipelines
            </NavItem>
            <NavItem id="/containers/" simple>
              <ContainersIcon className="mr-2" />
              Containers
            </NavItem>
            <NavItem id="products">Products</NavItem>
            <NavItem id="https://community.seqera.io" simple>
              <ForumIcon className="mr-2" />
              Forum
            </NavItem>
            <NavItem id="https://docs.seqera.io" simple isActive>
              <DocsIcon className="mr-2" />
              Docs
            </NavItem>
            <NavItem id="resources">
              <HamburgerIcon />
            </NavItem>
          </nav>
        )}
      </div>
      {!hideMenu && <LoginButton isDark={isDark} />}
    </div>
  );
};

export default NavItems;
