import React from "react";
import Link from "../../../Layout/SeqeraHeader/_shared/Link";

import { links } from "../../../Layout/SeqeraHeader/links";

const Community = ({ toggleMenu }) => {
  return (
    <ul>
      <li>
        <Link to={links.community.Forums} onClick={toggleMenu}>
          Forums
        </Link>
      </li>
      <li>
        <Link to={links.events.webinars} onClick={toggleMenu}>
          Webinars & talks
        </Link>
      </li>
      <li>
        <Link to={links.events.conferences} onClick={toggleMenu}>
          Conferences
        </Link>
      </li>
      <li>
        <Link to={links.events.seqera} onClick={toggleMenu}>
          Seqera events
        </Link>
      </li>
      <li>
        <Link to={links.community.Partners} onClick={toggleMenu}>
          Partners & platforms
        </Link>
      </li>
    </ul>
  );
};

export default Community;
