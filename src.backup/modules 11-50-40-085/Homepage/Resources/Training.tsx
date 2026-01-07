import React from "react";
import Link from "@docusaurus/Link";

type Props = {};

const Training: React.FC<Props> = () => {
  return (
    <ul className="checklist">
      <li>
        The Seqera complete{" "}
        <Link to="https://training.nextflow.io">training material</Link> and
        workshop for learning Nextflow and Tower
      </li>
      <li>
        The{" "}
        <Link to="https://nf-co.re/docs/usage/tutorials/nf_core_usage_tutorial">
          nf-core
        </Link>{" "}
        tutorial — a guide for getting started with developing Nextflow
        pipelines using the nf-core framework.
      </li>
      <li>
        A Software Carpentries{" "}
        <Link to="https://carpentries-incubator.github.io/workflows-nextflow/">
          guide to Nextflow and nf-core under incubation
        </Link>
      </li>
      <li>
        An{" "}
        <Link to="https://uppsala.instructure.com/courses/51980/pages/nextflow-1-introduction?module_item_id=328997">
          introduction to Nextflow course
        </Link>{" "}
        from Uppsala University
      </li>
    </ul>
  );
};

export default Training;
