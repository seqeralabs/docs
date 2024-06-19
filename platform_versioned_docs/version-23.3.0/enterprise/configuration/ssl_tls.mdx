---
title: "SSL/TLS"
description: Configure your Seqera instance to use SSL/TLS certificates for HTTPS
date: "21 Apr 2023"
tags: [ssl, tls, https, configuration]
---

HTTP must not be used in production environments. An SSL certificate is required for your Seqera instance to handle HTTPS traffic. Private certificates are supported, but require additional configuration during Seqera Enterprise installation and Nextflow execution.

## AWS deployments: Manage SSL certificates with Amazon Certificate Manager (ACM)

Use [Amazon Certificate Manager](https://aws.amazon.com/certificate-manager/) (ACM) to apply SSL certificates to your AWS deployment:

- If you have an existing SSL certificate, see [Importing certificates into AWS Certificate Manager](https://docs.aws.amazon.com/acm/latest/userguide/import-certificate.html).

- If you don't have an existing SSL certificate, see [Issuing and managing certificates](https://docs.aws.amazon.com/acm/latest/userguide/gs.html).

## Configure Seqera to trust your private certificate

If you secure related infrastructure (such as private Git repositories) with certificates issued by a private Certificate Authority, these certificates must be loaded into the Seqera Enterprise containers. You can achieve this in several ways.

**Configure private certificate trust**

1. This guide assumes you're using the original containers supplied by Seqera.
2. Replace `TARGET_HOSTNAME`, `TARGET_ALIAS`, and `PRIVATE_CERT.pem` with your unique values.
3. Previous instructions advised using `openssl`. The native `keytool` utility is preferred as it simplifies steps and better accommodates private CA certificates.

**Use Docker volume**

1. Retrieve the private certificate on your Seqera container host:

```
keytool -printcert -rfc -sslserver TARGET_HOSTNAME:443  >  /PRIVATE_CERT.pem
```

2. Modify the `backend` and `cron` container configuration blocks in `docker-compose.yml`:

```yaml
CONTAINER_NAME:
  # -- Other keys here like `image` and `networks`--

  # Add a new mount for the downloaded certificate
  volumes:
    - type: bind
      source: /PRIVATE_CERT.pem
      target: /etc/pki/ca-trust/source/anchors/PRIVATE_CERT.pem

  # Add a new keytool import line PRIOR to 'update-ca-trust' for the certificate
  command: >
    sh -c "keytool -import -trustcacerts -storepass changeit -noprompt -alias TARGET_ALIAS -file /etc/pki/ca-trust/source/anchor/TARGET_HOSTNAME.pem &&
          update-ca-trust &&
          /wait-for-it.sh db:3306 -t 60 &&
          /tower.sh"
```

**Use K8s ConfigMap**

1. Retrieve the private certificate on a machine with CLI access to your Kubernetes cluster:

```bash
keytool -printcert -rfc -sslserver TARGET_HOSTNAME:443 > /PRIVATE_CERT.pem
```

2. Load the certificate as a `ConfigMap` in the same namespace where your Seqera instance will run:

```bash
kubectl create configmap private-cert-pemstore --from-file=/PRIVATE_CERT.pem
```

3. Modify both the `backend` and `cron` Deployment objects:

- Define a new volume based on the certificate `ConfigMap`:

  ```yaml
  spec:
    template:
      spec:
        volumes:
          - name: private-cert-pemstore
            configMap:
              name: private-cert-pemstore
  ```

- Add a volumeMount entry into the container definition:

  ```yaml
  spec:
    template:
      spec:
        containers:
          - name: CONTAINER_NAME
            volumeMounts:
              - name: private-cert-pemstore
                mountPath: /etc/pki/ca-trust/source/anchors/PRIVATE_CERT.pem
                subPath: PRIVATE_CERT.pem
  ```

- Modify the container start command to load the certificate prior to running your Seqera instance:

  ```yaml
  spec:
    template:
      spec:
        containers:
          - name: CONTAINER_NAME
            command: ["/bin/sh"]
            args:
              - -c
              - |
                keytool -import -trustcacerts -cacerts -storepass changeit -noprompt -alias TARGET_ALIAS -file /PRIVATE_CERT.pem;
                ./tower.sh
  ```

**Download on Pod start**

1. Modify both the `backend` and `cron` Deployment objects to retrieve and load the certificate prior to running your Seqera instance:

```yaml
spec:
  template:
    spec:
      containers:
        - name: CONTAINER_NAME
          command: ["/bin/sh"]
          args:
            - -c
            - |
              keytool -printcert -rfc -sslserver TARGET_HOST:443  >  /PRIVATE_CERT.pem;
              keytool -import -trustcacerts -cacerts -storepass changeit -noprompt -alias TARGET_ALIAS -file /PRIVATE_CERT.pem;
              ./tower.sh
```

## Configure the Nextflow launcher image to trust your private certificate

If you secure infrastructure such as private Git repositories or your Seqera Enterprise instance with certificates issued by a private Certificate Authority, these certificates must also be loaded into the Nextflow launcher container.

**Import private certificates via pre-run script**

1. This configuration assumes you're using the default `nf-launcher` image supplied by Seqera.
2. Replace `TARGET_HOSTNAME`, `TARGET_ALIAS`, and `PRIVATE_CERT.pem` with your unique values.
3. Previous instructions advised using `openssl`. The native `keytool` utility is preferred as it simplifies steps and better accommodates private CA certificates.

Add the following to your compute environment [pre-run script](../../launch/advanced.mdx#pre-and-post-run-scripts):

```bash
keytool -printcert -rfc -sslserver TARGET_HOSTNAME:443  >  /PRIVATE_CERT.pem
keytool -import -trustcacerts -cacerts -storepass changeit -noprompt -alias TARGET_ALIAS -file /PRIVATE_CERT.pem

cp /PRIVATE_CERT.pem /etc/pki/ca-trust/source/anchors/PRIVATE_CERT.pem
update-ca-trust
```

## Configure Seqera to present a SSL/TLS certificate

You can secure your Seqera instance with a TLS certificate in several ways.

**Load balancer (recommended)**

Place a load balancer, configured to present a certificate and act as a TLS termination point, in front of your Seqera instance.

This solution is likely already implemented for cloud-based Kubernetes implementations and can be easily implemented for Docker Compose-based stacks. See [this example](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-application-load-balancer.html).

**Reverse proxy container**

This solution works well for Docker Compose-based stacks to avoid the additional cost and maintenance of a load balancer. See [this example](https://doc.traefik.io/traefik/v1.7/configuration/acme/).

**Modify `frontend` container**

Due to complications that can be encountered during upgrades, this approach is not recommended.

<details>
  <summary>Show me anyway</summary>

  This example assumes deployment on an Amazon Linux 2 AMI.

  1. Install NGINX and other required packages:

      ```bash
      sudo amazon-linux-extras install nginx1.12
      sudo wget -r --no-parent -A 'epel-release-*.rpm' https://dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/
      sudo rpm -Uvh dl.fedoraproject.org/pub/epel/7/x86_64/Packages/e/epel-release-*.rpm
      sudo yum-config-manager --enable epel*
      sudo yum repolist all
      sudo amazon-linux-extras install epel -y
      ```

  2. Generate a [private certificate and key](https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs).

  3. Make a local copy of the `/etc/nginx/templates/tower.conf.template` file from the `frontend` container, or create a ConfigMap to store it if you're using Kubernetes.

  4. Replace the `listen` directives in the `server` block with the following:

      ```nginx
      listen ${NGINX_LISTEN_PORT} ssl default_server;
      listen [::]:${NGINX_LISTEN_PORT_IPV6} ssl default_server;

      ssl_certificate /etc/ssl/testcrt.crt;
      ssl_certificate_key /etc/ssl/testkey.key;
      ```

  5. Modify the `frontend` container definition in your `docker-compose.yml` file or Kubernetes manifest:

      ```yml
      frontend:
      image: cr.seqera.io/frontend:${TAG}
      networks:
          - frontend
      environment:
        NGINX_LISTEN_PORT: 8081
        NGINX_LISTEN_PORT_IPV6: 8443
      ports:
          - 8000:8081
          - 443:8443
      volumes:
          - $PWD/tower.conf.template:/etc/nginx/templates/tower.conf.template
          - $PWD/cert/testcrt.crt:/etc/ssl/testcrt.crt
          - $PWD/cert/testkey.key:/etc/ssl/testkey.key
      restart: always
      depends_on:
          - backend
      ```

</details>

## TLS version support

Seqera Enterprise versions 22.3.2 and earlier rely on Java 11 (Amazon Corretto). You may encounter issues when integrating with third-party services that enforce TLS v1.2 (such as Azure Active Directory OIDC).

TLS v1.2 can be explicitly enabled by default using JDK environment variables:

```bash
_JAVA_OPTIONS="-Dmail.smtp.ssl.protocols=TLSv1.2"
```
