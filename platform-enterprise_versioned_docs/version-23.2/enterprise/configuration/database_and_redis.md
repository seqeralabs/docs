---
title: "Databases"
description: Configuration options for Tower annd Redis databases
date: "21 Apr 2023"
tags: [database, redis, configuration]
---

## Database configuration

### SQL Database

The Database configuration differs based on your Tower deployment:

- If you use the MySQL container provided in the deployment files, it will create a MySQL user and database for you.
- If you use an external database service, you must create a MySQL user and database manually.

#### Generate User and Schema

If you choose to use an external database service, execute the SQL statements below to initialize the Tower database.

#### MySQL

```SQL
CREATE DATABASE tower;
ALTER DATABASE tower CHARACTER SET utf8 COLLATE utf8_bin;

CREATE USER 'tower' IDENTIFIED BY <password>;
GRANT ALL PRIVILEGES ON tower.* TO tower@'%' ;
```

#### MariaDB

```SQL
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, REFERENCES, INDEX, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, CREATE VIEW, SHOW VIEW, CREATE ROUTINE, ALTER ROUTINE, EVENT, TRIGGER on tower.* TO tower@'%';
```

### Tower configuration

Use environment variables (`tower.env` file) for database configuration in Tower.

:::caution
As of Tower v22.2.0, new and pre-existing MySQL configurations **must** use a new driver. Set `TOWER_DB_DRIVER=org.mariadb.jdbc.Driver` (in `tower.env`) or `driverClassName:org.mariadb.jdbc.Driver` (in `tower.yml`). All other MySQL-related `TOWER_DB_*` values should still be used.
:::

#### MySQL

<details>
  <summary>tower.env</summary>

```env

TOWER_DB_URL=jdbc:mysql://YOUR-DB-HOST:3306/tower
TOWER_DB_DRIVER=org.mariadb.jdbc.Driver
TOWER_DB_DIALECT=io.seqera.util.MySQL55DialectCollateBin
TOWER_DB_USER=tower
TOWER_DB_PASSWORD=tower
FLYWAY_LOCATIONS=classpath:db-schema/mysql

```

</details>

#### MariaDB

<details>
  <summary>tower.env</summary>

```env

TOWER_DB_URL=jdbc:mariadb://YOUR-DB-HOST:3306/tower
TOWER_DB_DRIVER=org.mariadb.jdbc.Driver
TOWER_DB_DIALECT=io.seqera.util.MariaDB10DialectCollateBin
TOWER_DB_USER=tower
TOWER_DB_PASSWORD=tower
FLYWAY_LOCATIONS=classpath:db-schema/mariadb

```

</details>

### Redis Database

:::note
As of Tower version 22.3, we officially support Redis version 6. Follow your cloud provider specifications to upgrade your instance.
:::

<details>
  <summary>tower.env</summary>

```env

TOWER_REDIS_URL=redis://YOUR_REDIS_HOST:6379
TOWER_REDIS_PASSWORD=your_redis_password

```

</details>
