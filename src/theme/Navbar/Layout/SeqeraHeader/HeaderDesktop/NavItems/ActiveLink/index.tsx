import React from "react";
import { NavLink } from 'react-router-dom';
import styles from "./activelink.module.css";

const ActiveLink = ({ url, externalLink, exact, children, customClasses, ...rest }) => {
  
  const currentPath = window.location.pathname;
  const getFirstSegment = (path) => path.split("/").filter(Boolean)[0] || "";

  const currentFirst = getFirstSegment(currentPath);
  const urlFirst = getFirstSegment(new URL(url, window.location.origin).pathname);

  const isActive = currentFirst === urlFirst;

  if (externalLink) {
    return (
      <a
        href={url}
        className={`${styles.navLink} ${customClasses} ${isActive ? styles.isActive : ''}`}
        {...rest}
      >
        {children}
      </a>
    );
  }
    return (
      <NavLink
        to={url}
        // exact={exact}
        className={`${styles.navLink} ${customClasses}`}
        activeClassName={styles.isActive}
        {...rest}
      >
        {children}
      </NavLink>
    );
  };
  
export default ActiveLink;

