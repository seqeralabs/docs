---
title: "Legacy Tower container image registries"
description: Legacy Tower container deployments
date created: "2023-04-12"
last updated: "2025-07-14"
tags: [on-prem, prerequisites, configuration]
---

:::caution
The Seqera Labs container registry `cr.seqera.io` is the default Tower container image registry from version 22.4. Use of the AWS, Azure, and Google Cloud Tower image registries (referenced below) in existing installations is still supported but will be deprecated for **new installations** starting June 2023.
:::

    === "AWS"
        Seqera Labs publishes the Tower Enterprise containers to a private Elastic Container Registry (ECR) on AWS.

        1. **Provide Seqera Labs with your AWS Account ID.**

            Supply this value to the Seqera representative managing your onboarding and wait for confirmation that it has been added to the ECR repository policy as an approved Principal.

        2. **Retrieve a local copy of the container.**

            Clients using the docker-compose deployment method must retrieve container copies for local use.

            1. Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) on the target machine.

            2. Configure the AWS CLI with an IAM User with at least these privileges:

                ```bash
                ecr:BatchGetImage
                ecr:GetAuthorizationToken
                ecr:GetDownloadUrlForLayer
                ```
            3. Authenticate Docker against the Seqera ECR:

                ```bash
                # AWS CLI v2
                aws ecr get-login-password --region eu-west-1 | \
                docker login --username AWS --password-stdin 195996028523.dkr.ecr.eu-west-1.amazonaws.com

                # AWS CLI v1
                $(aws ecr get-login --registry-ids 195996028523 --region eu-west-1 --no-include-email)
                ```

            4. Pull the containers to your machine:

                ```bash
                export REPOSITORY_URL="195996028523.dkr.ecr.eu-west-1.amazonaws.com/nf-tower-enterprise"
                export TAG="v22.3.1"

                docker pull ${REPOSITORY_URL}/backend:${TAG}
                docker pull ${REPOSITORY_URL}/frontend:${TAG}
                ```

    === "Azure"
        Seqera Labs publishes the Tower Enterprise containers to a private Azure Container Registry instance.

        1. **Acquire credentials from Seqera Labs.**

            Customers who chose to retrieve their Tower Enterprise containers from Seqera's Azure Container Registry will be supplied with a user id and authentication token during the onboarding process.

        2. **Retrieve a local copy of the container.**

            Clients using the docker-compose deployment method must retrieve container copies for local use.

            a. Authenticate Docker against the Seqera Azure Container Registry:

            ```bash
            # Replace USER and TOKEN with the credentials supplied by Seqera Labs
            docker login -u USER -p TOKEN seqera.azurecr.io
            ```

            b. Pull the containers to your local instance:

            ```bash
            export REPOSITORY_URL="seqera.azurecr.io/nf-tower-enterprise"
            export TAG="v22.3.1"

            docker pull ${REPOSITORY_URL}/backend:${TAG}
            docker pull ${REPOSITORY_URL}/frontend:${TAG}
            ```

    === "Google Cloud"
        Seqera Labs publishes the Tower Enterprise containers to a private Artifact Registry (AR) on GCP.

        1. **Provide Seqera Labs with your GCP Service Account.**

            Supply your GCP Project's Service Account email address to the Seqera representative managing your onboarding and wait for confirmation that it has been added as an approved Artifact Registry Reader.

        2. **Retrieve a local copy of the container.**

            Clients using the docker-compose deployment method must retrieve container copies for local use.

            a. [Install gcloud CLI and Docker](https://cloud.google.com/artifact-registry/docs/docker/store-docker-container-images) on the target machine.

            b. [Authenticate the Service Account](https://cloud.google.com/sdk/gcloud/reference/auth/activate-service-account) with the gcloud CLI.

            c. [Configure Docker](https://cloud.google.com/artifact-registry/docs/docker/authentication#gcloud-helper) to interact with the GCP Region where the Seqera AR resides:

            ```bash
            gcloud auth configure-docker europe-west2-docker.pkg.dev
            ```
            d. Confirm you have access to the repository:

            ```bash
            gcloud artifacts docker images list europe-west2-docker.pkg.dev/nf-tower-enterprise/containers/ --include-tags
            ```
            e. Pull the containers to your machine:

            ```bash
            export REPOSITORY_URL="europe-west2-docker.pkg.dev/nf-tower-enterprise/containers"
            export TAG="v22.3.1"

            docker pull ${REPOSITORY_URL}/backend:${TAG}
            docker pull ${REPOSITORY_URL}/frontend:${TAG}
            ```

:::caution
If you are unable to pull container images due to a `denied: Permission "artifactregistry.repositories.downloadArtifacts" denied on resouce "projects/nf-tower-enterprise/locations/eurpoe-west2/repositories/containers" (or it may not exist)` error, try the following:

            1. If your Docker requires sudo, [add sudo](https://cloud.google.com/artifact-registry/docs/docker/authentication#gcloud-helper) to the `gcloud auth configure-docker europe-west2-docker.pkg.dev` command.

            2. If you installed Docker onto Ubuntu using `snap`, ensure your [containerd config](https://jhartman.pl/2022/03/23/how-to-fix-permission-artifactregistry-repositories-downloadartifacts-denied-on-resource-on-ubuntu-when-pulling-from-google-artifact-repository/) is properly updated.

:::
