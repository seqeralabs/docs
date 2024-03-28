import React from "react";
import Link from "../../../Layout/SeqeraHeader/_shared/Link";

import { links } from "../../../Layout/SeqeraHeader/links";

const Company = ({ toggleMenu }) => {
  return (
    <ul>
      <li>
        <Link to={links.company["About us"]} onClick={toggleMenu}>
          About us
        </Link>
      </li>
      <li>
        <Link to={links.company["Press Center"]} onClick={toggleMenu}>
          Press Center
        </Link>
      </li>
      <li>
        <Link to={links.company.Careers} onClick={toggleMenu}>
          Careers
        </Link>
      </li>
      <li>
        <Link to={links.company.Blog} onClick={toggleMenu}>
          Blog
        </Link>
      </li>
      <li>
        <Link to={links.community.Podcasts} onClick={toggleMenu}>
          Podcast
        </Link>
      </li>
      <li>
        <Link to={links.resources.Whitepapers} onClick={toggleMenu}>
          Whitepapers
        </Link>
      </li>
    </ul>
  );
};

export default Company;
