---
title: "Monitoring cloud costs"
description: Guidelines for monitoring Seqera Platform cloud expenditure.
date created: "2023-04-12"
last updated: "2025-08-01"
tags: [aws, gcp, azure, cloud costs, cost, billing, alerts]
---

Monitor cloud costs to manage resources effectively and prevent unexpected expenses when running pipelines in Seqera Platform.

## Resource labels

Use [Resource labels](../resource-labels/overview) in your compute environments to annotate and track the actual cloud resources consumed by a pipeline run. Resource labels are applied to the resources spawned during a run and sent to your cloud provider in `key=value` format.

For full cost accounting — including storage and networking — combine resource labels with your cloud provider's native cost tools rather than custom wrapper scripts that dedicate whole instances to single jobs. See [Include Seqera resource labels in AWS billing reports](../resource-labels/overview#include-seqera-resource-labels-in-aws-billing-reports).

## Seqera cost estimate

The [run details](../monitoring/run-details) page includes an **Estimated cost** display on the **Metrics** tab. This is the total estimated compute cost of all tasks in the pipeline run. Per-task cost — along with the machine type, price model, and requested CPU and memory used to derive it — is shown in each task's **Metrics** details.

The Seqera cost estimator should only be used for at-a-glance heuristic purposes. For accounting and legal cost reporting, use resource labels and leverage your compute platform's native cost reporting tools.

:::tip
Per-task metrics, including estimated cost, are also available programmatically through the Platform API for building custom cost dashboards across runs. See the [describe workflow task](https://docs.seqera.io/platform-api/describe-workflow-task) and [list workflow tasks](https://docs.seqera.io/platform-api/list-workflow-tasks) API endpoints.
:::

The compute cost of a task is computed as follows:

$$
\text{Task cost} = \text{VM hourly rate} \times \text{VM fraction} \times \text{Task runtime}
$$

$$
\quad \text{VM fraction} = \text{max} ( \frac{\text{Task CPUs}}{\text{VM CPUs}}, \frac{\text{Task memory}}{\text{VM memory}} )
$$

$$
\quad \text{Task runtime} = ( \text{Task complete} - \text{Task start} )
$$

See also: **cost**, **start**, **complete**, **cpus**, and **memory** in the task table.

Seqera uses a database of prices for AWS, Azure, and Google Cloud, across all instance types, regions, and zones, to fetch the VM price for each task. This database is updated periodically to reflect the most recent prices.

:::note
Prior to version 22.4.x, the cost estimate used `realtime` instead of `complete` and `start` to measure the task runtime. The `realtime` metric tends to underestimate the billable runtime because it doesn't include the time required to stage input and output files.
:::

The estimated cost is subject to several limitations:

- It doesn't account for the cost of storage, network, the head job, or how tasks are mapped to VMs. As a result, it tends to underestimate the true cost of a pipeline run.

- On a resumed pipeline run, the cost of cached tasks is included in the estimated cost. This estimate is an aggregation of all compute costs associated with the run. As a result, the total cost of multiple attempts of a pipeline run tends to overestimate the actual cost, because the cost of cached tasks may be counted multiple times.

For accurate cost accounting, you should use the cost reporting tools for your cloud provider.

## Cloud provider cost monitoring and alerts

AWS, Google Cloud, and Microsoft Azure provide cost alerting and budgeting tools to enable effective cloud resource management and prevent unexpected costs.


### AWS

- **Budgets**: [AWS Budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html) lets you set custom cost and usage budgets with alerts when costs or usage exceed pre-defined thresholds. Set up notifications via email or SNS (Simple Notification Service) to receive alerts when budget thresholds are reached.

- **Cost Explorer**: [AWS Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html) provides cost management tools to visualize, understand, and manage your AWS costs and usage over time.

- **Cost Anomaly Detection**: [AWS Cost Anomaly Detection](https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html) uses machine learning models to detect and alert on anomalous spend patterns in your deployed AWS services.

### Google Cloud

- **Budgets and budget alerts**: [Budgets](https://cloud.google.com/billing/docs/how-to/budgets) allow you to set budget thresholds for your GCP projects. When costs exceed these thresholds, you can receive alerts via email, SMS, or notifications in the Google Cloud Console.

- **Cost management tools**: [Cloud Billing](https://cloud.google.com/billing/docs/onboarding-checklist) provides cost management tools such as billing reports and spend visualization to help you analyze and understand your GCP costs.

### Microsoft Azure

- **Cost Management**: [Microsoft Cost Management](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/overview-cost-management) is a suite of FinOps tools that help organizations analyze, monitor, and optimize their Microsoft Cloud costs.

- **Cost alerts**: Create [alerts](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/overview-cost-management#monitor-costs-with-alerts) for usage anomalies and costs that exceed pre-defined thresholds.
