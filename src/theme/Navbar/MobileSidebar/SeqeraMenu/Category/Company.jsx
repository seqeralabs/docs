import React from "react";
import Link from "../../../Layout/SeqeraHeader/_shared/Link";

import { links } from "../../../Layout/SeqeraHeader/links";

const Company = ({ toggleMenu }) => {
  return (
    <ul className="mb-8">
      <h6 className="mb-3 text-[.9rem] font-display">Company</h6>
      <li>
        <Link to={links.company["Seqera.io"]} onClick={toggleMenu}>
          Seqera.io
        </Link>
      </li>

      <li>
        <Link to={links.company["Contact Us"]} onClick={toggleMenu}>
          Contact Us
        </Link>
      </li>

      <li>
        <Link to={links.company["Submit Feedback"]} onClick={toggleMenu}>
          Submit Feedback
        </Link>
      </li>
    </ul>
  );
};

export default Company;
