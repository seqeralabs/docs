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
      <p className="mb-4 text-[.7rem] font-display">Help</p>
      {links.help.map(([label, href, Icon]) => (
        <li key={label}>
          <a
            href={href}
            className={`whitespace-nowrap
              flex items-center pr-2 rounded-md
              transition-all duration-500 ease-in-out
              h-[25px] font-normal`}
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
