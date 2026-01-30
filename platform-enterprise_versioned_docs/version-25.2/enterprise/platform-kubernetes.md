---
title: "Platform: Kubernetes"
description: Deploy Seqera Platform Enterprise with Kubernetes
date: "21 Apr 2023"
tags: [kubernetes, deployment]
---

Kubernetes deployments are recommended for production workloads requiring high availability and scalability.

## Prerequisites

Before you begin, you need:
- A Kubernetes cluster
- A MySQL 8 database
- A Redis 7 instance

### Recommended resources

| Component | CPU | Memory |
| :-------- | :-- | :----- |
| Backend pod | 1 core | 1200 Mi request, 4200 Mi limit |

## Container images

Seqera Enterprise container images are hosted on a private registry (`cr.seqera.io`). Access is provided as part of your purchase. Contact [support](https://support.seqera.io) if you require access.

We recommend mirroring these images to your own private container registry for production use. See [Mirroring container images](./configuration/mirroring) for details.

For development and proof of concept installations, you can use [image pull secrets](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/) to pull directly from the Seqera registry.

## Database configuration

Create a MySQL database and user for Seqera:

```sql
CREATE DATABASE tower;
CREATE USER 'tower'@'%' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON tower.* TO 'tower'@'%';
```

See [Database configuration](./configuration/overview#seqera-and-redis-databases) for details.

## Redis configuration

Configure the Redis connection URL in your Seqera environment:

```bash
TOWER_REDIS_URL=redis://<redis-host>:6379
```

Use a managed Redis service for production:
- [Amazon ElastiCache](https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html) (`cache.m4.large` or larger)
- [Azure Cache for Redis](https://learn.microsoft.com/en-gb/azure/azure-cache-for-redis/cache-overview) (C3 tier or larger)
- [Google Memorystore](https://cloud.google.com/memorystore/docs/redis) (M2 tier or larger)

## Deploy Seqera Enterprise

### Create a namespace

Create a namespace for Seqera resources:

```bash
kubectl create namespace seqera-platform
kubectl config set-context --current --namespace=seqera-platform
```

### Seqera ConfigMap

Download and configure a [ConfigMap](_templates/k8s/configmap.yml). See [Configuration](./configuration/overview.mdx) for more information.

Deploy the ConfigMap to your cluster after it is configured:

    ```bash
    kubectl apply -f configmap.yml
    ```

:::note
The `configmap.yml` manifest includes both the `tower.env` and `tower.yml` files. These files are made available to the other containers through volume mounts.
:::

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
          image: cr.seqera.io/private/nf-tower-enterprise/frontend:v25.3.0-unprivileged
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

If further customization of the config file is needed, mount a config map/secret over the templated NGINX configuration file at `/etc/nginx/templates/tower.conf.template`. See [SSL/TLS](./configuration/ssl_tls#configure-seqera-to-present-a-ssltls-certificate) for an example.

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

See [Test deployment](./testing).

## Optional features

### Pipeline optimization

Seqera Platform offers a service that optimizes pipeline resource requests. Refer to [Pipeline optimization](./configuration/pipeline_optimization.md) for more information.

### Studios

[Studios](../studios/overview) is an interactive analysis environment available in organizational workspaces. To enable Studios, see [Studios deployment](./studios).

:::note
Studios is available from Seqera Platform v24.1. If you experience any problems during the deployment process [contact Seqera support](https://support.seqera.io). Studios in Enterprise is not installed by default.
:::

### High availability

To configure Seqera Enterprise for high availability, note that:

- The `backend` service can be run in multiple replicas
- The `frontend` service is replicable, however in most scenarios it is not necessary
- The `cron` service may only have a single instance
- The `groundswell` service may only have a single instance

[aws-configure-ingress]: https://kubernetes-sigs.github.io/aws-load-balancer-controller/v2.2/guide/ingress/annotations/
[azure-configure-ingress]: https://docs.microsoft.com/en-us/azure/application-gateway/ingress-controller-annotations
[google-configure-ingress]: https://cloud.google.com/kubernetes-engine/docs/concepts/ingress
[k8s-ingress]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[k8s-load-balancer]: https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer
[k8s-node-port]: https://kubernetes.io/docs/concepts/services-networking/service/#nodeport
