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
        <a href="/platform-cloud" onClick={toggleMenu}>
          Cloud
        </a>
      </li>
      <li>
        <a href="/platform-enterprise" onClick={toggleMenu}>
          Enterprise
        </a>
      </li>
      <li>
        <a href="/nextflow" onClick={toggleMenu}>
          Nextflow
        </a>
      </li>
      <li>
        <a href="/wave" onClick={toggleMenu}>
          Wave
        </a>
      </li>
      <li>
        <a href="/multiqc/" onClick={toggleMenu}>
          MultiQC
        </a>
      </li>
      <li>
        <a href="/fusion" onClick={toggleMenu}>
          Fusion
        </a>
      </li>
    </ul>
  );
};

export default Products;
