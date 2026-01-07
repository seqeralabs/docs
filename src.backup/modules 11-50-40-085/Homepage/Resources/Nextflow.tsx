import React from "react";
import Link from "@docusaurus/Link";

type Props = {};

const Nextflow: React.FC<Props> = () => {
  return (
    <>
      <h3 className="mb-6">Nextflow resources</h3>
      <ul className="checklist">
        <li>
          Nextflow user documentation for the latest{" "}
          <Link to="https://www.nextflow.io/docs/latest/">stable</Link> and{" "}
          <Link to="https://www.nextflow.io/docs/edge/">edge</Link> releases.
        </li>
        <li>
          Common{" "}
          <Link to="https://nextflow-io.github.io/patterns/index.html">
            usage patterns
          </Link>{" "}
          for writing Nextflow pipelines.
        </li>
        <li>
          Extension packages (X-PACK) for using Nextflow on{" "}
          <Link to="https://github.com/seqeralabs/xpack-amzn">
            Amazon Web Services
          </Link>
          , and{" "}
          <Link to="https://github.com/seqeralabs/xpack-google">
            Google Cloud
          </Link>
          .
        </li>
        <li>
          <Link to="https://github.com/nextflow-io/awesome-nextflow">
            Awesome Nextflow
          </Link>{" "}
          – a curated list of Nextflow pipelines.
        </li>
        <li>
          <Link to="https://nf-co.re/">nf-core</Link> – a community effort to
          collect a curated set of analysis pipelines built using Nextflow.
        </li>
        <li>
          A best-practices resource for executing{" "}
          <Link to="https://github.com/seqeralabs/nf-k8s-best-practices">
            Nextflow workflows on Kubernetes
          </Link>
          .
        </li>
      </ul>
    </>
  );
};

export default Nextflow;
