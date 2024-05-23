import React from "react";
import clsx from "clsx";

import styles from "./styles.module.css";

import LogoPlatform from "./images/platform.inline.svg";
import LogoNextflow from "./images/nextflow.inline.svg";
import LogoMultiQC from "./images/multiqc.inline.svg";
import LogoWave from "./images/wave.inline.svg";
import LogoFusion from "./images/fusion.inline.svg";

import {
  About,
  Core,
  DocsDark,
  Docs,
  Github,
  Tag,
  Whitepapers,
  MultiQC,
  Nextflow,
  Modules,
  Fusion,
  Wave,
} from "../shared/icons";

import Link from "../shared/Link";
import Panel from "../shared/Panel";

function isActive(id) {
  if (typeof window === "undefined") return false;
  return window.location.pathname === id;
}

const LinkItem = ({ to, children }) => {
  let href = to;
  let sameTab = false;
  if (!to.startsWith("http")) href = `https://seqera.io${to}`;
  if (href.includes("seqera.io")) sameTab = true;
  return (
    <li>
      <Link
        to={href}
        sameTab={sameTab}
        className={clsx(styles.link, { [styles.active]: isActive(to) })}
      >
        {children}
      </Link>
    </li>
  );
};

const Products = () => {
  return (
    <div className="flex">
      <div className="w-[20%] flex-none">
        <Panel highlighted>
          <Link
            to="https://seqera.io/platform/"
            className="leading-[0] block"
            sameTab
          >
            <LogoPlatform />
          </Link>
          <div className={clsx(styles.description, styles.dark)}>
            Full integrated and scalable tools for modern bioinformatics
          </div>
          <div className={clsx(styles.label)}>All-in-one cloud platform</div>
          <ul className={clsx(styles.links, styles.dark, "mt-4 mb-6")}>
            <LinkItem to="/platform/">
              <About />
              Overview
            </LinkItem>
            <LinkItem to="https://docs.seqera.io">
              <DocsDark />
              Documentation
            </LinkItem>
            <LinkItem to="/pricing/">
              <Tag />
              Pricing
            </LinkItem>
          </ul>
          <Link
            to="https://cloud.seqera.io/login"
            className={styles.button}
            sameTab
          >
            Get started
          </Link>
        </Panel>
      </div>
      <div className="flex-auto flex flex-wrap -m-1 pl-2">
        <div className="p-1 w-[50%]">
          <Panel className="flex">
            <div className="pr-3">
              <Link
                className="block leading-[0]"
                to="https://seqera.io/nextflow/"
                sameTab
              >
                <LogoNextflow />
              </Link>
              <div className={styles.description}>
                Full integrated and scalable tools for modern bioinformatics
              </div>
              <div className={clsx(styles.label, styles.nextflow)}>
                For writing data pipeline workflows
              </div>
            </div>
            <div>
              <ul className={clsx(styles.links)}>
                <LinkItem to="/nextflow/">
                  <Nextflow />
                  Overview
                </LinkItem>
                <LinkItem to="https://www.nextflow.io/docs/latest/">
                  <Docs />
                  Documentation
                </LinkItem>
                <LinkItem to="https://nf-co.re">
                  <Core />
                  nf-core
                </LinkItem>
              </ul>
            </div>
            <Link
              className={styles.github}
              to="https://github.com/nextflow-io/nextflow"
            >
              <Github />
            </Link>
          </Panel>
        </div>
        <div className="p-1 w-[50%]">
          <Panel className="flex">
            <div className="pr-3">
              <Link
                className="block leading-[0]"
                to="https://seqera.io/multiqc/"
                sameTab
              >
                <LogoMultiQC />
              </Link>
              <div className={styles.description}>
                Open-source tool to aggregate bioinformatic analyses results
              </div>
              <div className={clsx(styles.label, styles.multiqc)}>
                For analyzing your workflow results
              </div>
            </div>
            <div>
              <ul className={clsx(styles.links)}>
                <LinkItem to="/multiqc/">
                  <MultiQC />
                  Overview
                </LinkItem>
                <LinkItem to="https://multiqc.info/docs/">
                  <Docs />
                  Documentation
                </LinkItem>
                <LinkItem to="https://multiqc.info/modules/">
                  <Modules />
                  Modules
                </LinkItem>
              </ul>
            </div>
            <Link
              className={styles.github}
              to="https://github.com/MultiQC/MultiQC"
            >
              <Github />
            </Link>
          </Panel>
        </div>
        <div className="p-1 w-[50%]">
          <Panel className="flex">
            <div className="pr-3">
              <Link
                className="block leading-[0]"
                to="https://seqera.io/wave/"
                sameTab
              >
                <LogoWave />
              </Link>
              <div className={styles.description}>
                Open-source container creation and distribution for data
                analysis
              </div>
              <div className={clsx(styles.label, styles.wave)}>
                For managing your workflow containers
              </div>
            </div>
            <div>
              <ul className={clsx(styles.links)}>
                <LinkItem to="/wave/">
                  <Wave />
                  Overview
                </LinkItem>
                <LinkItem to="https://docs.seqera.io/wave">
                  <Docs />
                  Documentation
                </LinkItem>
              </ul>
            </div>
            <Link
              className={styles.github}
              to="https://github.com/seqeralabs/wave"
            >
              <Github />
            </Link>
          </Panel>
        </div>
        <div className="p-1 w-[50%]">
          <Panel className="flex">
            <div className="pr-3">
              <Link
                className="block leading-[0]"
                to="https://seqera.io/fusion/"
                sameTab
              >
                <LogoFusion />
              </Link>
              <div className={styles.description}>
                Distributed, lightweight file system for cloud data pipelines
              </div>
              <div className={clsx(styles.label, styles.fusion)}>
                Cloud-native file system for data management
              </div>
            </div>
            <div>
              <ul className={clsx(styles.links)}>
                <LinkItem to="/fusion/">
                  <Fusion />
                  Overview
                </LinkItem>
                <LinkItem to="https://docs.seqera.io/fusion">
                  <Docs />
                  Documentation
                </LinkItem>
                <LinkItem to="/whitepapers/breakthrough-performance-and-cost-efficiency-with-the-new-fusion-file-system/">
                  <Whitepapers />
                  Whitepaper
                </LinkItem>
              </ul>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default Products;
