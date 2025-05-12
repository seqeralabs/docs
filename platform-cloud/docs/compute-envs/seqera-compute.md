---
title: "Seqera Compute"
description: "Instructions to set up Seqera Compute in Seqera Platform"
date: "21 Apr 2025"
tags: [seqera compute, compute environment]
---

Seqera Compute enables you to run pipelines and Studio sessions in Seqera Cloud in a fully managed and optimized AWS environment. Seqera automatically provisions and manages all the underlying resources, including AWS accounts, credentials, roles, compute environments, and S3 storage buckets, requiring minimal user configuration. Using prepaid credits enables control and visibility of the compute spend in each of your organization's workspaces.

### Manage Seqera Compute credits 

Seqera Compute environments consume credits when running pipelines or Studio sessions. Credits are consumed for CPU time, memory and storage usage, and network costs. One Seqera Compute credit is equivalent to $1 (USD), and resources are charged at the following rates:
- CPU time: 1 CPU/Hr = 0.1 credits
- Memory: 1 GiB/Hr = 0.025 credits 
- Storage: 1 GB = 0.25 credits per month 

:::note 
Storage and network costs vary per region, charged at standard AWS rates. Data ingress and egress across regions incur additional costs. 
:::

View your Seqera Compute credit balance and spend under both the organization and workspace **Settings** tabs. Workspace settings show the credits spent in that workspace, whereas organization settings show the total credits spent in all workspaces within that organization. 

Select **Contact us to upgrade** to request additional credits for your organization. 

### Default limits

Seqera Compute has default workspace limits on compute environments, and organization limits on data storage and CPU cores. 

|                                    | **Basic**                        | **Pro**                            |
|------------------------------------|----------------------------------|------------------------------------|
| Cloud storage                      | 25 GB                            | Unlimited                          |
| Compute environments per workspace | 5                                | 20                                 |
| Total CPU cores                    | 100                              | 1000                               |

:::info
[Contact us](https://seqera.io/contact-us/) to discuss custom limits for Pro, academic, or evaluation licenses. 
:::

### Create a Seqera Compute environment 

1. In a workspace with Seqera Compute enabled, select **Compute environments > New environment**.
1. Enter a descriptive name for this environment, such as _Seqera Compute 1 (eu-west-1)_.
1. Under **Platform**, select **Seqera Compute**. 
1. Select a target execution **Region**. 
    :::info
    Seqera Compute is available in the following AWS regions: 
    **United States**:
      - us-east-1 (Northern Virginia, USA)
      - us-west-2 (Oregon, USA)
      - us-east-2 (Ohio, USA)
      - us-west-1 (Northern California, USA)
    **Europe**:
      - eu-west-1 (Ireland)
      - eu-west-2 (London, UK)
      - eu-central-1 (Frankfurt, Germany)
      - eu-west-3 (Paris, France)
    **APAC**:
      - ap-southeast-1 (Singapore)
    :::
1. Configure any advanced options described in the next section, as needed.
1. Select **Add** to complete the Seqera Compute environment configuration and return to the compute environments list. It will take a few seconds for the compute environment resources to be created before you are ready to launch pipelines or add studios. 

:::info 
See [Launch pipelines](../launch/launchpad.mdx) to start executing workflows in your Seqera Compute environment.
:::

#### Advanced options (optional)

1. Enter a relative **Pipeline work directory** path to be appended to the S3 storage bucket Seqera creates for this compute environment. 
1. Enter [pre- or post-run Bash scripts](../launch/advanced.mdx#pre--post-run-scripts) that execute before or after the Nextflow pipeline execution in your environment.
1. Enter Global Nextflow configuration settings for all pipeline runs launched with this environment. Values defined here are pre-filled in the **Nextflow config file** field in the pipeline launch form. These values can be overridden at pipeline launch. 
    :::info
    Configuration settings in this field override the same values in the pipeline repository `nextflow.config` file. See [Nextflow config file](../launch/advanced.mdx#nextflow-config-file) for more information on configuration priority. 
    :::
1. Specify custom **Environment variables** for the **Head job** and/or **Compute jobs**.
