---
title: "Configuration overview"
description: Overview of Tower configuration options
date: "21 Apr 2023"
tags: [configuration]
---

The configuration of your Tower instance can be controlled using various environment variables specified in the [tower.env](../_templates/docker/tower.env) and [tower.yml](../_templates/docker/tower.yml) files. Note that a number of core Tower configuration values must be specified using environment variables in `tower.env`.

In the [tower.yml](../_templates/docker/tower.yml) file, configuration options are objects nested within the `tower` object. This is formatted as follows:

```yaml
tower:
---
mail:
  from: "hello@foo.com"
  smtp:
    host: "your.smtphost.com"
```

The following parameters control the Tower configuration and deployment:

## Generic options

Specify general Tower configuration values in your environment variables. The boolean value to enable user workspaces can also be specified in your [tower.yml](../_templates/docker/tower.yml) file.

<details>
  <summary>Environment variables</summary>

```env
`TOWER_SERVER_URL`: Server URL e.g. `https://tower.your-company.com` (**required**).

`TOWER_CONTACT_EMAIL`: Sysadmin email contact e.g. `tower@your-company.com` (**required**).

`TOWER_LICENSE`: Your Tower license key. If you don't have a license key, contact [Seqera sales team](mailto:sales@seqera.io)  (**required**).

`TOWER_APP_NAME`: Application name (default: `Tower`).

`TOWER_CONFIG_FILE`: Custom path for the `tower.yml` file.

`TOWER_LANDING_URL`: Customize the landing page for the application (requires Tower 21.10.1 or later).

`TOWER_CRON_SERVER_PORT`: Define the HTTP port usd by the Tower cron service (default: `8080`, requires Tower 21.06.1 or later).

`TOWER_USER_WORKSPACE_ENABLED`: Enable or disable the showing of the user private workspace context. (default: `true`, requires Tower 22.1.0 or later).

`TOWER_ENABLE_ARM64`: Enable support for ARM64 CPU architectures. Required to enable Graviton in AWS Batch compute environments.
```

</details>

<details>
  <summary>tower.yml</summary>

```yaml
tower:
  admin:
    user-workspace-enabled: true
```

</details>

## Tower and Redis Databases

For further information, see [Tower and Redis Databases](./database_and_redis).

:::note
As of Tower version 22.3, we officially support Redis version 6. Follow your cloud provider specifications to upgrade your instance.
:::

<details>
  <summary>Environment variables</summary>

```env
- `TOWER_DB_URL`: Database JDBC connection URL, e.g., `jdbc:mysql://localhost:3307/tower` (**required**).

- `TOWER_DB_USER`: Database user name (**required**).

- `TOWER_DB_PASSWORD`: Database user password (**required**).

- `TOWER_DB_DRIVER`: Database JDBC driver class name (default: `org.mariadb.jdbc.Driver`).

- `TOWER_DB_DIALECT`: Database SQL Hibernate dialect (default: `io.seqera.util.MySQL55DialectCollateBin`).

- `TOWER_DB_MIN_POOL_SIZE`: Database min connections pool size, e.g., 5 (default: 5).

- `TOWER_DB_MAX_POOL_SIZE`: Database max connections pool size, e.g., 20 (default: 10).

- `TOWER_DB_MAX_LIFETIME`: Database max lifespan of connections in milliseconds (default: 1800000)

- `TOWER_REDIS_URL`: Custom Redis instance connection URL (default: `redis://redis:6379`, requires Tower 21.06.1 or later).

- `TOWER_REDIS_PASSWORD`: Custom Redis password to connect to Redis instance above.
```

</details>

## Mail Server

For further information, see [Mail server](./mail_server).

<details>
  <summary>Environment variables</summary>

```env
- `TOWER_SMTP_HOST`: SMTP server host name e.g. `email-smtp.eu-west-1.amazonaws.com` (**required**)
- `TOWER_SMTP_USER`: SMTP server username (**required**)
- `TOWER_SMTP_PASSWORD`: SMTP server user password (**required**)
- `TOWER_SMTP_PORT`: SMTP server port (default: `587`)
- `TOWER_SMTP_AUTH`: SMTP server authentication (default: `true`)
```

</details>
<details>
  <summary>tower.yml</summary>

```yaml
mail:
  smtp:
    host: "your.smtphost.com" # SMTP server host name (required)
    user: "your_smtp_user" # SMTP server username
    password: "your_smtp_password" # SMTP server user password
    port: "587" # SMTP server port (default: 587)
    auth: "true" # SMTP server authentication (default: true)
```

</details>

## Cryptographic options

- `TOWER_JWT_SECRET`: Secret used to generate the login JWT token. Use a long random string (35 characters or more) (**required**).
- `TOWER_CRYPTO_SECRETKEY`: Secret key used to encrypt user credentials. Use a long random string (**required**).

:::caution
The `TOWER_CRYPTO_SECRETKEY` should not be modified or altered across Tower starts, otherwise the application won't be able to decrypt the corresponding data. Use different keys for independent installations (e.g. test and production). Make sure to store a copy in a safe location.
:::

## Compute environments

For further information,see [Compute environments](./compute_environments).

- `TOWER_ENABLE_PLATFORMS`: Comma separate list of execution backends to be enabled (**required**).
- `MICRONAUT_ENVIRONMENTS`: Enable specific configuration profile for the Micronaut backend service (**required**).
- `TOWER_FORGE_PREFIX`: Override the default `TowerForge` prefix appended to AWS resources created by Batch Forge with a custom value.

<!--- Llewellyn 19-4-2023: I propose leaving out this entire platform-specific section as it has a dedicated advanced topics page, and IAM stuff is covered extensively both here and in help docs by now. @Graham, thoughts?  >
## Platform-specific options

For further information, please refer to the [advanced topics](../advanced-topics/use-iam-role) page.

Configure Tower to use an IAM Role, instead of providing IAM User credentials (AWS only):

<details>
  <summary>tower.env</summary>

```env

TOWER_ALLOW_INSTANCE_CREDENTIALS=true

```

</details>

<details>
  <summary>tower.yml</summary>

  ```yaml
tower:
  allowInstanceCredentials: true
  ```

</details>

<!--->

## Nextflow launch container

- `TOWER_LAUNCH_CONTAINER`: Container image to run Nextflow execution (requires Tower 20.10.2 or later)

## Tower API

For further information, please refer [Tower API](./tower_api) page.

- `TOWER_ENABLE_OPENAPI`: Set `true` to enable OpenAPI documentation endpoint.

## Admin panel

:::note
This feature is available in Tower 21.10.3, 21.12.1, and 22.1.0 (or later).
:::

To enable access to the application admin panel for specific users i.e. `root users`, add the `TOWER_ROOT_USERS` variable to your `tower.env` file (or `root-users` to your `tower.yml`). You can specify the user email IDs, separated by commas `,` as value for this variable. For example:

<details>
  <summary>Environment variables</summary>

```env
TOWER_ROOT_USERS=user1@myorg.com,user2@myorg.com
```

</details>

<details>
  <summary>tower.yml</summary>

```yaml
tower:
  admin:
    root-users: "user1@myorg.com,user2@myorg.com"
```

</details>

## Custom navigation menu

To modify the Tower top navigation menu and add custom menu items, add a configuration snippet similar the one shown below in the [tower.yml](../_templates/docker/tower.yml) configuration file:

```yaml
tower:
  navbar:
    menus:
      - label: "My Community"
        url: "https://host.com/foo"
      - label: "My Pipelines"
        url: "https://other.com/bar"
```

## Logging

To customize the log detail pattern displayed when using `STDOUT`, use the `TOWER_LOG_PATTERN` environment variable to specify a pattern in the Logback pattern layout encoding syntax. See [here](https://logback.qos.ch/manual/layouts.html#conversionWord) for a reference of the full Logback pattern syntax.

```env
TOWER_LOG_PATTERN=%d{MMM-dd HH:mm:ss.SSS} [%t] %X{ip:--} %-5level %logger{36} - %msg%n}  # Default logging pattern shown
```

To change the output format of Tower logs, the `TOWER_LOG_APPENDER_TYPE` variable can be used. The available logging formats are `STDOUT` (default) and `JSON`.

```env
TOWER_LOG_APPENDER_TYPE=JSON
```
