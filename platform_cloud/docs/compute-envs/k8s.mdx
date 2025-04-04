---
title: "Kubernetes"
description: "Instructions to set up Kubernetes in Seqera Platform"
date: "21 Apr 2023"
tags: [k8s, kubernetes, compute environment]
---

[Kubernetes](https://kubernetes.io/) is the leading technology for the deployment and orchestration of containerized workloads in cloud-native environments.

Seqera Platform streamlines the deployment of Nextflow pipelines into Kubernetes, both for cloud-based and on-prem clusters.

The following instructions create a Seqera compute environment for a **generic Kubernetes** distribution. See [Amazon EKS](./eks.mdx) or [Google Kubernetes Engine (GKE)](./gke.mdx) for EKS and GKE compute environment instructions.

## Cluster preparation

To prepare your Kubernetes cluster for the deployment of Nextflow pipelines using Seqera, this guide assumes that you've already created the cluster and that you have administrative privileges.

This guide applies a Kubernetes manifest that creates a service account named `tower-launcher-sa` and the associated role bindings, all contained in the `tower-nf` namespace. Seqera uses the service account to launch Nextflow pipelines. Use this service account name when setting up the compute environment for this Kubernetes cluster in Seqera.

**Prepare your Kubernetes cluster for Seqera Platform**

1. Verify the connection to your Kubernetes cluster:

   ```bash
   kubectl cluster-info
   ```

1. Create a file named `tower-launcher.yml` with the following YAML:

    ```yaml file=../_templates/k8s/tower-launcher.yml showLineNumbers
    ```

1. Apply the manifest:

    ```bash
    kubectl apply -f tower-launcher.yml
    ```

1. Create a persistent API token for the `tower-launcher-sa` service account:

    ```bash
    kubectl apply -f - <<EOF
    apiVersion: v1
    kind: Secret
    metadata:
      name: tower-launcher-token
      annotations:
        kubernetes.io/service-account.name: tower-launcher-sa
    type: kubernetes.io/service-account-token
    EOF
    ```

1. Confirm that Kubernetes created the persistent API token secret:

    ```bash
    kubectl describe secrets/tower-launcher-token
    ```

1. Create persistent storage. Seqera requires a `ReadWriteMany` persistent volume claim (PVC) mounted to all nodes where workflow pods will be dispatched.

   You can use any storage solution that supports the `ReadWriteMany` [access mode](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes). The setup of this storage is beyond the scope of these instructions — the right solution for you will depend on what is available for your infrastructure or cloud vendor (NFS, GlusterFS, CephFS, Amazon FSx). Ask your cluster administrator for more information.

   - Example PVC backed by local storage: [tower-scratch-local.yml](../_templates/k8s/tower-scratch-local.yml)

   - Example PVC backed by NFS server: [tower-scratch-nfs.yml](../_templates/k8s/tower-scratch-nfs.yml)

1. Apply the appropriate PVC configuration to your cluster:

   ```bash
   kubectl apply -f <PVC_YAML_FILE>
   ```

## Seqera compute environment

After you've prepared your Kubernetes cluster for Seqera integration, create a compute environment:

**Create a Seqera Kubernetes compute environment**

1. In a workspace, select **Compute environments > New environment**.
1. Enter a descriptive name for this environment, e.g., _K8s cluster_.
1. Select **Kubernetes** as the target platform.
1. From the **Credentials** drop-down, select existing Kubernetes credentials, or select **+** to add new credentials. If you choose to use existing credentials, skip to step 7.

    :::tip
    You can create multiple credentials in your Seqera workspace. See [Credentials](../credentials/overview.mdx).
    :::

1. Enter a name, such as _K8s Credentials_.
1. Select either the **Service Account Token** or **X509 Client Certs** tab:

    - To authenticate using a Kubernetes service account, enter your **Service account token**. Obtain the token with the following command:

        ```bash
        kubectl describe secret <SERVICE-ACCOUNT-TOKEN-NAME> | grep -E '^token' | cut -f2 -d':' | tr -d '\t '
        ```

        Replace `<SERVICE-ACCOUNT-TOKEN-NAME>` with the name of the service account token created in the [cluster preparation](#cluster-preparation) instructions (default: `tower-launcher-token`).

    - To authenticate using an X509 client certificate, paste the contents of your certificate and key file (including the `-----BEGIN...-----` and `-----END...-----` lines) in the **Client certificate** and **Client Key** fields respectively. See the [Kubernetes documentation](https://kubernetes.io/docs/tasks/administer-cluster/certificates/) for instructions to generate your client certificate and key.

1. Enter the **Control plane URL**, obtained with this command:

    ```bash
    kubectl cluster-info
    ```

    It can also be found in your `~/.kube/config` file under the `server` field corresponding to your cluster.

1. Specify the **SSL certificate** to authenticate your connection.

    Find the certificate data in your `~/.kube/config` file. It is the `certificate-authority-data` field corresponding to your cluster.

1. Specify the **Namespace** created in the [cluster preparation](#cluster-preparation) instructions, which is _tower-nf_ by default.
1. Specify the **Head service account** created in the [cluster preparation](#cluster-preparation) instructions, which is _tower-launcher-sa_ by default.
1. Specify the **Storage claim** created in the [cluster preparation](#cluster-preparation) instructions, which serves as a scratch filesystem for Nextflow pipelines. The storage claim is called _tower-scratch_ in each of the provided examples.
1. Apply [**Resource labels**](../resource-labels/overview.mdx) to the cloud resources consumed by this compute environment. Workspace default resource labels are prefilled.
1. Expand **Staging options** to include:
    - Optional [pre- or post-run Bash scripts](../launch/advanced.mdx#pre-and-post-run-scripts) that execute before or after the Nextflow pipeline execution in your environment.
    - Global Nextflow configuration settings for all pipeline runs launched with this compute environment. Values defined here are pre-filled in the **Nextflow config file** field in the pipeline launch form. These values can be overridden during pipeline launch. 
    :::info
    Configuration settings in this field override the same values in the pipeline repository `nextflow.config` file. See [Nextflow config file](../launch/advanced.mdx#nextflow-config-file) for more information on configuration priority. 
    :::
1. You can use the **Environment variables** option to specify custom environment variables for the Head job and/or Compute jobs.
1. Configure any advanced options described below, as needed.
1. Select **Create** to finalize the compute environment setup.

See [Launch pipelines](../launch/launchpad.mdx) to start executing workflows in your Kubernetes compute environment.

### Advanced options

Seqera Platform compute environments for Kubernetes include advanced options for storage and work directory paths, resource allocation, and pod customization.

**Seqera Kubernetes advanced options**

- The **Storage mount path** is the file system path where the Storage claim is mounted (default: `/scratch`).
- The **Work directory** is the file system path used as a working directory by Nextflow pipelines. It must be the storage mount path (default) or a subdirectory of it.
- The **Compute service account** is the service account used by Nextflow to submit tasks (default: the `default` account in the given namespace).
- The **Pod cleanup policy** determines when to delete terminated pods.
- Use **Custom head pod specs** to provide custom options for the Nextflow workflow pod (`nodeSelector`, `affinity`, etc). For example:

```yaml
spec:
   nodeSelector:
      disktype: ssd
```

- Use **Custom service pod specs** to provide custom options for the compute environment pod. See above for an example.
- Use **Head Job CPUs** and **Head Job memory** to specify the hardware resources allocated to the Nextflow workflow pod.

