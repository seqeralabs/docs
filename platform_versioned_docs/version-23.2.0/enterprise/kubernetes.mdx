---
title: "Kubernetes deployment"
description: Deploy Tower with Kubernetes
date: "21 Apr 2023"
tags: [kubernetes, deployment]
---

This guide assumes that all prerequisites have been met. Please visit the corresponding **Prerequisites** page for your infrastructure provider.

:::note
You may also use this guide for deployments to other cloud platforms (e.g. Oracle Kubernetes Engine), however it is up to you to satisfy any prerequisites for those platforms. Use at your own risk.
:::

## Deploy Tower

### Create a namespace

Create a namespace to group the Tower resources within your K8s cluster.

1. Create the namespace (e.g. `tower-nf`):

   ```bash
   kubectl create namespace tower-nf
   ```

2. Switch to the namespace:

   ```bash
   kubectl config set-context --current --namespace=tower-nf
   ```

### Configure container registry credentials

Nextflow Tower is distributed as a collection of Docker containers available through the Seqera Labs
container registry [`cr.seqera.io`](https://cr.seqera.io). Contact [support](https://support.seqera.io) to get your container access credentials. Once you have received your credentials, grant your cluster access to the registry using these steps:

1. Retrieve the `name` and `secret` values from the JSON file you received from Seqera Labs support.

2. Create a Kubernetes [Secret](https://kubernetes.io/docs/tasks/configmap-secret/managing-secret-using-kubectl/), using the `name` and `secret` retrieved in step 1, with this command:

   ```bash
   kubectl create secret docker-registry cr.seqera.io \
     --docker-server=cr.seqera.io \
     --docker-username='/\<YOUR NAME\>/' \
     --docker-password='<YOUR SECRET>'
   ```

   Note: The credential `name` contains a dollar `$` character. To prevent the Linux shell from interpreting this value as an environment variable, wrap it in single quotes.

3. The following snippet configures the Tower cron service and the Tower frontend and backend to use the Secret created in step 2 (see [tower-cron.yml](./_templates/k8s/tower-cron.yml) and [tower-svc.yml](./_templates/k8s/tower-svc.yml)):

```yml
imagePullSecrets:
  - name: "cr.seqera.io"
```

This parameter is already included in the templates linked above — if you use a name other than `cr.seqera.io` for the Kubernetes Secret, update this value accordingly in the configuration files.

### Tower ConfigMap

<details>
  <summary>configmap.yml</summary>
  ```yaml file=../enterprise/_templates/k8s/configmap.yml
  ```
</details>

1. Download and configure [configmap.yml](_templates/k8s/configmap.yml) as per the [configuration](configuration/overview.mdx) page.

2. Deploy the configmap to your cluster:

   ```bash
   kubectl apply -f configmap.yml
   ```

:::note
The `configmap.yml` manifest includes both `tower.env` and `tower.yml`. These files are made available to the other containers through volume mounts.
:::

### Redis

<details>
  <summary>redis.aks.yml</summary>

```yaml file=../enterprise/_templates/k8s/redis.aks.yml

```

</details>

<details>
  <summary>redis.eks.yml</summary>

```yaml file=../enterprise/_templates/k8s/redis.eks.yml

```

</details>

<details>
  <summary>redis.gke.yml</summary>

```yaml file=../enterprise/_templates/k8s/redis.gke.yml

```

</details>

Download the appropriate manifest for your infrastructure:

- [redis.aks.yml](_templates/k8s/redis.aks.yml)

- [redis.eks.yml](_templates/k8s/redis.eks.yml)

- [redis.gke.yml](_templates/k8s/redis.gke.yml)

Deploy to your cluster:

```bash
kubectl apply -f redis.*.yml
```

:::note
You may also be able to use a managed Redis service such as [Amazon Elasticache](https://aws.amazon.com/elasticache/) or [Google Memorystore](https://cloud.google.com/memorystore), however we do not explicitly support these services, and Tower is not guaranteed to work with them. Use at your own risk.

    If you do use an externally managed Redis service, make sure to update `configmap.yml` accordingly:

    ```yaml
    TOWER_REDIS_URL: redis://<redis private IP>:6379
    ```

:::

### Tower cron service

<details>
  <summary>tower-cron.yml</summary>

```yaml file=../enterprise/_templates/k8s/tower-cron.yml

```

</details>

1. Download the manifest:

- [tower-cron.yml](_templates/k8s/tower-cron.yml)

2. Deploy to your cluster:

```bash
kubectl apply -f tower-cron.yml
```

:::caution
This container will create the required database schema the first time it is instantiated. This process can take a few minutes to complete and must be finished before you instantiate the Tower backend. Make sure this container is in the `READY` state before proceeding to the next step.
:::

### Tower frontend and backend

<details>
    <summary>tower-svc.yml</summary>

```yaml file=../enterprise/_templates/k8s/tower-svc.yml

```

</details>

Download the manifest:

- [tower-svc.yml](_templates/k8s/tower-svc.yml)

Deploy to your cluster:

```bash
kubectl apply -f tower-svc.yml
```

### Tower ingress

An ingress is used to make Tower publicly accessible, load balance traffic, terminate SSL/TLS, and offer name-based virtual hosting. The included ingress will create an external IP address and forward HTTP traffic to the Tower frontend.

<details>
  <summary>ingress.aks.yml</summary>

```yaml file=../enterprise/_templates/k8s/ingress.aks.yml

```

</details>

<details>
  <summary>ingress.eks.yml</summary>

```yaml file=../enterprise/_templates/k8s/ingress.eks.yml

```

</details>

<details>
  <summary>ingress.gke.yml</summary>

```yaml file=../enterprise/_templates/k8s/ingress.gke.yml

```

</details>

Download the appropriate manifest and configure it according to your infrastructure:

- [ingress.aks.yml](_templates/k8s/ingress.aks.yml)

- [ingress.eks.yml](_templates/k8s/ingress.eks.yml)

- [ingress.gke.yml](_templates/k8s/ingress.gke.yml)

Deploy to your cluster:

```bash
kubectl apply -f ingress.*.yml
```

See the Kubernetes documentation on [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) for more information. If you don't need to make Tower externally accessible, you can also use a [NodePort](https://kubernetes.io/docs/concepts/services-networking/service/#nodeport) or a [LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) service to make it accessible within your intranet.

Additionally, see the relevant documentation for configuring an Ingress on each cloud provider:

- [Amazon](https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/guide/ingress/annotations/)
- [Azure](https://docs.microsoft.com/en-us/azure/application-gateway/ingress-controller-annotations)
- [Google Cloud](https://cloud.google.com/kubernetes-engine/docs/concepts/ingress)

### Check status

Finally, make sure that all services are up and running:

```bash
kubectl get pods
```

## Test the application

To make sure that Tower is properly configured, follow these steps:

1. Log in to Tower.

2. Create an **organization**.

3. Create a **workspace** within that organization.

4. Create a new **Compute Environment**. Refer to [Compute Environments](https://help.tower.nf/compute-envs/overview/) for detailed instructions.

5. Select **Quick Launch** from the **Launchpad** tab in your workspace.

6. Enter the repository URL for the `nf-core/rnaseq` pipeline (`https://github.com/nf-core/rnaseq`).

7. In the **Config profiles** dropdown, select the `test` profile.

8. In the **Pipeline parameters** textarea, change the output directory to a sensible location based on your Compute Environment:

   ```yaml
   # save to S3 bucket
   outdir: s3://<your-bucket>/results

   # save to scratch directory (Kubernetes)
   outdir: /scratch/results
   ```

9. Select **Launch**.

   You'll be transitioned to the **Runs** tab for the workflow. After a few minutes, you'll see the progress logs in the **Execution log** tab for that workflow.

## Optional addons

### Database console

<details>
  <summary>dbconsole.yml</summary>

```yaml file=../enterprise/_templates/k8s/dbconsole.yml

```

</details>

The included [dbconsole.yml](_templates/k8s/dbconsole.yml) can be used to deploy a simple web frontend to the Tower database. It is _not_ required but it can be useful for administrative purposes.

1. Deploy the database console:

   ```bash
   kubectl apply -f dbconsole.yml
   ```

2. Port-forward the database console to your local machine:

   ```bash
   kubectl port-forward deployment/dbconsole 8080:8080
   ```

   The database console will be available in your browser at `http://localhost:8080`.

### High availability

When configuring Tower for high availability, it should be noted that:

- The `cron` service may only have a single instance

- The `backend` service can be run in multiple replicas

- The `frontend` service is replicable, however in most scenarios it is not necessary
