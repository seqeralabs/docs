import React from "react";
import { NavLink } from 'react-router-dom';
import styles from "./activelink.module.css";

const ActiveLink = ({ url, exact, children, customClasses, ...rest }) => {
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




