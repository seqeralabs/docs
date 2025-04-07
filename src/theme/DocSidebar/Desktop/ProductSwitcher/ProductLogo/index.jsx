import React from "react";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";
import styles from "./styles.module.css";

import Fusion from "../images/fusion.svg";
import Nextflow from "../images/nextflow.svg";
import MultiQC from "../images/multiqc.svg";
import Cloud from "../images/platform-cloud.svg";
import Enterprise from "../images/platform-enterprise.svg";
import Wave from "../images/wave.svg";

import FusionDark from "../images/fusion.dark.svg";
import NextflowDark from "../images/nextflow.dark.svg";
import MultiQCDark from "../images/multiqc.dark.svg";
import CloudDark from "../images/platform-cloud.dark.svg";
import EnterpriseDark from "../images/platform-enterprise.dark.svg";
import WaveDark from "../images/wave.dark.svg";

const ProductSwitcher = ({ product }) => {
  const location = useLocation();
  if (product === undefined) {
    if (location.pathname.startsWith("/fusion")) {
      product = "Fusion";
    }
    if (location.pathname.startsWith("/nextflow")) {
      product = "Nextflow";
    }
    if (location.pathname.startsWith("/multiqc")) {
      product = "MultiQC";
    }
    if (location.pathname.startsWith("/platform-cloud")) {
      product = "Platform Cloud";
    }
    if (location.pathname.startsWith("/platform-enterprise")) {
      product = "Platform Enterprise";
    }
    if (location.pathname.startsWith("/wave")) {
      product = "Wave";
    }
  }

  const logos = {
    "Platform Enterprise": {
      light: Enterprise,
      dark: EnterpriseDark,
    },
    "Platform Cloud": {
      light: Cloud,
      dark: CloudDark,
    },
    Nextflow: {
      light: Nextflow,
      dark: NextflowDark,
    },
    MultiQC: {
      light: MultiQC,
      dark: MultiQCDark,
    },
    Wave: {
      light: Wave,
      dark: WaveDark,
    },
    Fusion: {
      light: Fusion,
      dark: FusionDark,
    },
  };

  const Logo = logos[product]?.light;
  const LogoDark = logos[product]?.dark;

  return (
    <span className={styles.item}>
      {Logo && <Logo className={styles.themeLight} />}
      {LogoDark && <LogoDark className={styles.themeDark} />}
    </span>
  );
};

export default ProductSwitcher;
