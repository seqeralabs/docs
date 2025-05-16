import React, { useState } from "react";
import Layout from "@theme/Layout";
import clsx from "clsx";

import useMediaQuery from "../../theme/Navbar/Layout/SeqeraHeader/hooks/useMediaQuery";
import Sidebar from "../../theme/DocSidebar/Desktop";

import styles from "./styles.module.css";

import Link from "@docusaurus/Link";

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

import { themes } from "prism-react-renderer";
import Button from "../../components/Button";

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
  const isMobile = useMediaQuery("(max-width: 995px)");
  const disabled = true;
  const [selectedUseCase, setSelectedUseCase] = useState(0);

  return (
    <Layout>
      <div className="homepage flex w-full pt-10">
        {!isMobile && !disabled && (
          <div className={styles.sidebarContainer}>
            <Sidebar path="/" />
          </div>
        )}
        <main className="flex-grow">
          <div className={clsx("p-8 md:p-8 py-10", styles.page)}>
            <div className="container-md flex flex-wrap text-brand-1000 dark:text-white">
              <div className="flex flex-col w-full">
                <p className="font-title typo-h2 font-medium w-full text-left mb-4">
                  Documentation
                </p>
                <p className="font-title typo-h4 font-normal w-full text-left">
                  Explore our guides, documentation, and examples to build with
                  Seqera.
                </p>
              </div>
              <Button
                to="/platform-cloud/getting-started/quickstart-demo/comm-showcase"
                blue
                medium
               
                className="mb-8 mt-4"
              >
                Get started with Platform Cloud
              </Button>
              <p className="font-title typo-h3 font-medium w-full text-left mb-8 mt-8">
                Recommended articles
              </p>
              <div className="flex flex-col w-full">
                {/* Do not remove below block, keeping as commented for now */}

                {/* <div className="flex w-full mb-12">
                  <div className="w-full">
                    <p className="font-title typo-h4 font-semibold mb-4">Try Nextflow</p>
                    <div className="flex gap-5">
                      <div className="w-1/3 h-[300px] max-h-[300px] min-h-[300px] p-3 bg-white rounded-lg border border-gray-300 border-solid">
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
                          <CodeBlock language="groovy">{useCases[selectedUseCase].code}</CodeBlock>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="flex flex-col w-full gap-10">
                  <div className="flex flex-row flex-wrap w-full gap-0">
                    <div className="w-full max-w-[100%] md:max-w-[50%] lg:max-w-[25%]">
                      <p className="font-title typo-h4 font-medium mb-2">Platform</p>
                      <ul className="list-none p-0 leading-8">
                        <li>
                          <Link to="/platform-cloud/getting-started/quickstart-demo/add-pipelines">
                            Add pipelines
                          </Link>
                        </li>
                        <li>
                          <Link to="/platform-cloud/getting-started/quickstart-demo/monitor-runs">
                            Monitor runs
                          </Link>
                        </li>
                        <li>
                          <Link to="/platform-cloud/getting-started/quickstart-demo/automation">
                            Automation
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="w-full max-w-[100%] md:max-w-[50%] lg:max-w-[25%]">
                      <p className="font-title typo-h4 font-medium mb-2">Studios</p>
                      <ul className="list-none p-0 leading-8">
                        <li>
                          <Link to="/platform-cloud/studios/overview">
                            Studios overview
                          </Link>
                        </li>
                        <li>
                          <Link to="/platform-enterprise/latest/enterprise/studios">
                            Enterprise deployment
                          </Link>
                        </li>
                        <li>
                          <Link to="/platform-cloud/data/data-explorer">
                            Data Explorer
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="w-full max-w-[100%] md:max-w-[50%] lg:max-w-[25%]">
                      <p className="font-title typo-h4 font-medium mb-2">
                        Developer tools
                      </p>
                      <ul className="list-none p-0 leading-8">
                        <li>
                          <Link to="/platform-cloud/api/overview">
                            Platform API
                          </Link>
                        </li>
                        <li>
                          <Link to="/platform-cloud/cli/overview">
                            Platform CLI
                          </Link>
                        </li>
                        <li>
                          <Link to="https://nextflow.io/docs/latest/cli.html">
                            Nextflow CLI
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="w-full max-w-[100%] md:max-w-[50%] lg:max-w-[25%]">
                      <p className="font-title typo-h4 font-medium mb-2">MultiQC</p>
                      <ul className="list-none p-0 leading-8">
                        <li>
                          <Link to="/multiqc/getting_started/quick_start">
                            Get started
                          </Link>
                        </li>
                        <li>
                          <Link to="/multiqc/getting_started/running_multiqc">
                            Run MultiQC
                          </Link>
                        </li>
                        <li>
                          <Link to="/multiqc/modules">Modules</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row w-full">
                      <p className="font-title typo-h4 font-medium mb-3">
                        Open source
                      </p>
                    </div>
                    <div className="flex flex-row flex-wrap w-full gap-4">
                      <Link
                        to="https://nextflow.io/docs/latest/index.html"
                        className="flex-col items-start w-full max-w-[100%] md:max-w-[30%] border border-gray-300 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand dark:hover:border-brand-800"
                      >
                        <img
                          src="/img/nextflow-icon.svg"
                          alt="Nextflow"
                          className="mb-3"
                        />
                        <p className="m-0 text-brand dark:text-white text-lg">
                          Nextflow
                        </p>
                      </Link>
                      <Link
                        to="/wave"
                        className="flex-col items-start w-full max-w-[100%] md:max-w-[30%] border border-gray-300 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand dark:hover:border-brand-800"
                      >
                        <img
                          src="/img/wave-icon.svg"
                          alt="Wave"
                          className="mb-3"
                        />
                        <p className="m-0 text-brand dark:text-white text-lg">
                          Wave
                        </p>
                      </Link>
                      <Link
                        to="/multiqc"
                        className="flex-col items-start w-full max-w-[100%] md:max-w-[30%] border border-gray-300 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand dark:hover:border-brand-800"
                      >
                        <img
                          src="/img/multiqc-icon.svg"
                          alt="MultiQC"
                          className="mb-3"
                        />
                        <p className="m-0 text-brand dark:text-white text-lg">
                          MultiQC
                        </p>
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row w-full">
                      <p className="font-title typo-h4 font-medium mb-3">Platform</p>
                    </div>
                    <div className="flex flex-row flex-wrap w-full gap-4">
                      <Link
                        to="/platform-cloud"
                        className="flex-col items-start w-full max-w-[100%] md:max-w-[30%] border border-gray-300 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand dark:hover:border-brand-800"
                      >
                        <div className="w-6 h-6 mb-3 bg-[url('/img/cloud.svg')] dark:bg-[url('/img/cloud-white.svg')] bg-contain bg-no-repeat bg-center"></div>
                        <p className="m-0 text-brand dark:text-white text-lg">
                          Seqera Cloud
                        </p>
                      </Link>
                      <Link
                        to="/platform-enterprise"
                        className="flex-col items-start w-full max-w-[100%] md:max-w-[30%] border border-gray-300 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand dark:hover:border-brand-800"
                      >
                        <div className="w-6 h-6 mb-3 bg-[url('/img/enterprise.svg')] dark:bg-[url('/img/enterprise-white.svg')] bg-contain bg-no-repeat bg-center"></div>
                        <p className="m-0 text-brand dark:text-white text-lg">
                          Seqera Enterprise
                        </p>
                      </Link>
                      <Link
                        to="/fusion"
                        className="flex-col items-start w-full max-w-[100%] md:max-w-[30%] border border-gray-300 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand dark:hover:border-brand-800"
                      >
                        <img
                          src="/img/fusion-icon.svg"
                          alt="Fusion"
                          className="mb-3"
                        />
                        <p className="m-0 text-brand dark:text-white text-lg">
                          Fusion
                        </p>
                      </Link>
                    </div>
                  </div>
                  <div className="flex flex-col w-full">
                    <div className="flex flex-row w-full">
                      <p className="font-title typo-h4 font-medium mb-3">Cloud</p>
                    </div>
                    <div className="flex flex-row flex-wrap w-full gap-4">
                      <Link
                        to="/platform-cloud/compute-envs/aws-batch"
                        className="flex-col items-start w-full max-w-[100%] md:max-w-[30%] border border-gray-300 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand dark:hover:border-brand-800"
                      >
                        <div className="w-6 h-6 mb-3 bg-[url('/img/aws.svg')] dark:bg-[url('/img/aws-white.svg')] bg-contain bg-no-repeat bg-center"></div>
                        <p className="m-0 text-brand dark:text-white text-lg">
                          AWS
                        </p>
                      </Link>
                      <Link
                        to="/platform-cloud/compute-envs/google-cloud-batch"
                        className="flex-col items-start w-full max-w-[100%] md:max-w-[30%] border border-gray-300 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand dark:hover:border-brand-800"
                      >
                        <div className="w-6 h-6 mb-3 bg-[url('/img/gcp.svg')] dark:bg-[url('/img/gcp-white.svg')] bg-contain bg-no-repeat bg-center"></div>
                        <p className="m-0 text-brand dark:text-white text-lg">
                          GCP
                        </p>
                      </Link>
                      <Link
                        to="/platform-cloud/compute-envs/azure-batch"
                        className="flex-col items-start w-full max-w-[100%] md:max-w-[30%] border border-gray-300 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand dark:hover:border-brand-800"
                      >
                        <div className="w-6 h-6 mb-3 bg-[url('/img/azure.svg')] dark:bg-[url('/img/azure-white.svg')] bg-contain bg-no-repeat bg-center"></div>
                        <p className="m-0 text-brand dark:text-white text-lg">
                          Azure
                        </p>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full mt-10 mb-4">
                  <div className="flex flex-row w-full">
                    <p className="font-title typo-h4 font-medium mb-3">Help</p>
                  </div>
                  <div className="flex flex-row flex-wrap w-full gap-4">
                    <Link
                      to="https://support.seqera.io"
                      className="flex-col items-start w-full max-w-[100%] md:max-w-[30%] border border-gray-300 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand dark:hover:border-brand-800"
                    >
                      <div className="w-6 h-6 mb-3 bg-[url('/img/help.svg')] dark:bg-[url('/img/help-white.svg')] bg-contain bg-no-repeat bg-center"></div>
                      <p className="m-0 text-brand dark:text-white text-lg mb-1">
                        Support Portal
                      </p>
                      <p className="m-0 text-sm text-brand-600">
                        Contact support for help with your Pro or Enterprise
                        account
                      </p>
                    </Link>
                    <Link
                      to="https://community.seqera.io"
                      className="flex-col items-start w-full max-w-[100%] md:max-w-[30%] border border-gray-300 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand dark:hover:border-brand-800"
                    >
                      <div className="w-6 h-6 mb-3 bg-[url('/img/forum.svg')] dark:bg-[url('/img/forum-white.svg')] bg-contain bg-no-repeat bg-center"></div>
                      <p className="m-0 text-brand dark:text-white text-lg mb-1">
                        Community forum
                      </p>
                      <p className="m-0 text-sm text-brand-600">
                        Discuss topics with other users
                      </p>
                    </Link>
                    <Link
                      to="https://status.seqera.io"
                      className="flex-col items-start w-full max-w-[100%] md:max-w-[30%] border border-gray-300 border-solid rounded-lg p-6 flex ease-in-out duration-300 transition-all hover:no-underline hover:shadow-xl hover:border-brand dark:hover:border-brand-800"
                    >
                      <div className="w-6 h-6 mb-3 bg-[url('/img/status.svg')] dark:bg-[url('/img/status-white.svg')] bg-contain bg-no-repeat bg-center"></div>
                      <p className="m-0 text-brand dark:text-white text-lg mb-1">
                        Service status
                      </p>
                      <p className="m-0 text-sm text-brand-600">
                        Check the status of Seqera services
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
