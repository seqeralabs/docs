---
title: "Kubernetes"
description: "Instructions to set up Kubernetes in Nextflow Tower"
date: "21 Apr 2023"
tags: [k8s, kubernetes, compute environment]
---

[Kubernetes](https://kubernetes.io/) is the leading technology for the deployment and orchestration of containerized workloads in cloud-native environments.

Tower streamlines the deployment of Nextflow pipelines into Kubernetes, both for cloud-based and on-prem clusters.

The following instructions create a Tower compute environment for a **generic Kubernetes** distribution. See [Amazon EKS](./eks) or [Google Kubernetes Engine (GKE)](./gke) for EKS and GKE compute environment instructions.

## Cluster preparation

To prepare your Kubernetes cluster for the deployment of Nextflow pipelines using Tower, this guide assumes that you have already created the cluster and that you have administrative privileges.

1. Verify the connection to your Kubernetes cluster:

   ```bash
   kubectl cluster-info
   ```

2. Create the Tower launcher:

   ```bash
   kubectl apply -f https://help.tower.nf/latest/_templates/k8s/tower-launcher.yml
   ```

   This command creates a service account called `tower-launcher-sa` and the associated role bindings, all contained in a namespace called `tower-nf`. Tower uses the service account to launch Nextflow pipelines. Use this service account name when setting up the compute environment for this Kubernetes cluster in Tower.

3. Create persistent storage. Tower requires a `ReadWriteMany` persistent volume claim (PVC) mounted to all nodes where workflow pods will be dispatched.

   You can use any storage solution that supports the `ReadWriteMany` [access mode](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes). The setup of this storage is beyond the scope of these instructions — the right solution for you will depend on what is available for your infrastructure or cloud vendor (NFS, GlusterFS, CephFS, Amazon FSx). Ask your cluster administrator for more information.

   - Example PVC backed by local storage: [tower-scratch-local.yml](../_templates/k8s/tower-scratch-local.yml)

   - Example PVC backed by NFS server: [tower-scratch-nfs.yml](../_templates/k8s/tower-scratch-nfs.yml)

   Apply the appropriate PVC configuration to your cluster:

   ```bash
   kubectl apply -f <PVC_YAML_FILE>.
   ```

## Compute environment

1. In a workspace, select **Compute environments** and then **New environment**.

2. Enter a descriptive name for this environment, e.g., "K8s cluster".

3. Select **Kubernetes** as the target platform.

4. From the **Credentials** drop-down, select existing Kubernetes credentials, or select **+** to add new credentials. If you have existing credentials, skip to step 7.

5. Enter a name, e.g., "K8s Credentials".

6. Enter the **Service account token**.

   Obtain the token with the following command:

   ```bash
   SECRET=$(kubectl get secrets | grep <SERVICE-ACCOUNT-NAME> | cut -f1 -d ' ')
   kubectl describe secret $SECRET | grep -E '^token' | cut -f2 -d':' | tr -d '\t'
   ```

   Replace `<SERVICE-ACCOUNT-NAME>` with the name of the service account created in the [cluster preparation](#cluster-preparation) instructions (default: `tower-launcher-sa`).

7. Enter the **Control plane URL**.

   Obtain the control plane URL with the following command:

   ```bash
   kubectl cluster-info
   ```

   It can also be found in your `~/.kube/config` file under the `server` field corresponding to your cluster.

8. Specify the **SSL certificate** to authenticate your connection.

   Find the certificate data in your `~/.kube/config` file. It is the `certificate-authority-data` field corresponding to your cluster.

9. Specify the **Namespace** created in the [cluster preparation](#cluster-preparation) instructions, which is `tower-nf` by default.

10. Specify the **Head service account** created in the [cluster preparation](#cluster-preparation) instructions, which is `tower-launcher-sa` by default.

11. Specify the **Storage claim** created in the [cluster preparation](#cluster-preparation) instructions, which serves as a scratch filesystem for Nextflow pipelines. The storage claim is called `tower-scratch` in each of the provided examples.

12. Apply [**Resource labels**](../resource-labels/overview) to the cloud resources consumed by this compute environment. Workspace default resource labels are prefilled.

13. Expand **Staging options** to include optional pre- or post-run Bash scripts that execute before or after the Nextflow pipeline execution in your environment.

14. You can use the **Environment variables** option to specify custom environment variables for the Head job and/or Compute jobs.

15. Configure any advanced options described below, as needed.

16. Select **Create** to finalize the compute environment setup.

Jump to the documentation for [launching pipelines](../launch/launchpad).

### Advanced options

- The **Storage mount path** is the file system path where the Storage claim is mounted (default: `/scratch`).

- The **Work directory** is the file system path used as a working directory by Nextflow pipelines. It must be the storage mount path (default) or a subdirectory of it.

- The **Compute service account** is the service account used by Nextflow to submit tasks (default: the `default` account in the given namespace).

- The **Pod cleanup policy** determines when to delete terminated pods.

- You can use **Custom head pod specs** to provide custom options for the Nextflow workflow pod (`nodeSelector`, `affinity`, etc). For example:

  ```yaml
  spec:
    nodeSelector:
      disktype: ssd
  ```

- You can use **Custom service pod specs** to provide custom options for the compute environment pod. See above for an example.

- You can use **Head Job CPUs** and **Head Job memory** to specify the hardware resources allocated to the Nextflow workflow pod.

<!-- sync with DevOps about recent Ingress changes and implication for cluster prep and what we expect-->
