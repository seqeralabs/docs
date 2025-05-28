---
title: Google Kubernetes Engine
description: "Use Fusion with Google Kubernetes Engine and Google Cloud Storage"
date: "23 Aug 2024"
tags: [fusion, storage, compute, gke, gcs, google cloud, kubernetes]
---

Fusion streamlines the deployment of Nextflow pipelines in Kubernetes because it replaces the need to configure
and maintain a shared file system in your cluster.

### Platform Google Kubernetes Engine compute environments

Seqera Platform supports Fusion in Google Kubernetes Engine (GKE) compute environments.

See [Google Kubernetes Engine](https://docs.seqera.io/platform-cloud/compute-envs/gke) for Platform instructions to enable Fusion.

### Nextflow CLI

:::note
This feature requires Nextflow 23.02.1-edge or later.
:::

To use Fusion directly in Nextflow with a GKE cluster, you must configure a cluster, namespace, and service account, and update your Nextflow configuration.

#### Kubernetes configuration

1. Create a GKE "standard" cluster ("Autopilot" is not supported). See [Creating a zonal cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-zonal-cluster) for more information.
1. Use instance types with 2 or more CPUs and SSD storage (families: `n1`, `n2`, `c2`, `m1`, `m2`, `m3`).
1. Enable the [Workload identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity) feature when creating (or updating) the cluster:
   - **Enable Workload Identity** in the cluster **Security** settings.
   - **Enable GKE Metadata Server** in the node group **Security** settings.
1. See [Authenticate to Google Cloud APIs from GKE workloads](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#kubectl) to configure the cluster.
1. Replace the following example values with values corresponding to your environment:
   - `CLUSTER_NAME`: the GKE cluster name — `cluster-1`
   - `COMPUTE_REGION`: the GKE cluster region — `europe-west1`
   - `NAMESPACE`: the GKE namespace — `fusion-demo`
   - `KSA_NAME`: the GKE service account name — `fusion-sa`
   - `GSA_NAME`: the Google service account — `gsa-demo`
   - `GSA_PROJECT`: the Google project id — `my-nf-project-261815`
   - `PROJECT_ID`: the Google project id — `my-nf-project-261815`
   - `ROLE_NAME`: the role to grant access permissions to the Google Storage bucket — `roles/storage.admin`
1. Create the K8s _role_ and _rolebinding_ required to run Nextflow by applying the following Kubernetes config:

   ```yaml
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: Role
   metadata:
     namespace: fusion-demo
     name: fusion-role
   rules:
     - apiGroups: [""]
       resources: ["pods", "pods/status", "pods/log", "pods/exec"]
       verbs: ["get", "list", "watch", "create", "delete"]
   ---
   apiVersion: rbac.authorization.k8s.io/v1
   kind: RoleBinding
   metadata:
     namespace: fusion-demo
     name: fusion-rolebind
   roleRef:
     apiGroup: rbac.authorization.k8s.io
     kind: Role
     name: fusion-role
   subjects:
     - kind: ServiceAccount
       name: fusion-sa
   ---
   apiVersion: v1
   kind: Secret
   metadata:
     namespace: fusion-demo
     name: fusion-sa-token
     annotations:
       kubernetes.io/service-account.name: fusion-sa
   type: kubernetes.io/service-account-token
   ```

#### Nextflow configuration

1. Add the following to your `nextflow.config` file:

   ```
   process.executor = 'k8s'
   process.scratch = false
   wave.enabled = true
   fusion.enabled = true
   tower.accessToken = '<PLATFORM_ACCESS_TOKEN>'
   k8s.context = '<GKE_CLUSTER_CONTEXT>'
   k8s.namespace = 'fusion-demo'
   k8s.serviceAccount = 'fusion-sa'
   k8s.pod.nodeSelector = 'iam.gke.io/gke-metadata-server-enabled=true'
   ```

   Replace the following:

   - `<PLATFORM_ACCESS_TOKEN>`: your Platform access token.
   - `<GKE_CLUSTER_CONTEXT>`: your Kubernetes configuration context name.

1. Run the pipeline with the Nextflow run command:

   ```
   nextflow run <PIPELINE_SCRIPT> -w gs://<GCS_BUCKET>/work
   ```

   Replace the following:

   - `<PIPELINE_SCRIPT>`: your pipeline Git repository URI.
   - `<GCS_BUCKET>`: your Google Cloud Storage bucket.

:::note
When using Fusion, pods will run as privileged by default.
:::

To use Fusion without the need for escalating privileges, install the Nextflow [FUSE device plugin](https://github.com/nextflow-io/k8s-fuse-plugin) on your Kubernetes cluster and add set `fusion.privileged` to `false` in your `nextflow.config` file:

```
fusion.privileged = false
```

To use a custom FUSE device plugin, specify it via the `k8s.fuseDevicePlugin` configuration option. See [Kubernetes](https://www.nextflow.io/docs/latest/reference/config.html#k8s) configuration options for details.
