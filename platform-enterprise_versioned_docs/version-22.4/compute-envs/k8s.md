---
title: "k8s"
description: "Step-by-step instructions to set up a Nextflow Tower compute environment for a Kubernetes cluster"
---

## Overview

[Kubernetes](https://kubernetes.io/) is the leading technology for deployment and orchestration of containerized workloads in cloud-native environments.

Tower streamlines the deployment of Nextflow pipelines into Kubernetes both for cloud-based and on-prem clusters.

The following instructions are for a **generic Kubernetes** distribution. If you are using [Amazon EKS](eks) or [Google Kubernetes Engine](gke), see the corresponding documentation pages.

### Cluster Preparation

This section describes the steps required to prepare your Kubernetes cluster for the deployment of Nextflow pipelines using Tower. It is assumed the cluster itself has already been created and you have administrative privileges.

1. Verify the connection to your Kubernetes cluster:

   ```bash
   kubectl cluster-info
   ```

2. Create the Tower launcher:

   ```bash
   kubectl apply -f https://help.tower.nf/22.1/_templates/k8s/tower-launcher.yml
   ```

   This command creates a service account called `tower-launcher-sa`, and associated role bindings. Everything is contained in a namespace called `tower-nf`. The service account is used by Tower to launch Nextflow pipelines. Use this service account name when setting up the compute environment for this Kubernetes cluster in Tower.

3. Create persistent storage. Tower requires a `ReadWriteMany` persistent volume claim (PVC) that is mounted by all nodes where workflow pods will be dispatched.

   You can use any storage solution that supports the `ReadWriteMany` [access mode](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes). The setup of this storage is beyond the scope of these instructions, because the right solution for you will depend on what is available for your infrastructure or cloud vendor (NFS, GlusterFS, CephFS, Amazon FSx, etc). Ask your cluster administrator for more information.

   - Example PVC backed by local storage: [tower-scratch-local.yml](../_templates/k8s/tower-scratch-local.yml)

   - Example PVC backed by NFS server: [tower-scratch-nfs.yml](../_templates/k8s/tower-scratch-nfs.yml)

### Compute Environment

1. In a workspace, select **Compute Environments** and then **New Environment**.

2. Enter a descriptive name for this environment, e.g. "K8s cluster".

3. Select **Kubernetes** as the target platform.

4. Select your Kubernetes credentials or add new credentials by selecting the **+** button.

5. Enter a name, e.g. "K8s Credentials".

6. Enter the **Service account token**.

   The token can be obtained with the following command:

   ```bash
   SECRET=$(kubectl get secrets | grep <SERVICE-ACCOUNT-NAME> | cut -f1 -d ' ')
   kubectl describe secret $SECRET | grep -E '^token' | cut -f2 -d':' | tr -d '\t'
   ```

   Replace `<SERVICE-ACCOUNT-NAME>` with the name of the service account created in the [cluster preparation](#cluster-preparation) instructions, which is `tower-launcher-sa` by default.

7. Enter the **Master server** URL.

   The master server URL can be obtained with the following command:

   ```bash
   kubectl cluster-info
   ```

   It can also be found in your `~/.kube/config` file under the `server` field corresponding to your cluster.

8. Specify the **SSL Certificate** to authenticate your connection.

   The certificate data can be found in your `~/.kube/config` file. It is the `certificate-authority-data` field corresponding to your cluster.

9. Specify the **Namespace** created in the [cluster preparation](#cluster-preparation) instructions, which is `tower-nf` by default.

10. Specify the **Head service account** created in the [cluster preparation](#cluster-preparation) instructions, which is `tower-launcher-sa` by default.

11. Specify the **Storage claim** created in the [cluster preparation](#cluster-preparation) instructions, which serves as a scratch filesystem for Nextflow pipelines. In each of the provided examples, the storage claim is called `tower-scratch`.

12. You can use the **Environment variables** option to specify custom environment variables for the Head job and/or Compute jobs.

13. Configure any advanced options described below, as needed.

14. Select **Create** to finalize the compute environment setup.

Jump to the documentation for [Launching Pipelines](../launch/launchpad).

### Advanced options

- The **Storage mount path** is the file system path where the Storage claim is mounted (default: `/scratch`).

- The **Work directory** is the file system path used as a working directory by Nextflow pipelines. It must be the storage mount path (default) or a subdirectory of it.

- The **Compute service account** is the service account used by Nextflow to submit tasks (default: the `default` account in the given namespace).

- The **Pod cleanup policy** determines when terminated pods should be deleted.

- You can use **Custom head pod specs** to provide custom options for the Nextflow workflow pod (`nodeSelector`, `affinity`, etc). For example:

  ```yaml
  spec:
    nodeSelector:
      disktype: ssd
  ```

- You can use **Custom service pod specs** to provide custom options for the compute environment pod. See above for an example.

- You can use **Head Job CPUs** and **Head Job Memory** to specify the hardware resources allocated for the Nextflow workflow pod.
