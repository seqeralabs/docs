import React from "react";
import clsx from "clsx";

import styles from "./styles.module.css";

import Link from "../../_shared/Link";
import LogoPlatform from "./images/platform.inline.svg";
import LogoNextflow from "./images/nextflow.inline.svg";
import LogoMultiQC from "./images/multiqc.inline.svg";
import LogoWave from "./images/wave.inline.svg";
import LogoFusion from "./images/fusion.inline.svg";
import Github from "./images/github.inline.svg";
import Panels from "./Panels";

import { links } from "../../links";

const Products = ({ isOpen }) => {
  return (
    <Panels products isOpen={isOpen}>
      <Panels.Panel
        highlighted
        Image={LogoPlatform}
        imageURL="https://seqera.io/platform/"
        subtitle="Fully integrated and scalable tools for modern bioinformatics"
        links={{
          Overview: "https://seqera.io/platform/",
          Documentation: links.docs["Seqera platform"],
          Pricing: links.company.Pricing,
        }}
        footer={
          <>
            <Link
              to="https://tower.nf/login"
              className={clsx(styles.button, styles.cta)}
            >
              Sign up
            </Link>
            <Link to="https://tower.nf/login" className={styles.button}>
              Login
            </Link>
          </>
        }
      />
      <Panels.Panel
        Image={LogoNextflow}
        imageURL="https://seqera.io/nextflow/"
        subtitle="Open-source orchestrator for deploying workflows"
        links={{
          Overview: "https://seqera.io/nextflow/",
          Documentation: links.docs.Nextflow,
        }}
        footer={
          <Link
            to="https://github.com/nextflow-io/nextflow"
            title="Nextflow on GitHub"
          >
            <Github />
          </Link>
        }
      />

      <Panels.Panel
        Image={LogoMultiQC}
        imageURL="https://seqera.io/multiqc/"
        subtitle="Open-source tool to aggregate bioinformatic analyses results"
        links={{
          Overview: "https://seqera.io/multiqc/",
          Documentation: links.docs.MultiQC,
          Modules: "https://multiqc.info/modules/",
        }}
        footer={
          <Link to="https://github.com/ewels/MultiQC" title="MultiQC on GitHub">
            <Github />
          </Link>
        }
      />
      <Panels.Panel
        Image={LogoWave}
        imageURL="https://seqera.io/wave/"
        subtitle="Next generation container provisioning for data analysis"
        links={{
          Overview: "https://seqera.io/wave/",
          Documentation: links.docs.Wave,
        }}
        footer={
          <Link to="https://github.com/seqeralabs/wave" title="Wave on GitHub">
            <Github />
          </Link>
        }
      />
      <Panels.Panel
        Image={LogoFusion}
        imageURL="https://seqera.io/fusion/"
        subtitle="Distributed, lightweight file system for cloud data pipelines"
        links={{
          Overview: "https://seqera.io/fusion/",
          Documentation: links.docs.Fusion,
        }}
      />
    </Panels>
  );
};

export default Products;
