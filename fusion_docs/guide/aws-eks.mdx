---
title: Amazon EKS
description: "Use Fusion with AWS EKS and S3 storage"
date: "23 Aug 2024"
tags: [fusion, storage, compute, aws eks, s3]
---

Fusion streamlines the deployment of Nextflow pipelines in Kubernetes because it replaces the need to configure
and maintain a shared file system in your cluster.

### Platform Amazon EKS compute environments 

Seqera Platform supports Fusion in Amazon EKS compute environments. 

See [Amazon EKS](https://docs.seqera.io/platform/latest/compute-envs/eks) for Platform instructions to enable Fusion.

### Nextflow CLI

:::tip
Fusion file system implements a lazy download and upload algorithm that runs in the background to transfer files in
parallel to and from the object storage into the container-local temporary directory (`/tmp`). To achieve optimal performance, set up an SSD volume as the temporary directory.

Several AWS EC2 instance types include one or more NVMe SSD volumes. These volumes must be formatted to be used. See [SSD instance storage](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ssd-instance-store.html) for details.
:::

To use Fusion directly in Nextflow with an Amazon EKS cluster, you must configure a namespace and service account and update your Nextflow configuration. 

#### Kubernetes configuration

You must create a namespace and a service account in your Kubernetes cluster to run the jobs submitted during pipeline execution.

1. Create a manifest that includes the following configuration at minimum:

    ```yaml
    ---
    apiVersion: v1
    kind: Namespace
    metadata:
        name: fusion-demo
    ---
    apiVersion: v1
    kind: ServiceAccount
    metadata:
        namespace: fusion-demo
        name: fusion-sa
        annotations:
            eks.amazonaws.com/role-arn: "arn:aws:iam::<YOUR ACCOUNT ID>:role/fusion-demo-role"
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
    ```

1. The AWS IAM role must provide read-write permission to the S3 bucket used as the pipeline work directory:

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": ["s3:ListBucket"],
                "Resource": ["arn:aws:s3:::<YOUR-BUCKET>"]
            },
            {
                "Action": [
                    "s3:GetObject",
                    "s3:PutObject",
                    "s3:PutObjectTagging",
                    "s3:DeleteObject"
                ],
                "Resource": ["arn:aws:s3:::<YOUR-BUCKET>/*"],
                "Effect": "Allow"
            }
        ]
    }
    ```

    Replace `<YOUR-BUCKET>` with a bucket name of your choice.

1. The role must define a trust relationship similar to this:

    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Federated": "arn:aws:iam::<YOUR ACCOUNT ID>:oidc-provider/oidc.eks.<YOUR REGION>.amazonaws.com/id/<YOUR CLUSTER ID>"
                },
                "Action": "sts:AssumeRoleWithWebIdentity",
                "Condition": {
                    "StringEquals": {
                        "oidc.eks.eu-west-2.amazonaws.com/id/<YOUR CLUSTER ID>:aud": "sts.amazonaws.com",
                        "oidc.eks.eu-west-2.amazonaws.com/id/<YOUR CLUSTER ID>:sub": "system:serviceaccount:fusion-demo:fusion-sa"
                    }
                }
            }
        ]
    }
    ```

#### Nextflow configuration

1. Add the following to your `nextflow.conf` file:

    ```groovy
    wave.enabled = true
    fusion.enabled = true
    process.executor = 'k8s'
    k8s.context = '<YOUR K8S CLUSTER CONTEXT>'
    k8s.namespace = 'fusion-demo'
    k8s.serviceAccount = 'fusion-sa'
    ```

    Replace `<YOUR K8S CLUSTER CONTEXT>` with the Kubernetes context in your Kubernetes config.

1. Run the pipeline with the usual run command:

    ```
    nextflow run <YOUR PIPELINE SCRIPT> -w s3://<YOUR-BUCKET>/work
    ```

    Replace `<YOUR PIPELINE SCRIPT>` with your pipeline Git repository URI and `<YOUR-BUCKET>` with your S3 bucket.

