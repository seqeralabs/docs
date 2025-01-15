---
title: "Kubernetes"
description: Deploy Seqera Platform Enterprise with Kubernetes
date: "21 Apr 2023"
tags: [kubernetes, deployment]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This guide assumes that all prerequisites have been met. Visit the corresponding **Prerequisites** page for your infrastructure provider.

Complete the following procedures to install Seqera Platform Enterprise on a Kubernetes cluster:

### Create a namespace

Create a namespace to isolate Kubernetes resources used by Seqera Platform from the other resources on your cluster.

:::note
This installation guide assumes the use of `seqera-platform` as the installation namespace. Consider using a different one that better fits your cluster naming convention.
:::

Create a namespace for the Seqera resources:

    ```bash
    kubectl create namespace seqera-platform
    ```

Switch to the namespace:

    ```bash
    kubectl config set-context --current --namespace=seqera-platform
    ```

### Configure container registry credentials

Seqera Enterprise is distributed as a collection of Docker containers available through the Seqera container registry [`cr.seqera.io`](https://cr.seqera.io). Contact [support](https://support.seqera.io) to get your container access credentials. After you've received your credentials, grant your cluster access to the registry:

1. Retrieve the `name` and `secret` values from the JSON file that you received from Seqera support.

1. Create a [secret][kubectl-secret]:

    ```bash
    kubectl create secret docker-registry cr.seqera.io \
      --docker-server=cr.seqera.io \
      --docker-username='<YOUR NAME>' \
      --docker-password='<YOUR SECRET>'
    ```

    The credential `name` contains a dollar `$` character. Wrap the name in single quotes to prevent the Linux shell from interpreting this value as an environment variable.

1. Configure the Seqera cron service and the application frontend and backend to use the secret created in the previous step (see [tower-cron.yml](./_templates/k8s/tower-cron.yml) and [tower-svc.yml](./_templates/k8s/tower-svc.yml)):

    ```yaml
    imagePullSecrets:
    - name: "cr.seqera.io"
    ```

    This parameter is already included in the templates linked above. If you use a name other than `cr.seqera.io` for the secret, update this value accordingly in the configuration files.

### Seqera ConfigMap

Download and configure a [ConfigMap](_templates/k8s/configmap.yml). See [Configuration](configuration/overview.mdx) for more information.

Deploy the ConfigMap to your cluster after it is configured:

    ```bash
    kubectl apply -f configmap.yml
    ```

:::note
The `configmap.yml` manifest includes both the `tower.env` and `tower.yml` files. These files are made available to the other containers through volume mounts.
:::

### Redis

Seqera Enterprise requires a Redis database for caching purposes. Configure Redis manually by deploying a manifest to your cluster, or configure a managed Redis service.

#### Deploy a Redis manifest to your cluster

1. Download the appropriate manifest for your infrastructure:

    - [Amazon EKS](_templates/k8s/redis.eks.yml)
    - [Azure AKS](_templates/k8s/redis.aks.yml)
    - [Google Kubernetes Engine](_templates/k8s/redis.gke.yml)

1. Deploy to your cluster:

    ```bash
    kubectl apply -f redis.*.yml
    ```

1. To run the Redis service as a container as part of your Docker or Kubernetes installation, specify the service name as part of the `TOWER_REDIS_URL`:

    ```bash
    TOWER_REDIS_URL=redis://redis:6379
    ```

#### Managed Redis services

Seqera supports managed Redis services such as [Amazon ElastiCache][aws-elasticache], [Azure Cache for Redis][azure-cache], or [Google Memorystore][memorystore].

<Tabs>
<TabItem value="AWS ElastiCache" label="AWS ElastiCache" default>

- Use a single-node cluster, as multi-node clusters are not supported
- Use an instance with at least 6GB capacity ([cache.m4.large][aws-cache-instances] or greater)
- Specify your private ElastiCache instance in the Seqera [environment variables](./configuration/overview.mdx#database-and-redis-manual-configuration):

  ```bash
  TOWER_REDIS_URL=redis://<redis private IP>:6379
  ```

</TabItem>
<TabItem value="Azure Cache for Redis" label="Azure Cache for Redis" default>

- Use a single-node cluster, as multi-node clusters are not supported
- Use an instance with at least 6GB capacity ([C3][azure-cache-instances] or greater)
- Specify your private Azure Cache for Redis instance in the Seqera [environment variables](./configuration/overview.mdx#database-and-redis-manual-configuration):

  ```bash
  TOWER_REDIS_URL=redis://<redis private IP>:6379
  ```

</TabItem>
<TabItem value="Google Memorystore" label="Google Memorystore" default>

- Use a single-node cluster, as multi-node clusters are not supported
- Use an instance with at least 6GB capacity ([M2][google-cache-instances] or greater)
- Specify your private Memorystore instance in the Seqera [environment variables](./configuration/overview.mdx#database-and-redis-manual-configuration):

  ```bash
  TOWER_REDIS_URL=redis://<redis private IP>:6379
  ```

</TabItem>
</Tabs>

### Seqera cron service

Download the [cron service manifest](_templates/k8s/tower-cron.yml) file.

To deploy the manifest to your cluster, run the following:

    ```bash
    kubectl apply -f tower-cron.yml
    ```

:::caution
This container creates the required database schema the first time it instantiates. This process can take a few minutes to complete and must finish before you instantiate the Seqera backend. Ensure this container is in the `READY` state before proceeding to the next step.
:::

### Seqera frontend and backend

Download the [manifest](_templates/k8s/tower-svc.yml).

To deploy the manifest to your cluster, run the following:

  ```bash
  kubectl apply -f tower-svc.yml
  ```

#### Seqera frontend unprivileged

An unprivileged version of the Seqera frontend image is also available. This image listens on an unprivileged port and therefore doesn't need to be run as the root user.

Replace the tag of the frontend image `cr.seqera.io/private/nf-tower-enterprise/frontend:v24.x.x` with `cr.seqera.io/private/nf-tower-enterprise/frontend:v24.x.x-unprivileged`. In the `frontend` service below, specify the `targetPort` to match the environment variable `NGINX_LISTEN_PORT` (see below):

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  ...
      containers:
        - name: frontend
          image: cr.seqera.io/private/nf-tower-enterprise/frontend:v24.2.2-unprivileged
          env:
            - name: NGINX_LISTEN_PORT  # If not defined, defaults to 8000.
              value: 8000
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  ports:
    - port: 80
      targetPort: 8000
```

The unprivileged Seqera image will soon deprecate the current image that requires root. The unprivileged image can be easily customized using environment variables:

- `NGINX_LISTEN_PORT` (default `8000`): The port the NGINX process will listen on
  inside the container. The `targetPort` on the `frontend` service must match the value
  defined in the environment variable.
- `NGINX_LISTEN_PORT_IPV6` (default `8000`): The NGINX listening port to open on the IPv6 address.
- `NGINX_UPSTREAM_HOST` (default `backend`): The hostname of the backend service to which the NGINX process will route requests.
- `NGINX_UPSTREAM_PORT` (default `8080`): The port where the backend service is exposed.

If further customization of the config file is needed, mount a config map/secret over the templated NGINX configuration file at `/etc/nginx/templates/tower.conf.template`. See [SSL/TLS](./configuration/ssl_tls.mdx##configure-seqera-to-present-a-ssltls-certificate) for an example.

### Seqera ingress

An ingress is used to make Seqera Enterprise publicly accessible, load-balance traffic, terminate TLS, and offer name-based virtual hosting. The included ingress manifest will create an external IP address and forward HTTP traffic to the Seqera frontend.

Download and configure the appropriate manifest for your infrastructure:

    - [Amazon EKS](_templates/k8s/ingress.eks.yml)
    - [Azure AKS](_templates/k8s/ingress.aks.yml)
    - [Google Kubernetes Engine](_templates/k8s/ingress.gke.yml)

To deploy the manifest to your cluster, run the following:

    ```bash
    kubectl apply -f ingress.*.yml
    ```

See [Kubernetes ingress][k8s-ingress] for more information. If you don't need to make Seqera externally accessible, use a service resource to expose a [node port][k8s-node-port] or a [load balancer][k8s-load-balancer] service to make it accessible within your intranet.

See the cloud provider documentation for configuring an ingress service on each cloud provider:

- [Amazon][aws-configure-ingress]
- [Azure][azure-configure-ingress]
- [Google Cloud][google-configure-ingress]

### Check status

Check that all services are up and running:

```bash
kubectl get pods
```

### Test the application

See [Test deployment](./testing.mdx).

## Optional features

### Pipeline optimization

Seqera Platform offers a service that optimizes pipeline resource requests. Install the resource optimization service in your Kubernetes cluster with [this manifest](_templates/k8s/groundswell.yml).

Define a set of credentials for the resource optimization database in the `tower-groundswell-cfg` ConfigMap. This can be the same database used for Seqera, but in a different schema.

The initContainers will wait until both the Seqera and pipeline optimization service databases are ready before starting the migration in the Seqera database and finally starting the resource optimization container.

### Data Studios

[Data Studios](../data_studios/index.mdx) is an interactive analysis environment available in organizational workspaces. To enable Data Studios, see [Data Studios deployment](./data-studios.mdx).

:::note
Data Studios is currently in **public preview** and is available from Seqera Platform v24.1. If you experience any problems during the deployment process [contact Seqera support](https://support.seqera.io). Data Studios in Enterprise is not installed by default.
:::

### Database console

Use the [dbconsole.yml](_templates/k8s/dbconsole.yml) manifest to deploy a simple web frontend to the Seqera database. Though not required, this can be useful for administrative purposes.

1. Deploy the database console:

    ```bash
    kubectl apply -f dbconsole.yml
    ```

1. Enable a port-forward for the database console to your local machine:

    ```bash
    kubectl port-forward deployment/dbconsole 8080:8080
    ```

1. Access the database console in a web browser at `http://localhost:8080`.

### High availability

To configure Seqera Enterprise for high availability, note that:

- The `backend` service can be run in multiple replicas
- The `frontend` service is replicable, however in most scenarios it is not necessary
- The `cron` service may only have a single instance
- The `groundswell` service may only have a single instance

[aws-cache-instances]: https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/CacheNodes.SupportedTypes.html
[aws-configure-ingress]: https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/guide/ingress/annotations/
[aws-elasticache]: https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html
[azure-cache]: https://learn.microsoft.com/en-gb/azure/azure-cache-for-redis/cache-overview
[azure-cache-instances]: https://azure.microsoft.com/en-gb/pricing/details/cache/
[azure-configure-ingress]: https://docs.microsoft.com/en-us/azure/application-gateway/ingress-controller-annotations
[google-cache-instances]: https://cloud.google.com/memorystore/docs/redis/pricing#instance_pricing
[google-configure-ingress]: https://cloud.google.com/kubernetes-engine/docs/concepts/ingress
[k8s-ingress]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[k8s-load-balancer]: https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer
[k8s-node-port]: https://kubernetes.io/docs/concepts/services-networking/service/#nodeport
[kubectl-secret]: https://kubernetes.io/docs/tasks/configmap-secret/managing-secret-using-kubectl/
[memorystore]: https://cloud.google.com/memorystore/docs/redis
