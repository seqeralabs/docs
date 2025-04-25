import React from "react";
import Link from "../../../../Layout/SeqeraHeader/_shared/Link";

import LogoPlatform from "./images/platform.inline.svg";
import LogoNextflow from "./images/nextflow.inline.svg";
import LogoMultiQC from "./images/multiqc.inline.svg";
import LogoWave from "./images/wave.inline.svg";
import LogoFusion from "./images/fusion.inline.svg";

import styles from "./styles.module.css";

const Products = ({ toggleMenu }) => {
  return (
    <ul className={styles.products}>
      <li>
        <Link to="/platform-cloud" onClick={toggleMenu}>
          <LogoPlatform />
          <span>Seqera Platform</span>
        </Link>
      </li>
      <li>
        <Link to="/nextflow" onClick={toggleMenu}>
          <LogoNextflow />
          <span>Nextflow</span>
        </Link>
      </li>
      <li>
        <Link to="/multiqc/" onClick={toggleMenu}>
          <LogoMultiQC />
          <span>MultiQC</span>
        </Link>
      </li>
      <li>
        <Link to="/wave" onClick={toggleMenu}>
          <LogoWave />
          <span>Wave</span>
        </Link>
      </li>
      <li>
        <Link to="/fusion" onClick={toggleMenu}>
          <LogoFusion />
          <span>Fusion</span>
        </Link>
      </li>
    </ul>
  );
};

export default Products;
