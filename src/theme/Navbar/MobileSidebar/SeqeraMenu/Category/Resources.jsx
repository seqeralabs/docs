import React from "react";
import Link from "../../../Layout/SeqeraHeader/_shared/Link";

import { links } from "../../../Layout/SeqeraHeader/links";

const Resources = ({ toggleMenu }) => {
  return (
    <ul>
      <li>
        <Link to={links.docs["Seqera Platform"]} onClick={toggleMenu}>
          Documentation
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
      <li>
        <Link to={links.company["Case Studies"]} onClick={toggleMenu}>
          Case studies
        </Link>
      </li>
      <li>
        <Link to={links.resources.ebooks} onClick={toggleMenu}>
          Ebooks
        </Link>
      </li>
      <li>
        <Link to={links.resources["Contact us"]} onClick={toggleMenu}>
          Get in touch
        </Link>
      </li>
      <li>
        <Link to={links.resources.Support} onClick={toggleMenu}>
          Support
        </Link>
      </li>
      <li>
        <Link to={links.company.Pricing} onClick={toggleMenu}>
          Pricing
        </Link>
      </li>
    </ul>
  );
};

export default Resources;
