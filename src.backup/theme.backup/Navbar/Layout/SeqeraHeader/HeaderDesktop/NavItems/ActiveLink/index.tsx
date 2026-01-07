import React, {useEffect, useState} from "react";
import { NavLink } from 'react-router-dom';
import styles from "./activelink.module.css";

const ActiveLink = ({ url, apiLink, externalLink, exact, children, customClasses, ...rest }) => {
  
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const currentPath = window.location.pathname;
    setIsActive(currentPath.includes('/platform-api'));
  }, []);

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

  if (apiLink) {
    return (
      <a
      href={url}
      className={`${styles.navLink} ${customClasses}  ${isActive ? styles.isActive : ''}`}
    >
      {children}
    </a>
    )
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
