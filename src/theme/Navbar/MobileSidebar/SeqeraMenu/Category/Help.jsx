import React from "react";
import Link from "../../../Layout/SeqeraHeader/_shared/Link";

import { links } from "../../../Layout/SeqeraHeader/links";

const Help = ({ toggleMenu }) => {
  return (
    <ul className="mb-8">
      <h6 className="mb-3 text-[.9rem] font-display">Help</h6>
      <li>
        <Link to={links.help["Support Portal"]} onClick={toggleMenu}>
          Support Portal
        </Link>
      </li>
      <li>
        <Link to={links.help.Forum} onClick={toggleMenu}>
          Forum
        </Link>
      </li>
      <li>
        <Link to={links.help["Nextflow Slack"]} onClick={toggleMenu}>
          Nextflow Slack
        </Link>
      </li>
      <li>
        <Link to={links.help["Seqera AI"]} onClick={toggleMenu}>
          Seqera AI
        </Link>
      </li>
    </ul>
  );
};

export default Help;
