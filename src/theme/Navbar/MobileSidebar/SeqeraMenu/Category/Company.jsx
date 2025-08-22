import React from "react";
import Link from "../../../Layout/SeqeraHeader/_shared/Link";
import styles from "./styles.module.css";

import {
  AiIcon,
  About,
  Contact,
  Feedback,
} from "../../../Layout/SeqeraHeader/HeaderDesktop/Submenu/shared/icons";

const links = {
  company: [
    ["Seqera.io", "/about/", About],
    ["Contact us", "/contact-us/", Contact],
    ["Submit Feedback", "/feedback/", Feedback],
  ],
};
const Company = ({ toggleMenu }) => {
  return (
    <ul className={`${styles.menuList}`}>
      <p className="mb-4 text-[.7rem] font-display">Company</p>
      {links.company.map(([label, href, Icon]) => (
        <li key={label}>
          <a
            href={href}
            className={`whitespace-nowrap
              flex items-center pr-2 rounded-md
              transition-all duration-500 ease-in-out
              h-[25px] font-normal`}
          >
            <div className={`${styles.iconItem}`}>
              <Icon />
            </div>
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Company;
