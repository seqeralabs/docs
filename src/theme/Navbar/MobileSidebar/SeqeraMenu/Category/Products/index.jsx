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
          Platform Cloud
        </a>
      </li>
      <li>
        <a href="/platform-enterprise" onClick={toggleMenu}>
          Platform Enterprise
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
      <li>
        <a href="/https://training.nextflow.io/latest/" onClick={toggleMenu}>
          Nextflow Training 
          <div className="opacity-60 ml-1"><svg  width="12" height="12" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_nPIU"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>
          </div>
        </a>
      </li>
      <li>
        <a href="/platform-api" onClick={toggleMenu}>
          Platform API  
          <div className="opacity-60 ml-1"><svg  width="12" height="12" aria-hidden="true" viewBox="0 0 24 24" class="iconExternalLink_nPIU"><path fill="currentColor" d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"></path></svg>
          </div>
        </a>
      </li>
    </ul>
  );
};

export default Products;
