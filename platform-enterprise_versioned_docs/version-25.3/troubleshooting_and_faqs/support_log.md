---
title: "Generate log files"
description: "Generate log files for Seqera Support."
date created: "2026-02-02"
tags: [faq, help, troubleshooting, log-files, support]
---

If you can't solve the issue you're experiencing, you can create a Support ticket. To help the Seqera Support team resolve issues effectively, it’s essential to share relevant log files with your ticket submission. Add these logs as attachments to your ticket.

The types of logs we may request include:

- Workflow/run logs
- Nextflow logs
- Fusion logs
- Seqera Platform logs
- Backend logs
- Cron logs
- Frontend logs
- Groundswell logs
- Redis logs

## Nextflow and Fusion logs

Nextflow logs and Fusion logs can be retrieved directly from your Seqera instance:

- Log in and select **Runs**.
- Select the workflow you want to share.
- In the **Execution log** section, select **Download log files** and choose **Nextflow log file**.

You can also download the **Nextflow console output** for a complete view of the standard output.

## Seqera Platform logs

Seqera Platform logs are located on your deployment instance. The steps to retrieve these logs vary depending on your deployment type.

### Docker Compose deployments

Log in to your instance where the containers are running and identify the target container:

```
docker ps
```

Note the container ID or name (e.g., `ba54613516f` or `Seqera_platform_backend_1`).

**To get full logs from the beginning:**

```
docker logs Seqera_platform_backend_1 > /tmp/backend.log
```

**To get logs for a specific date:**

```
docker logs Seqera_platform_backend_1 | grep Sep-07 > /tmp/backend.log
```

Attach the generated `backend.log` file to your ticket.

Repeat this process for frontend, backend, and cron logs as needed. Use unique filenames (e.g., `frontend.log`, `cron.log`) to avoid overwriting existing files.

### Kubernetes-based deployments

Log into your instance where the Kubernetes pods are running and identify the target pods for log extraction:

```
kubectl get pod -n [namespace]
```

**Retrieve logs from a specific pod:**

```
kubectl logs [pod-name] -n [namespace] > /tmp/backend-pod.log
```

**To provide additional deployment context, generate the pod’s deployment details:**

```
kubectl describe [pod-name] -n [namespace] > /tmp/describe-backend-pod.log
```

Use unique filenames for logs to avoid overwriting existing files.

## Troubleshooting

In some cases, you may encounter issues downloading Nextflow logs in Seqera. If this happens, logs can also be retrieved from the work directory specified in the compute environment configuration. This applies to all compute environments (AWS Batch, Azure, GCP, etc.).
