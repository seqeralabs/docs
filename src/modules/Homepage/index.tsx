import React, { useState } from "react";
import Layout from "@theme/Layout";
import clsx from "clsx";

import useMediaQuery from "../../theme/Navbar/Layout/SeqeraHeader/hooks/useMediaQuery";
import Sidebar from "../../theme/DocSidebar/Desktop";

import styles from "./styles.module.css";

import Link from '@docusaurus/Link';

import CodeBlock from "@theme-original/CodeBlock";

import Fusion from "./images/fusion.inline.svg";
import Nextflow from "./images/nextflow.inline.svg";
import MultiQC from "./images/multiqc.inline.svg";
import Platform from "./images/platform2.inline.svg";
import Wave from "./images/wave.inline.svg";

import Card from "../../components/Card";
import Grid from "../../components/Grid";

import Resources from "./Resources";
import SearchBar from "@theme/SearchBar";

import { themes } from 'prism-react-renderer';

const useCases = [
  {
    title: "Basic pipeline",
    code: `
workflow {
  FASTQC(read_pairs_ch)
  MULTIQC(FASTQC.out.collect())
}`,
  },
  {
    title: "Parallel execution",
    code: `
process SPLIT_SEQUENCES {
  input:
    path sequences
  output:
    path 'chunk_*'

  script:
  """
  split -l 100 $sequences chunk_
  """
}

workflow {
  Channel
    .fromPath('data/*.fa')
    .set { sequences }

  SPLIT_SEQUENCES(sequences)
  SPLIT_SEQUENCES.out
    .flatten()
    .set { chunks }

  ALIGN(chunks)
  MERGE(ALIGN.out.collect())
}`,
  },
  {
    title: "Conditional execution",
    code: `
workflow {
  if (params.with_fusion) {
    FUSION(input_ch)
    PROCESS(FUSION.out)
  } else {
    PROCESS(input_ch)
  }
}`,
  },
  {
    title: "Cloud execution",
    code: `
process {
  executor = 'awsbatch'
  queue = 'my-batch-queue'
  container = 'nextflow/rnaseq-nf:latest'
}

aws {
  region = 'eu-west-1'
  batch {
    cliPath = '/home/ec2-user/miniconda/bin/aws'
  }
}`,
  },
];

export default function Home(): JSX.Element {
  const isMobile = useMediaQuery("(max-width: 996px)");
  const disabled = true;
  const [selectedUseCase, setSelectedUseCase] = useState(0);

  return (
    <Layout>
      <div className="flex w-full">
        {!isMobile && !disabled && (
          <div className={styles.sidebarContainer}>
            <Sidebar path="/" />
          </div>
        )}
        <main className="flex-grow">
          <div className="flex flex-col items-center justify-center w-full mb-10 py-24 bg-brand-100">
            <p className="font-title typo-h1 font-light w-full text-center">Build with <span className="font-medium">Seqera</span></p>
            <p className="font-title typo-h4 font-normal w-full text-center">Learn how to get started with Seqera Platform and Nextflow</p>
            <div className="w-full max-w-[800px] px-10 mt-8">
              <SearchBar />
            </div>
          </div>
          <div className={clsx("md:p-8 py-10", styles.page)}>
            <div className="container-md flex flex-wrap text-brand-1000">
              <div className="flex flex-col w-full">
                {/* <div className="flex w-full mb-4">
                  <div className="w-full">
                    <Link to="/docs/release-notes">Release notes</Link>
                  </div>
                </div> */}

                <p className="font-title typo-h4 font-semibold mb-12 w-full text-center">Get started with tools and guides</p>
                <div className="flex w-full mb-8">
                  <div className="w-1/3 pr-2">
                    <p className="font-title typo-h4 font-medium">Launching Pipelines</p>
                    <ul className="list-none p-0 leading-8">
                      <li><Link to="/platform/24.1/getting-started/quickstart-demo/add-pipelines">Add pipelines</Link></li>
                      <li><Link to="/platform/24.1/getting-started/quickstart-demo/monitor-runs">Monitor runs</Link></li>
                      <li><Link to="/platform/24.1/getting-started/quickstart-demo/automationn">Automation</Link></li>
                    </ul>
                  </div>
                  <div className="w-1/3 px-2">
                    <p className="font-title typo-h4 font-medium">Data Studios</p>
                    <ul className="list-none p-0 leading-8">
                      <li><Link to="/platform/24.1/data/data-studios">Data Studios overview</Link></li>
                      <li><Link to="/platform/24.1/enterprise/data-studios">Deploy Data Studios</Link></li>
                      <li><Link to="/platform/24.1/data/data-explorer">Data Explorer</Link></li>
                    </ul>
                  </div>
                  <div className="w-1/3 pl-2">
                    <p className="font-title typo-h4 font-medium">Developer tools</p>
                    <ul className="list-none p-0 leading-8">
                      <li><Link to="/platform/24.1/api/overview">Platform API</Link></li>
                      <li><Link to="/platform/24.1/cli/overview">Platform CLI</Link></li>
                      <li><Link to="https://nextflow.io/docs/latest/cli.html">Nextflow CLI</Link></li>
                    </ul>
                  </div>
                </div>
                {/* 
                <div className="flex w-full mb-4">
                  <div className="w-full">
                    <p className="typo-h4 font-bold">Get started with Nextflow</p>
                  </div>
                </div> */}

                <div className="flex w-full mb-12">
                  <div className="w-full">
                    <p className="font-title typo-h4 font-semibold mb-4">Try Nextflow</p>
                    <div className="flex gap-5">
                      <div className="w-1/3 h-[300px] max-h-[300px] min-h-[300px] p-3 bg-white rounded-lg border-1 border-brand-200 border-solid">
                        {useCases.map((useCase, index) => (
                          <button
                            key={index}
                            className={`block w-full text-left py-4 px-3 mb-2 rounded text-base cursor-pointer font-normal ${
                              selectedUseCase === index
                                ? "bg-white text-brand shadow-xl border-none"
                                : "text-brand-600 border-none bg-transparent transition-all ease-in-out duration-300 hover:shadow-xl"
                            }`}
                            onClick={() => setSelectedUseCase(index)}
                          >
                            {useCase.title}
                          </button>
                        ))}
                      </div>
                      <div className="w-2/3 overflow-y-auto">
                        {/* <pre className="p-4 rounded-lg"> */}
                          <CodeBlock language="groovy">{useCases[selectedUseCase].code}</CodeBlock>
                          {/* <code className="text-white">{useCases[selectedUseCase].code}</code> */}
                        {/* </pre> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex w-full mb-8">
                  <div className="w-full">
                    <p className="font-title typo-h4 font-semibold mb-4">Browse by product</p>
                  </div>
                </div>

                <div className="flex flex-col w-full gap-10">
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row w-full">
                      <p className="w-full text-sm font-normal text-brand-600 uppercase">Open Source</p>
                    </div>
                    <div className="flex flex-row flex-wrap w-full gap-4">
                      <Link to="https://nextflow.io/docs/latest/index.html" className="flex-col items-start w-full max-w-[30%] border-1 border-brand-200 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand">
                        <img src="/img/nextflow-icon.svg" alt="Nextflow" className="mb-3" />
                        <p className="m-0 text-brand text-lg mb-1">Nextflow</p>
                        <p className="m-0 text-sm text-brand-600">Orchestrator</p>
                      </Link>
                      <Link to="/wave" className="flex-col items-start w-full max-w-[30%] border-1 border-brand-200 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand">
                        <img src="/img/wave-icon.svg" alt="Wave" className="mb-3" />
                        <p className="m-0 text-brand text-lg mb-1">Wave</p>
                        <p className="m-0 text-sm text-brand-600">Containers</p>
                      </Link>
                      <Link to="/multiqc" className="flex-col items-start w-full max-w-[30%] border-1 border-brand-200 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand">
                        <img src="/img/multiqc-icon.svg" alt="MultiQC" className="mb-3" />
                        <p className="m-0 text-brand text-lg mb-1">MultiQC</p>
                        <p className="m-0 text-sm text-brand-600">Reporting</p>
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row w-full">
                      <p className="w-full text-sm font-normal text-brand-600 uppercase">Platform</p>
                    </div>
                    <div className="flex flex-row flex-wrap w-full gap-4">
                      <Link to="/platform/24.1/getting-started/quickstart-demo/comm-showcase" className="flex-col items-start w-full max-w-[30%] border-1 border-brand-200 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand">
                        <img src="/img/cloud.svg" alt="Seqera Cloud" className="mb-3" />
                        <p className="m-0 text-brand text-lg mb-1">Seqera Cloud</p>
                        <p className="m-0 text-sm text-brand-600">Orchestrator</p>
                      </Link>
                      <Link to="/platform/24.1/enterprise" className="flex-col items-start w-full max-w-[30%] border-1 border-brand-200 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand">
                        <img src="/img/enterprise.svg" alt="Seqera Enterprise" className="mb-3" />
                        <p className="m-0 text-brand text-lg mb-1">Seqera Enterprise</p>
                        <p className="m-0 text-sm text-brand-600">Containers</p>
                      </Link>
                      <Link to="/fusion" className="flex-col items-start w-full max-w-[30%] border-1 border-brand-200 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand">
                        <img src="/img/fusion-icon.svg" alt="Fusion" className="mb-3" />
                        <p className="m-0 text-brand text-lg mb-1">Fusion</p>
                        <p className="m-0 text-sm text-brand-600">Reporting</p>
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row w-full">
                      <p className="w-full text-sm font-normal text-brand-600 uppercase">Cloud</p>
                    </div>
                    <div className="flex flex-row flex-wrap w-full gap-4">
                      <Link to="/platform/24.1/enterprise/prerequisites/aws" className="flex-col items-start w-full max-w-[30%] border-1 border-brand-200 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand">
                        <img src="/img/aws.svg" alt="AWS" className="mb-3" />
                        <p className="m-0 text-brand text-lg mb-1">AWS</p>
                        <p className="m-0 text-sm text-brand-600">Orchestrator</p>
                      </Link>
                      <Link to="/platform/24.1/enterprise/prerequisites/gcp#gcp-setup" className="flex-col items-start w-full max-w-[30%] border-1 border-brand-200 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand">
                        <img src="/img/gcp.svg" alt="GCP" className="mb-3" />
                        <p className="m-0 text-brand text-lg mb-1">GCP</p>
                        <p className="m-0 text-sm text-brand-600">Containers</p>
                      </Link>
                      <Link to="/platform/24.1/enterprise/prerequisites/azure" className="flex-col items-start w-full max-w-[30%] border-1 border-brand-200 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand">
                        <img src="/img/azure.svg" alt="Azure" className="mb-3" />
                        <p className="m-0 text-brand text-lg mb-1">Azure</p>
                        <p className="m-0 text-sm text-brand-600">Reporting</p>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full mt-10 mb-4">
                  <div className="flex flex-row w-full">
                    <p className="w-full text-sm font-normal text-brand-600 uppercase">Support</p>
                  </div>
                  <div className="flex flex-row flex-wrap w-full gap-4">
                    <Link to="https://support.seqera.io" className="flex-col items-start w-full max-w-[30%] border-1 border-brand-200 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand">
                      <img src="/img/help.svg" alt="Help center" className="mb-3" />
                      <p className="m-0 text-brand text-lg mb-1">Help center</p>
                      <p className="m-0 text-sm text-brand-600">Contact support for help with your Pro or Enterprise account</p>
                    </Link>
                    <Link to="https://community.seqera.io" className="flex-col items-start w-full max-w-[30%] border-1 border-brand-200 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand">
                      <img src="/img/forum.svg" alt="Community forum" className="mb-3" />
                      <p className="m-0 text-brand text-lg mb-1">Community forum</p>
                      <p className="m-0 text-sm text-brand-600">Discuss topics with other users</p>
                    </Link>
                    <Link to="https://status.seqera.io" className="flex-col items-start w-full max-w-[30%] border-1 border-brand-200 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand">
                      <img src="/img/status.svg" alt="Service status" className="mb-3" />
                      <p className="m-0 text-brand text-lg mb-1">Service status</p>
                      <p className="m-0 text-sm text-brand-600">Check the status of Seqera services</p>
                    </Link>
                  </div>
                </div>
              </div>
              {/* <div className="w-full md:w-3/5 flex lg:pl-3">
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
              </div> */}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
