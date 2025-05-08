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
      <h6 className="mb-3 text-[.7rem] font-display">Company</h6>
      {links.company.map(([label, href, Icon]) => (
        <li key={label}>
          <a
            href={href}
            className={`whitespace-nowrap
              flex items-center text-[14px] pr-2 rounded-md
              transition-all duration-500 ease-in-out hover:no-underline
              h-[25px]`}
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
