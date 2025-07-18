---
title: "AWS prerequisites"
description: Prerequisites for AWS deployments
date: "12 Apr 2023"
tags: [aws, prerequisites, configuration]
---

This page describes the infrastructure and other prerequisites for deploying Tower on Amazon Web Services (AWS).

## Tower container images

Nextflow Tower is distributed as a collection of Docker containers available through the Seqera Labs container registry ([cr.seqera.io](https://cr.seqera.io)). Contact [support](https://support.seqera.io) to get your container access credentials. Once you have received your credentials, log in to the registry using these steps:

1. Retrieve the **username** and **password** you received from Seqera Labs support.

2. Run the following Docker command to authenticate to the registry (using the `username` and `password` values copied in step 1):

    ```bash
    docker login -u '/\<USERNAME\>/' -p '/\PASSWORD\>/' cr.seqera.io
    ```

3. Pull the Nextflow Tower container images with the following commands:

    ```bash
    docker pull {{ images.tower_be_image }}
    
    docker pull {{ images.tower_fe_image }}
    ```

:::caution
The Seqera Labs container registry `cr.seqera.io` is the default Tower container image registry from version 22.4. Use of the AWS, Azure, and Google Cloud Tower image registries in existing installations is still supported but will be deprecated for **new installations** starting June 2023. See [here](../advanced-topics/seqera-container-images) for steps to use the Seqera Labs private AWS Elastic Container Registry.
:::

## Mandatory prerequisites

### SMTP server

If you do not have an email server, you can use [Amazon Simple Email Service](https://aws.amazon.com/ses/).

:::caution
Amazon [blocks EC2 traffic over port 25 by default](https://aws.amazon.com/premiumsupport/knowledge-center/ec2-port-25-throttle/). Ensure your integration uses a port that can successfully reach your SMTP server.
:::

### MySQL database

An external database (i.e. external to your Docker Compose or Kubernetes deployment) is _highly_ recommended for production deployments. If you don't have your own database service, you can use [Amazon Relational Database Service](https://aws.amazon.com/rds/).

If you decide to use an external database, you must create a MySQL user and database manually. See [Configuration](../configuration/database_and_redis) for more details.

### Redis-compatible cache

An external Redis-compatible cache, such as one provided by [Amazon ElastiCache](https://aws.amazon.com/elasticache/), is highly recommended for production deployments.

### EC2 instance (Docker Compose)

An [EC2](https://aws.amazon.com/ec2/) instance is required to deploy Tower via Docker Compose. Refer to the [detailed instructions](#detailed-instructions) to provision an EC2 instance for this purpose.

### EKS cluster (Kubernetes)

An [Elastic Kubernetes Service (EKS)](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html) cluster is required to deploy Tower via Kubernetes. See the [EKS documentation](https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html) to provision your own cluster. Your EKS cluster must satisfy the following requirements:

- **Kubernetes Version**: 1.19 or later

- **VPC Subnets**

  - At least 2 subnets, across two different Availability Zones.
  - Subnets must be tagged for [AWS Load Balancer Controller auto-discovery](https://docs.aws.amazon.com/eks/latest/userguide/network_reqs.html).
  - Public subnets must be configured to [auto-assign IPs on launch](https://aws.amazon.com/blogs/containers/upcoming-changes-to-ip-assignment-for-eks-managed-node-groups/).
  - Public and private subnets must allow egress traffic to the public internet.

- **RBAC**

  - Cluster must be created by a non-root user.
  - `aws-auth` must be updated to [allow access to additional IAM users/roles](https://docs.aws.amazon.com/eks/latest/userguide/add-user-role.html) (if needed).

- **Addons**
  - Install the [cert-manager](https://cert-manager.io/docs/).
  - Install the [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html).

:::note
The ingress that we provide for EKS assumes that your cluster supports:

    1. ALB provisioning via the [AWS Load Balancer Controller](https://docs.aws.amazon.com/eks/latest/userguide/aws-load-balancer-controller.html)
    2. ALB integration with the [Amazon Certificate Manager](https://aws.amazon.com/certificate-manager/)

    Additionally, the ingress assumes the presence of SSL certificates, DNS resolution, and ALB logging.

    If you have chosen not to use some or all of these features, you will need to modify the manifest accordingly before applying it to the cluster.
:::

## Optional prerequisites

### SSL certificate

An SSL certificate is required for your Tower instance to handle HTTPS traffic.

If you do not have a pre-existing SSL certificate, you can [request](https://docs.aws.amazon.com/acm/latest/userguide/gs.html) or [import](https://docs.aws.amazon.com/acm/latest/userguide/import-certificate.html) an SSL certificate into the [Amazon Certificate Manager](https://aws.amazon.com/certificate-manager/) (ACM).

:::caution
From Tower 22.1.1, HTTP-only implementations **must** set the `TOWER_ENABLE_UNSAFE_MODE=true` environment variable in the Tower hosting infrastructure to enable user login.
:::

### DNS

DNS is required to support human-readable domain names and load-balanced traffic.

If you do not have access to a pre-existing DNS service, you can use [Amazon Route 53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html).

### S3 bucket for Application Load Balancer (ALB) logs

ALB logs can be stored in an S3 Bucket. If you do not have a pre-configured S3 Bucket for ALB access log storage, you will need to [specify and configure](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html) a target Bucket.

## Detailed instructions

This section provides step-by-step instructions for some commonly used AWS services for Tower deployment. See the [AWS documentation](https://docs.aws.amazon.com/) for up-to-date instructions, and contact [AWS support](https://aws.amazon.com/contact-us/) if you have any issues with provisioning AWS resources.

### Fetch Tower config values from AWS Parameter Store

You can retrieve Tower configuration values remotely from the AWS Parameter Store.

1. Configure [AWS authentication](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html) to grant AWS Parameter Store access on your local host.
2. Retrieve the Tower container images and install Tower per the instructions at the top of this page.
3. The default value for `tower.application.name` is `tower-app`. This can be changed in your `tower.yml` configuration file. Note that your application name must be specified in the path to your configuration values in AWS Parameter Store (see step 5 below).
4. Set the `TOWER_ENABLE_AWS_SSM` environment variable to `true`. Alternatively, add the value `aws-ssm` to the `TOWER_ENABLE_PLATFORMS` variable.
5. Add configuration parameters to the AWS Parameter Store individually, using the format `/config/<application_name>/<cfg_path> : <cfg_value>`. For example:

   ```bash
   /config/tower-app/tower.logger.levels.com.amazonaws : "WARN"
   ```

6. Start or restart your Tower instance to confirm that the configuration value is fetched. The following entries should appear in your backend log:

   ```bash
   [main] - INFO  i.m.context.DefaultBeanContext - Reading bootstrap environment configuration
   [main] - INFO  i.m.d.c.c.DistributedPropertySourceLocator - Resolved 2 configuration sources from client: compositeConfigurationClient(AWS Parameter Store)
   ```

### Amazon SES

:::caution
If you're using Simple Email Service in sandbox mode, ensure that both the _sender_ and the _receiver_ email addresses are verified via AWS SES. Note that sandbox is not recommended for production use. See the [AWS docs](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html) for instructions to move out of the sandbox.
:::

1. Navigate to the [**Amazon Simple Email Service**](https://us-east-2.console.aws.amazon.com/ses) console.

2. In the navigation menu, select **SMTP Settings**.

3. Select **Create my SMTP Credentials**

4. Select **Create**.

5. Select **Show User SMTP Credentials** to copy your credentials, or select **Download Credentials**.

   :::caution
   The credentials (username and password) will not be shown to you again after this instance.
   :::

6. You will be automatically redirected to the IAM dashboard. Log back in to the [Amazon SES Console](https://us-east-2.console.aws.amazon.com/ses).

7. Select **Email Addresses** in the navigation menu. Then, select **Verify a new Email Address**.

8. A pop-up asking for your email should automatically appear. Once you type in your email address and select **Verify This Email Address**, you should receive a confirmation email from Amazon SES to confirm email address ownership.

9. Open the verification link in the message.

   :::caution
   The verification link is **only valid for 24 hours** after your original request for verification.
   :::

You can now use Amazon SES to send email from this address.

:::tip
To avoid emails sent from SES being flagged as spam, see [here](https://aws.amazon.com/premiumsupport/knowledge-center/ses-email-flagged-as-spam/).
:::

See the AWS documentation for more options, such as setting up an [Easy DKIM for a Domain](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-authentication-dkim-easy-setup-domain.html) or [Authentication Email with SPF](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-authentication-spf.html).

### Amazon RDS

1. Open the [Amazon RDS console](https://console.aws.amazon.com/rds/).

2. Select **Create database** -> **Standard create** -> **MySQL**.

3. Under **Edition**, select **MySQL Community** and any version under **5.7.x**, or **8.0.x**.

4. Enter the **DB cluster identifier** (e.g., `nftower-db`).

5. Enter the **Master username**, or keep the default.

6. Enter the **Master password**.

   - To use an automatically generated master password, select **Auto generate a password**.
   - To use a custom master password, deselect **Auto generate a password** and enter your password in **Master password** and **Confirm password**.

7. Under **Instance configuration**, select the **DB instance class** and instance type.

8. Under **Connectivity**, select the correct **VPC security group**. Confirm this with your AWS administrator.

9. Under **Additional configuration**, enter the **Initial database name** (e.g., `tower`).

10. Select **Create database**.

After your database is created:

1. Update the inbound rules for the underlying EC2 instance to allow MySQL connections.

2. Update `TOWER_DB_URL` in your configuration value with the database hostname.

### Amazon EC2

If you have never set up an Amazon EC2 instance for Linux, refer to [this guide](https://aws.amazon.com/ec2/getting-started/) to get started with Amazon EC2.

1. Open the [AWS Management console](https://us-east-2.console.aws.amazon.com/console/home).

2. Log in as an IAM user with your credentials.

3. Under **AWS services**, select **All Services**.

4. Under **Compute**, select **EC2**.

5. Select **Instances**, then **Launch instances**.

6. You will be asked to choose an Amazon Machine Image (AMI). Scroll to the middle of the page and select **Amazon Linux 2**.

7. Once you click **Select**, you will be redirected to **Step 2: Choose an Instance Type**.

8. Scroll down and select either **c5a.xlarge** or **c5.large** — these provide 4 CPUs and 8GB of RAM.

9. Select **Next: Configure Instance Details**.

10. If required, configure the instance details settings. Then, select **Next: Add Storage**.

11. The root storage should be 20GB. Configure this under **Size (GiB)**.

12. Select **Add Tags** (if required) to add case-sensitive key-value pairs (e.g., `key = Name` and `value = Webserver`).

13. Select **Next: Configure Security Group**.

14. Enter `nftower-sg` as the Security Group name.

15. Optionally, you can enter a description for your Security Group's name.

16. Configure the type of protocol settings. Note that the security group port must be configured to 8000.

17. Select **Review and Launch**.

18. Once you have reviewed your instance, select **Launch**.

19. Select an existing key pair or create a new one in the pop-up that appears.

    If you already have an existing key pair, select **Choose an existing key pair** and choose from the available options in the drop-down menu.

    If you do not have a key pair yet, select **Create a new keypair**. Enter a name, then select **Download Key Pair**.

    **Note:** once you download the key pair, store it in a secure and accessible location. You will not be able to download the file again after it is created.

20. Select **Launch Instances**.

21. Use the key pair to connect to the server using SSH and its public IP address. Terminal-based SSH is easier to use than browser-based SSH for copying and pasting text.

22. Enter the following commands to set up `docker` and `docker-compose`.

    ```bash
    # Install and start the docker engine
    sudo yum install docker git -y
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    sudo chkconfig docker on
    
    # Setup docker-compose
    sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    sudo mv /usr/local/bin/docker-compose /bin/docker-compose
    ```

Then, configure the AWS CLI and Docker as described in [Tower container images](#tower-container-images). The AWS CLI (v1) is pre-installed in Amazon Linux.
