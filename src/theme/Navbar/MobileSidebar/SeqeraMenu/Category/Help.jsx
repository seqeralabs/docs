import React from "react";
import Link from "../../../Layout/SeqeraHeader/_shared/Link";
import styles from "./styles.module.css";
import {
  AiIcon,
  Forum,
  Nextflow,
  Support,
} from "../../../Layout/SeqeraHeader/HeaderDesktop/Submenu/shared/icons";

const links = {
  help: [
    ["Forum", "https://community.seqera.io", Forum],
    ["Support Portal", "https://support.seqera.io", Support],
    ["Nextflow Slack", "https://www.nextflow.io/slack-invite.html", Nextflow],
    ["Seqera AI", "/ask-ai", AiIcon],
  ],
};

const Help = ({ toggleMenu }) => {
  return (
    <ul className={`${styles.menuList}`}>
      <h6 className="mb-3 text-[.7rem] font-display">Help</h6>
      {links.help.map(([label, href, Icon]) => (
        <li key={label}>
          <a
            href={href}
            className={`whitespace-nowrap
              flex items-center text-[14px] pr-2 rounded-md
              transition-all duration-500 ease-in-out hover:no-underline
              h-[25px] font-normal text-brand`}
          >
            <div className={`${styles.iconItem}`}>
              <Icon className="" />
            </div>
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Help;
