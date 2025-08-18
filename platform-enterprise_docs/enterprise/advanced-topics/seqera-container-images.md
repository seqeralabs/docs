---
title: "Legacy Seqera container image registries"
description: Legacy Seqera container deployments
date: "12 Apr 2023"
tags: [on-prem, prerequisites, configuration]
---

:::caution
The `cr.seqera.io` container registry is the default Seqera Enterprise container image registry from version 22.4. Using the AWS ECR Seqera container registry in existing installations is still supported but will be deprecated on June 1, 2025.
:::

Seqera publishes legacy Seqera Enterprise containers to a private Elastic Container Registry (ECR) on AWS. Retrieve them with the following steps:

1. **Provide Seqera with your AWS Account ID.**

  Supply this value to the Seqera representative managing your onboarding and wait for confirmation that it has been added to the ECR repository policy as an approved Principal.

2. **Retrieve a local copy of the container.**

  With the `docker compose` deployment method, you must retrieve container copies for local use:

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