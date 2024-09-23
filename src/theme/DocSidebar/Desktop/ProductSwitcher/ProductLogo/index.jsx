import React from "react";
import { useLocation } from '@docusaurus/router';
import styles from "./styles.module.css";

import Fusion from "../images/fusion.svg";
import Nextflow from "../images/nextflow.svg";
import MultiQC from "../images/multiqc.svg";
import Platform from "../images/platform.svg";
import Wave from "../images/wave.svg";

import FusionDark from "../images/fusion.dark.svg";
import NextflowDark from "../images/nextflow.dark.svg";
import MultiQCDark from "../images/multiqc.dark.svg";
import PlatformDark from "../images/platform.dark.svg";
import WaveDark from "../images/wave.dark.svg";



const ProductSwitcher = ({ product }) => {
  const location = useLocation();
  if (product === undefined) {
    if(location.pathname.startsWith("/fusion")) { product = "fusion"; }
    if(location.pathname.startsWith("/nextflow")) { product = "nextflow"; }
    if(location.pathname.startsWith("/multiqc")) { product = "multiqc"; }
    if(location.pathname.startsWith("/platform")) { product = "platform"; }
    if(location.pathname.startsWith("/wave")) { product = "wave"; }
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
