import React from "react";
import { NavLink } from 'react-router-dom';
import styles from "./activelink.module.css";

const ActiveLink = ({ url, externalLink, exact, children, customClasses, ...rest }) => {
  
  if (externalLink) {
    const getUrl = window.location.pathname.split('/')[1];
    const isActive = url.includes(getUrl);

    return (
      <a
        href={url}
        className={`${styles.navLink} ${isActive && styles.isActive} ${customClasses}`}
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

