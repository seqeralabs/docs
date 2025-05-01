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
          Cloud
        </Link>
      </li>
      <li>
        <Link to="/platform-enterprise" onClick={toggleMenu}>
          Enterprise
        </Link>
      </li>
      <li>
        <Link to="/nextflow" onClick={toggleMenu}>
          Nextflow
        </Link>
      </li>
      <li>
        <Link to="/wave" onClick={toggleMenu}>
          Wave
        </Link>
      </li>
      <li>
        <Link to="/multiqc/" onClick={toggleMenu}>
          MultiQC
        </Link>
      </li>
      <li>
        <Link to="/fusion" onClick={toggleMenu}>
          Fusion
        </Link>
      </li>
    </ul>
  );
};

export default Products;
