---
title: "AWS Parameter Store"
description: Configure values for Seqera configuration with AWS Parameter Store
date: "21 Apr 2023"
tags: [configuration, aws, parameter, securestring]
---

From version 23.1, Seqera Platform Enterprise can fetch configuration values from the AWS Parameter Store.

:::caution
`TOWER_DB_USER`, `TOWER_DB_PASSWORD`, and `TOWER_DB_URL` values must be specified using **environment variables** during initial Seqera Enterprise deployment in a new environment. A new installation will fail if DB values are only defined in `tower.yml` or the AWS Parameter Store.

After the database has been created, these values can be added to AWS Parameter Store entries and removed from your environment variables.
:::

## Configuration values not supported in AWS Parameter Store

Due to the order of operations when deploying Seqera Enterprise, some configuration values can only be retrieved from **environment variables** (`tower.env`). The following configuration values are not supported by AWS Parameter Store and must be set as environment variables:

::table{file=configtables/req_env_vars.yml}

## Configure Seqera to use AWS Parameter Store values

To enable Seqera use AWS Parameter Store values:

1. Grant [AWS Parameter Store permissions](https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-paramstore-access.html) to your Seqera host instance.
2. Add `TOWER_ENABLE_AWS_SSM=true` in the `tower.env` configuration file.
3. Create individual parameters in the AWS Parameter Store (see below).
4. Start your Seqera instance and confirm the following entries appear in the **backend** container log:

```bash
[main] - INFO  i.m.context.DefaultBeanContext - Reading bootstrap environment configuration
[main] - INFO  i.m.d.c.c.DistributedPropertySourceLocator - Resolved 2 configuration sources from client: compositeConfigurationClient(AWS Parameter Store)
```

## Create configuration values in AWS Parameter Store

Store Seqera configuration values as individual parameters in the AWS Parameter Store.

:::caution
The default application name is `tower-app`. To deploy multiple instances from the same Seqera Enterprise account, set a custom application name for each instance with the `micronaut.application.name` value in your `tower.yml` configuration file.
:::

We recommend storing sensitive values, such as database passwords, as SecureString-type parameters. These parameters require additional IAM KMS key permissions to be decrypted.

Seqera does not support StringList parameters. Configuration parameters with multiple values can be created as comma-separated lists of String type.

To create Seqera configuration parameters in AWS Parameter Store, do the following:

1. Navigate to the **Parameter Store** from the **AWS Systems Manager Service** console.
2. From the **My parameters** tab, select **Create parameter** and populate as follows:

| Field | Description |
| ----- | ----------- |
| **Name** | Use the format `/config/<application_name>/<cfg_path>`. `<cfg_path>` follows the `tower.yml` nesting hierarchy. See the [configuration overview](./overview) for specific paths.<br/>**Example: `/config/tower-app/mail.smtp.password : <your_smtp_password>`** |
| **Description** | (Optional) Description for the parameter. |
| **Tier** | Select **Standard**. |
| **Type** | Use **SecureString** for sensitive values like passwords and tokens. Use **String** for everything else. |
| **Data type** | Select **text**. |
| **Value** | Enter a plain text value (this is the configuration value used in Seqera). |
