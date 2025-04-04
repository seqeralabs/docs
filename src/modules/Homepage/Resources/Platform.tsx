import React from "react";
import Link from "@docusaurus/Link";

import platform_latest_version from "@site/platform_latest_version";

type Props = {};

const Platform: React.FC<Props> = () => {
  return (
    <>
      <h3 className="mb-6">Seqera Platform resources</h3>
      <ul className="checklist">
        <li>
          The Seqera Platform{" "}
          <Link to="/platform-cloud/" className="text-indig00">
            User documentation
          </Link>{" "}
          is the reference for managing pipelines with Seqera Platform
        </li>
        <li>
          {" "}
          <Link to="https://github.com/seqeralabs/tower-cli">
            Seqera Command Line Interface
          </Link>{" "}
          brings it to the terminal
        </li>
        <li>
          Repository containing{" "}
          <Link to="https://github.com/seqeralabs/nf-tower-aws">
            AWS IAM policies
          </Link>{" "}
          to create roles with appropriate Batch Forge and launch permissions
        </li>
        <li>
          For installation and configuration, the Seqera Platform{" "}
          <Link to={`/platform/${platform_latest_version}/enterprise/`}>
            deployment guide
          </Link>{" "}
          provides docs, scripts and detailed instructions.
        </li>
        <li>
          A{" "}
          <Link to="https://seqera.io/blog/workflow-automation/">
            practical how-to
          </Link>{" "}
          guide for automating workflows - from sequencing data to results using
          Tower.
        </li>
      </ul>
    </>
  );
};

export default Platform;
