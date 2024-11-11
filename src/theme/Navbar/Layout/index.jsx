import React, { useEffect } from "react";
import clsx from "clsx";
import { useThemeConfig } from "@docusaurus/theme-common";
import {
  useHideableNavbar,
  useNavbarMobileSidebar,
} from "@docusaurus/theme-common/internal";
import { translate } from "@docusaurus/Translate";
import NavbarMobileSidebar from "@theme/Navbar/MobileSidebar";
import Link from "@docusaurus/Link";
import { useLocation } from "@docusaurus/router";

import SeqeraHeader from "./SeqeraHeader";
import styles from "./styles.module.css";
import custom from "./styles.custom.module.css";
import useMediaQuery from "./SeqeraHeader/hooks/useMediaQuery";

function NavbarBackdrop(props) {
  return (
    <div
      role="presentation"
      {...props}
      className={clsx("navbar-sidebar__backdrop", props.className)}
    />
  );
}

{
  /* Desktop nav */
}
function Container({ children, isMobile }) {
  if (isMobile) return children;
  return (
    <div className={custom.siteHeader}>
      <div className={custom.seqeraHeader}>
        <SeqeraHeader theme="dark" />
      </div>
      {/* Navbar normally goes here.
      Docusaurus expects a classname, so we have a dummy element
      with zero dimensions and display:none in main.css.
      See https://github.com/facebook/docusaurus/issues/7505 

      Note - navbar is used for mobile styles, so CSS
      only hides it on bigger screens.
      */}
      <div className="navbar" />
    </div>
  );
}

{
  /* Mobile nav */
}
export default function NavbarLayout({ children }) {
  const {
    navbar: { hideOnScroll, style },
  } = useThemeConfig();
  const mobileSidebar = useNavbarMobileSidebar();
  const { navbarRef, isNavbarVisible } = useHideableNavbar(hideOnScroll);
  const isMobile = useMediaQuery("(max-width: 996px)");
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <Container isMobile={isMobile}>
      <nav
        ref={navbarRef}
        aria-label={translate({
          id: "theme.NavBar.navAriaLabel",
          message: "Main",
          description: "The ARIA label for the main navigation",
        })}
        className={clsx(
          "navbar",
          "navbar--fixed-top",
          hideOnScroll && [
            styles.navbarHideable,
            !isNavbarVisible && styles.navbarHidden,
          ],
          {
            "navbar--dark": style === "dark",
            "navbar--primary": style === "primary",
            "navbar-sidebar--show": mobileSidebar.shown,
          },
        )}
      >
        <Link
          to="/"
          className={clsx("navbar__item navbar__link -ml-3", custom.logo, {
            "navbar__link--active": isHome,
          })}
        >
          Home
        </Link>
        {children}
        <NavbarBackdrop onClick={mobileSidebar.toggle} />
        <NavbarMobileSidebar />
      </nav>
    </Container>
  );
}
