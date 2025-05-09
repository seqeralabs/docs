import React from "react";
import { NavLink } from 'react-router-dom';
import styles from "./activelink.module.css";

const ActiveLink = ({ url, exact, children, customClasses, ...rest }) => {
    return (
      <a
        href={url}
        // exact={exact}
        className={`${styles.navLink} ${customClasses}`}
        {...rest}
      >
        {children}
      </a>
    );
  };
  
export default ActiveLink;




