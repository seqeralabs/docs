---
title: "Google Kubernetes Engine"
description: "Instructions to set up Google Kubernetes Engine in Seqera Platform"
date: "21 Apr 2023"
tags: [gke, google, compute environment]
---

[Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine) is a managed Kubernetes cluster that allows the execution of containerized workloads in Google Cloud at scale.

Seqera Platform offers native support for GKE clusters to streamline the deployment of Nextflow pipelines.

## Requirements

See [here](../compute-envs/google-cloud-batch#configure-google-cloud) for instructions to set up your Google Cloud account and other services (such as Cloud storage).

You must have a GKE cluster up and running. Follow the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions to create the resources required by Seqera. In addition to the generic Kubernetes instructions, you must make a number of modifications specific to GKE.

### Service account role

You must grant cluster access to the service account used by the Seqera compute environment. To do this, update the [service account _RoleBinding_](https://cloud.google.com/kubernetes-engine/docs/how-to/role-based-access-control#rolebinding):

```yaml
cat << EOF | kubectl apply -f -
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
    name: tower-launcher-userbind
subjects:
    - kind: User
    name: <IAM SERVICE ACCOUNT>
    apiGroup: rbac.authorization.k8s.io
roleRef:
    kind: Role
    name: tower-launcher-role
    apiGroup: rbac.authorization.k8s.io
---
EOF
```

Replace `<IAM SERVICE ACCOUNT>` with the corresponding service account, e.g., `test-account@test-project-123456.google.com.iam.gserviceaccount.com`.

See [Role-based access control](https://cloud.google.com/kubernetes-engine/docs/how-to/role-based-access-control) for more information.

## Seqera compute environment

:::caution
Your Seqera compute environment uses resources that you may be charged for in your Google Cloud account. See [Cloud costs](../monitoring/cloud-costs) for guidelines to manage cloud resources effectively and prevent unexpected costs.
:::

After you've prepared your Kubernetes cluster and granted cluster access to your service account, create a Seqera GKE compute environment:

1. In a Seqera workspace, select **Compute environments > New environment**.
1. Enter a descriptive name for this environment, e.g., _Google Kubernetes Engine (europe-west1)_.
1. From the **Provider** drop-down, select **Google Kubernetes Engine**.
1. Under **Storage**, select either **Fusion storage** (recommended) or **Legacy storage**. The [Fusion v2](https://docs.seqera.io/fusion) virtual distributed file system allows access to your Google Cloud-hosted data (`gs://` URLs). This eliminates the need to configure a shared file system in your Kubernetes cluster. See [Fusion v2](#fusion-v2) below.
1. From the **Credentials** drop-down menu, select existing GKE credentials, or select **+** to add new credentials. If you choose to use existing credentials, skip to step 8.
1. Enter a name for the credentials, e.g., _GKE Credentials_.
1. Enter the **Service account key** for your Google service account.
    :::tip
    You can create multiple credentials in your Seqera environment. See [Credentials](../credentials/overview).
    :::
1. Select the **Location** of your GKE cluster.
    :::caution
    GKE clusters can be either regional or zonal. For example, `us-west1` identifies the United States West-Coast _region_, which has three _zones_: `us-west1-a`, `us-west1-b`, and `us-west1-c`.

    Seqera Platform's auto-completion only shows regions. You should manually edit this field if you're using a zonal GKE cluster.
    :::
1. Select or enter the **Cluster name** of your GKE cluster.
1. Specify the **Namespace** created in the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions. This is _tower-nf_ by default.
1. Specify the **Head service account** created in the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions. This is _tower-launcher-sa_ by default.
    :::note
    If you enable Fusion v2 (**Fusion storage** in step 4 above), the head service account must have access to the Google Cloud storage bucket specified as your work directory.
    :::
1. Specify the **Storage claim** created in the [cluster preparation](../compute-envs/k8s#cluster-preparation) instructions. This serves as a scratch filesystem for Nextflow pipelines. The storage claim is called _tower-scratch_ in the provided examples.
    :::note
    The **Storage claim** isn't needed when Fusion v2 is enabled.
    :::
1. Apply [**Resource labels**](../resource-labels/overview) to the cloud resources consumed by this compute environment. Workspace default resource labels are prefilled.
1. Expand **Staging options** to include:
    - Optional [pre- or post-run Bash scripts](../launch/advanced#pre-and-post-run-scripts) that execute before or after the Nextflow pipeline execution in your environment.
    - Global Nextflow configuration settings for all pipeline runs launched with this compute environment. Values defined here are pre-filled in the **Nextflow config file** field in the pipeline launch form. These values can be overridden during pipeline launch. 
    :::info
    Configuration settings in this field override the same values in the pipeline repository `nextflow.config` file. See [Nextflow config file](../launch/advanced#nextflow-config-file) for more information on configuration priority. 
    :::
1. Specify custom **Environment variables** for the **Head job** and/or **Compute jobs**.
1. Configure any advanced options described in the next section, as needed.
1. Select **Create** to finalize the compute environment setup.

### Advanced options

Seqera Platform compute environments for GKE include advanced options for storage and work directory paths, resource allocation, and pod customization.

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
- Use **Head Job CPUs** and **Head Job Memory** to specify the hardware resources allocated for the Nextflow workflow pod.

:::info 
See [Launch pipelines](../launch/launchpad) to start executing workflows in your GKE compute environment.
:::

### Fusion v2

To use [Fusion v2](https://docs.seqera.io/fusion) in your Seqera GKE compute environment:
1. Use Seqera Platform version 23.1 or later.
1. Use an S3 bucket as the work directory.
1. Both the head service and compute service accounts must have access to the Google Cloud storage bucket specified as the work directory.

<details>
<summary>Configure IAM to use Fusion v2</summary>

1. Ensure the **Workload Identity** feature is enabled for the cluster:
    - **Enable Workload Identity** in the cluster **Security** settings.
    - **Enable GKE Metadata Server** in the node group **Security** settings.
1. Allow the IAM service account access to your Google storage bucket:
    ```shell
    gcloud storage buckets add-iam-policy-binding gs://<YOUR-BUCKET> --role roles/storage.objectAdmin --member serviceAccount:<IAM-SERVICE-ACCOUNT>@<GOOGLE-CLOUD-PROJECT>.iam.gserviceaccount.com
    ```
    The role must have at least `storage.objects.create`, `storage.objects.get`, and `storage.objects.list` permissions.
1. Allow the Kubernetes service account to impersonate the IAM service account:
    ```shell
    gcloud iam service-accounts add-iam-policy-binding <IAM-SERVICE-ACCOUNT>@<GOOGLE-CLOUD-PROJECT>.iam.gserviceaccount.com --role roles/iam.workloadIdentityUser --member "serviceAccount:<GOOGLE-CLOUD-PROJECT>.svc.id.goog[<GKE-NAMESPACE>/<GKE-SERVICE-ACCOUNT>]"
    ```
1. Annotate the Kubernetes service account with the email address of the IAM service account:
    ```shell
    kubectl annotate serviceaccount <GKE-SERVICE-ACCOUNT> --namespace <GKE-NAMESPACE> iam.gke.io/gcp-service-account=<IAM-SERVICE-ACCOUNT>@<GOOGLE-CLOUD-PROJECT>.iam.gserviceaccount.com
    ```

See the [GKE documentation](https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity#authenticating_to) for further details.

</details>
