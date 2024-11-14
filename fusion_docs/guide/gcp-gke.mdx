---
title: Google GKE
description: "Use Fusion with Google GKE and Google Cloud Storage"
date: "23 Aug 2024"
tags: [fusion, storage, compute, gke, gcs, google cloud, kubernetes]
---

Fusion streamlines the deployment of Nextflow pipelines in Kubernetes because it replaces the need to configure
and maintain a shared file system in your cluster.

### Platform Google GKE compute environments 

Seqera Platform supports Fusion in Google GKE compute environments. 

See [Google GKE](https://docs.seqera.io/platform/latest/compute-envs/gke) for Platform instructions to enable Fusion.

### Nextflow CLI

:::note
This feature requires Nextflow 23.02.1-edge or later.
:::

To use Fusion directly in Nextflow with a Google GKE cluster, you must configure a cluster, namespace, and service account, and update your Nextflow configuration. 

#### Kubernetes configuration

1. Create a GKE "standard" cluster ("Autopilot" is not supported). See [Creating a zonal cluster](https://cloud.google.com/kubernetes-engine/docs/how-to/creating-a-zonal-cluster) for more information.
1. Use instance types with 2 or more CPUs and SSD storage (families: `n1`, `n2`, `c2`, `m1`, `m2`, `m3`).
1. Enable the [Workload identity](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity) feature when creating (or updating) the cluster:
    - **Enable Workload Identity** in the cluster **Security** settings.
    - **Enable GKE Metadata Server** in the node group **Security** settings.
1. See [Authenticate to Google Cloud APIs from GKE workloads](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#kubectl) to configure the cluster.
1. Replace the following example values with values corresponding your environment:
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
    ...
    ```

#### Nextflow configuration

1. Add the following to your `nextflow.conf` file:

    ```
    wave.enabled = true
    fusion.enabled = true
    process.executor = 'k8s'
    process.scratch = false
    k8s.context = '<YOUR-GKE-CLUSTER-CONTEXT>'
    k8s.namespace = 'fusion-demo'
    k8s.serviceAccount = 'fusion-sa'
    k8s.pod.nodeSelector = 'iam.gke.io/gke-metadata-server-enabled=true'
    ```

    Replace `<YOUR-GKE-CLUSTER-CONTEXT>` with the context name in your Kubernetes configuration.

1. Run the pipeline with the usual run command:

    ```
    nextflow run <YOUR PIPELINE SCRIPT> -w gs://<YOUR-BUCKET>/work
    ```

    Replace `<YOUR-BUCKET>` with a Google Cloud Storage bucket to which you have read-write access.
