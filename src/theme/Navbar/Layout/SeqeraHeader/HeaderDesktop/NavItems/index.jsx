import React from "react";
import clsx from "clsx";
import Link from "../../_shared/Link";

import NavItem from "./NavItem";
import AiIcon from "./images/AiIcon.svg";
import Logo from "./images/Logo.svg";
import LogoDark from "./images/LogoDark.svg";
import ContainersIcon from "./images/ContainersIcon.svg";
import DocsIcon from "./images/DocsIcon.svg";
import HamburgerIcon from "./images/HamburgerIcon.svg";
import ForumIcon from "./images/ForumIcon.svg";
import PipelinesIcon from "./images/PipelinesIcon.svg";
import LoginButton from "./LoginButton";

import Search from "@site/src/components/Search/Search";

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
            <NavItem id="/ask-ai/" simple>
              Seqera AI
            </NavItem>
            <NavItem id="/pipelines/" simple>
              Pipelines
            </NavItem>
            <NavItem id="/containers/" simple>
              Containers
            </NavItem>
            <NavItem id="products">Products</NavItem>
            <NavItem id="https://community.seqera.io" simple>
              Forum
            </NavItem>
            <NavItem id="https://docs.seqera.io" simple isActive>
              Docs
            </NavItem>
            <NavItem id="resources">
              <HamburgerIcon />
            </NavItem>
          </nav>
        )}
      </div>
      <div className="flex items-center">
        <Search />
        {!hideMenu && <LoginButton isDark={isDark} />}
      </div>
    </div>
  );
};

export default NavItems;
