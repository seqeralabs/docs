import React from "react";
import clsx from "clsx";
import { useLocation } from "@docusaurus/router";
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
    if (location.pathname.startsWith("/fusion")) {
      product = "Fusion";
    }
    if (location.pathname.startsWith("/nextflow")) {
      product = "Nextflow";
    }
    if (location.pathname.startsWith("/multiqc")) {
      product = "MultiQC";
    }
    if (location.pathname.startsWith("/platform")) {
      product = "Platform";
    }
    if (location.pathname.startsWith("/wave")) {
      product = "Wave";
    }
  }
  const logos = {
    Platform: {
      light: Platform,
      dark: PlatformDark,
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
  const Logo = logos[product].light;
  const LogoDark = logos[product].dark;
  return (
    <span
      className={clsx(styles.item, { [styles.lg]: product === "Platform" })}
    >
      <Logo className={styles.themeLight} />
      <LogoDark className={styles.themeDark} />
    </span>
  );
};

export default ProductSwitcher;
