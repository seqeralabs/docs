import React from "react";
import styles from "./styles.module.css";

import Fusion from "./images/fusion.inline.svg";
import Nextflow from "./images/nextflow.inline.svg";
import MultiQC from "./images/multiqc.inline.svg";
import Platform from "./images/platform2.inline.svg";
import Wave from "./images/wave.inline.svg";
import Caret from "./images/Caret.svg";

const ProductSwitcher = () => {
  return (
    <div className={styles.productSwitcherWrapper}>
      <MultiQC />
      <Caret className={styles.caret} />
    </div>
  )
}

export default ProductSwitcher;
