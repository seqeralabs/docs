import React from "react";
import styles from "./styles.module.css";

import Fusion from "../images/fusion.inline.svg";
import Nextflow from "../images/nextflow.inline.svg";
import MultiQC from "../images/multiqc.inline.svg";
import Platform from "../images/platform2.inline.svg";
import Wave from "../images/wave.inline.svg";

import FusionDark from "../images/fusion.dark.inline.svg";
import NextflowDark from "../images/nextflow.dark.inline.svg";
import MultiQCDark from "../images/multiqc.dark.inline.svg";
import PlatformDark from "../images/platform2.dark.inline.svg";
import WaveDark from "../images/wave.dark.inline.svg";



const ProductSwitcher = ({ product }) => {
  if (product === undefined) {
    if(window.location.pathname.startsWith("/fusion")) { product = "fusion"; }
    if(window.location.pathname.startsWith("/nextflow")) { product = "nextflow"; }
    if(window.location.pathname.startsWith("/multiqc")) { product = "multiqc"; }
    if(window.location.pathname.startsWith("/platform")) { product = "platform"; }
    if(window.location.pathname.startsWith("/wave")) { product = "wave"; }
  }
  return (
    <>
      {product == "fusion" && (
        <>
          <Fusion className={styles.themeLight} />
          <FusionDark className={styles.themeDark} />
        </>
      )}
      {product == "nextflow" && (
        <>
          <Nextflow className={styles.themeLight} />
          <NextflowDark className={styles.themeDark} />
        </>
      )}
      {product == "multiqc" && (
        <>
          <MultiQC className={styles.themeLight} />
          <MultiQCDark className={styles.themeDark} />
        </>
      )}
      {product == "platform" && (
        <>
          <Platform className={styles.themeLight} />
          <PlatformDark className={styles.themeDark} />
        </>
      )}
      {product == "wave" && (
        <>
          <Wave className={styles.themeLight} />
          <WaveDark className={styles.themeDark} />
        </>
      )}
    </>
  )
}

export default ProductSwitcher;
