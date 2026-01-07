import React from "react";
import Link from "@docusaurus/Link";

type Props = {};

const ExternalGuides: React.FC<Props> = () => {
  return (
    <>
      <h3 className="mb-6">External guides</h3>
      <ul className="checklist">
        <li>
          Overview from 23andMe introducing and describing{" "}
          <Link to="https://medium.com/23andme-engineering/introduction-to-nextflow-4d0e3b6768d1">
            why they choose Nextflow
          </Link>{" "}
          to orchestrate millions of tasks for their imputation pipelines
        </li>
        <li>
          Nextflow on AWS Batch from the{" "}
          <Link to="https://docs.opendata.aws/genomics-workflows/orchestration/nextflow/nextflow-overview.html">
            Genomics Workflows on AWS resources
          </Link>
        </li>
        <li>
          Workshop for{" "}
          <Link to="https://ec2spotworkshops.com/index.html">
            Nextflow on AWS Batch
          </Link>{" "}
          from the team at Amazon EC2 Spot
        </li>
        <li>
          <Link to="https://cloud.google.com/life-sciences/docs/tutorials/nextflow">
            Guide from Google for running
          </Link>{" "}
          Nextflow on Google Cloud using the Google Life Sciences executor
        </li>
        <li>
          Microsoft template for deploying a{" "}
          <Link to="https://azure.microsoft.com/en-us/resources/templates/nextflow-genomics-cluster-ubuntu/">
            Nextflow Genomics Cluster
          </Link>{" "}
          in Azure
        </li>
        <li>
          <Link to="https://github.com/microsoft/Genomics-Quickstart/blob/main/03-Nextflow-Azure/README.md">
            Quickstart guide{" "}
          </Link>
          from Microsoft Genomics for getting up and running with Nextflow on
          Azure
        </li>
      </ul>
    </>
  );
};

export default ExternalGuides;
