import React from "react";
import { NavLink } from 'react-router-dom';
import styles from "./activelink.module.css";

const ActiveLink = ({ url, externalLink, exact, children, customClasses, ...rest }) => {
  
  if (externalLink) {
    return (
      <a
        href={url}
        className={`${styles.navLink} ${customClasses}`}
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




