---
title: "System deployment"
description: "System deployment instructions for Nextflow Tower."
date: "21 Apr 2023"
tags: [installation, deployment]
---

:::tip
It is highly recommended to first [**Sign up**](https://tower.nf "Nextflow Tower") and try the hosted version of Tower for free or request a [**demo**](https://cloud.tower.nf/demo/ "Nextflow Tower Demo") for a deployment in your own on-premises or cloud environment.
:::

Nextflow Tower is a web application server based on a microservice oriented architecture and designed to maximize the portability, scalability and security of the application.

The application is composed of a variety of modules that can be configured and deployed depending on organization's requirements.

All components for the Enterprise release are packaged as Docker container images which are hosted and security validated by the Amazon ECR service. The community version can be accessed via GitHub.

## Deployment configurations

:::caution
To install Nextflow Tower on private infrastructure, you'd need a **license key**. Please contact us at sales@seqera.io to get your license key.
:::

### Basic deployment

The minimal Tower configuration only requires the front-end, backend and database modules.

These can be executed as Docker containers or as native services running in the hosting environment. Such a minimal configuration is only suggested for **evaluation purposes** or for a small number of users.

### Kubernetes deployment

Kubernetes cluster management is emerging as the technology of choice for the deployment of applications requiring high-availability, scalability and security.

Nextflow Tower Enterprise includes configuration manifests for the deployment in the Kubernetes environment.

This diagram shows the system architecture for the reference deployment on AWS.

![](./_images/installation_reference_architecture.png)

### Tower Modules

The application is composed of a number of modules that can be configured and deployed depending on user requirements.

All components are packaged as Docker container images which are hosted and security validated by the Amazon ECR service.

### Backend module

The backend is implemented as a JVM-based application server based on the Micronaut framework which provides a modern and secure backbone for the application server.

The backend module requires OpenJDK 8 or later.

The backend layer implements the main application logic organised in a _service_ layer, which is then exposed via a REST API and defined via an OpenAPI schema.

The backend module uses JPA/Hibernate/JDBC API industry standards to connect the underlying relational database.

The backend is designed to run standalone or as multiple replicas for scalability when deployed in high-availability mode.

### Frontend module

The frontend module is composed by Angular 8 application which is served by an Nginx web server.

The frontend can be configured to expose the application directly to the user/DMZ via an HTTPS connection or through a load balancer.

### Storage

Nextflow Tower requires a relational database as its primary storage.

It is suggested to use MySQL 5.6, however, any SQL database compatible with JPA/JDBC industry-standards is supported.

### Caching

Tower provides an optional caching module for configurations requiring high availability.

This module requires a Redis 5.0 in-memory database.

### Authentication module

Nextflow Tower supports enterprise authentication mechanisms such as OAuth and LDAP.

Third-party authority providers and custom single-sign-on flow can be developed depending on exact customer requirements.

### Cron scheduler

Tower implements a cron service which takes care of executing periodical activities, such as sending e-mail notifications and cleaning up.

The cron service can be configured to run as an embedded backend service or an independent service.
