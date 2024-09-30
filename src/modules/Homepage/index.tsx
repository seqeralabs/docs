import React from "react";
import Layout from "@theme/Layout";
import clsx from "clsx";

import useMediaQuery from "../../theme/Navbar/Layout/SeqeraHeader/hooks/useMediaQuery";
import Sidebar from "../../theme/DocSidebar/Desktop";

import styles from "./styles.module.css";

import Fusion from "./images/fusion.inline.svg";
import Nextflow from "./images/nextflow.inline.svg";
import MultiQC from "./images/multiqc.inline.svg";
import Platform from "./images/platform2.inline.svg";
import Wave from "./images/wave.inline.svg";

import Card from "../../components/Card";
import Grid from "../../components/Grid";

import Resources from "./Resources";

export default function Home(): JSX.Element {
  const isMobile = useMediaQuery("(max-width: 996px)");
  const disabled = true;
  return (
    <Layout>
      <div className="flex w-full">
        {!isMobile && !disabled && (
          <div className={styles.sidebarContainer}>
            <Sidebar path="/" />
          </div>
        )}
        <main className="flex-grow">
          <div className={clsx("md:p-8", styles.page)}>
            <div className="container-lg flex flex-wrap text-brand-1000">
              <div className="w-full md:w-3/5 flex lg:pl-3">
                <div className={"box px-4 pt-8 pb-10 sm:p-10"}>
                  <div style={{ maxWidth: 600 }}>
                    <h1 className="mb-8">Getting started with Seqera</h1>
                    <p>
                      Welcome to your central resource for analysis development
                      with Seqera.
                    </p>
                    <p className="hidden md:block">
                      Here you will learn how to compose data analysis
                      pipelines, optimize resource utilization, safeguard
                      reproducibility, and ensure data integrity.
                    </p>
                    <p className="hidden md:block">
                      You can also learn how to establish your own centralized
                      hub for managing & executing pipelines, and how to
                      leverage the cloud to scale for your data analysis
                      requirements.
                    </p>
                    <p>
                      Read the docs, take part, and join the community today!
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-2/5 p-4 sm:p-8 md:pl-4 md:py-0 md:pr-0 lg:pr-4">
                <Grid vertical>
                  <div>
                    <Card
                      to="/platform/"
                      title="Seqera Platform"
                      Img={Platform}
                      id="platform"
                    >
                      Fully integrated and scalable tools for modern
                      bioinformatics
                    </Card>
                  </div>
                  <div>
                    <Card
                      to="https://www.nextflow.io/docs/latest/"
                      title="Nextflow"
                      Img={Nextflow}
                      id="nextflow"
                    >
                      Open-source orchestrator for deploying workflows
                    </Card>
                  </div>
                  <div>
                    <Card
                      to="/multiqc/"
                      title="MultiQC"
                      Img={MultiQC}
                      id="multiqc"
                    >
                      Open-source tool to aggregate bioinformatics analysis
                      results
                    </Card>
                  </div>
                  <div>
                    <Card to="/wave/" title="Wave" Img={Wave} id="wave">
                      Next-generation container provisioning for data analysis
                    </Card>
                  </div>
                  <div>
                    <Card to="/fusion/" Img={Fusion} title="Fusion" id="fusion">
                      Distributed, lightweight file system for cloud data
                      pipelines
                    </Card>
                  </div>
                </Grid>
              </div>
              <div className="box px-4 pt-8 pb-10 sm:p-10 mt-8 w-full">
                <Resources />
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
