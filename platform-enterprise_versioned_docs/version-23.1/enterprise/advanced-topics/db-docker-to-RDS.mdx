---
title: "Migrate Docker DB to Amazon RDS"
description: Migrate your Docker database to Amazon RDS
date: "12 Apr 2023"
tags: [rds, docker, database]
---

While [Docker Compose](../docker-compose.mdx) is a fast and convenient way to deploy your Tower instance, production deployments should have a robust database solution to minimize the risk of data loss.

## Points to consider before migration

1. **Target Database**

   You have options when choosing your new MySQL-compliant database. While the process is mostly the same, some of the commands will be different (example: [MariaDB on RDS](../configuration/database_and_redis.mdx#generate-user-and-schema)).

2. **How much data must be moved?**

   The data in your database must be exported from the MySQL container and imported to the new instance. Depending on the amount of data in your database and the amount of remaining EC2 EBS capacity, you may be able to save your data directly onto the instance, or be forced to make use of a service with more capacity (such as S3).

3. **Testing**

   What level of testing is required to determine the data has been properly migrated?

4. **Maintenance window**

   It is much simpler to initiate a migration once all transactions to the database cease than to do so while jobs are still running. Perform the migration at a time when an outage can occur and notify your users in advance.

5. **MySQL container volume retention**

   Seqera highly suggests retaining your original volume until you are 100% satisfied that the migration occurred without error. So long as the volume is kept, you can fall back to the MySQL container and ensure that Kinnate does not lose any of the material generated thus far.

## Prerequisite work

Before starting your migration, do the following:

1. Create an RDS MySQL-compliant instance and populate it with a [**tower user** and **tower database**](../configuration/database_and_redis.mdx#generate-user-and-schema).

2. Ensure your EC2 instance and database instance's Security Group(s) have been configured to allow MySQL traffic (default: Port 3306).

## Steps

:::note
These steps assume the following:

    1. You have sufficient EC2 instance space to store your data without requiring an S3 mounting solution like [S3fs](https://github.com/s3fs-fuse/s3fs-fuse).
    2. You have implemented a full maintenance outage.

:::

1. Connect to to the EC2 instance using **SSH** and navigate to Tower's **docker-compose** folder.

2. Shut down Tower:

   ```bash
   docker-compose down
   ```

3. Mount a new folder into the MySQL container for migration activities:

   1. Create a new folder to hold migration artefacts.

      ```bash
      mkdir ~/tower_migration
      ```

   2. Backup the database.

      ```bash
      sudo tar -zcvf ~/tower_migration/tower_backup.tar.gz ~/.tower/db/mysql
      ```

4. Modify the Tower **docker-compose.yml**:

   1. Add new volume entry for the db container.

   ```
   $HOME/tower_migration:/tower_migration
   ```

5. Restart Tower to ensure your changes were successful.

   ```bash
   docker-compose down
   ```

6. Stop all the non-MySQL containers.

   ```bash
   docker container stop <CONTAINER ID>
   ```

7. Exec onto the MySQL ontainer.

   ```bash
   docker exec -it <CONTAINER ID> /bin/bash
   ```

   1. Dump your data to disk.

      ```bash
      mysqldump -u tower -p --databases tower --no-tablespaces --set-gtid-purged=OFF > /tower_migration/tower_dumpfile.sql
      ```

   2. Exit the container.

8. Stop the MySQL container.

   ```bash
   docker container stop <CONTAINER ID>
   ```

9. Import the dump file into your new RDS instance.

   ```bash
   mysql --host <DB-HOST> --port 3306 -u tower -p tower < ~/tower_migration/tower_dumpfile.sql
   ```

10. Log on to the RDS instance and ensure that the tower database is populated with tables prefixed by 'tw\_'.

11. Modify the **tower.env** in the Tower docker folder:

    1. Comment out the existing TOWER_DB-\* variables.
    2. Add new entries [relevant to your database choice](../configuration/database_and_redis.mdx#configure-towerenv_1).
    3. Save and exit.

12. Restart Tower.

    ```bash
    docker-compose up
    ```

13. Confirm that Tower starts and that your data is available when you log in.

Congratulations! Your migration is complete and your testing can begin.
