# Command Output Collection

## Instructions

For each command below:
1. Run the command from `completed-commands.md`
2. Copy the complete output (including the command itself)
3. Paste it in the corresponding section below

---

## Actions (6 commands)

### tw actions list
```bash
# Command:
tw actions list -w 235786397748080

# Output:
  Actions for sai-user user:

     ID                     | Name  | Endpoint                                                                                      | Status | Source
    ------------------------+-------+-----------------------------------------------------------------------------------------------+--------+--------
     5S5vQMXCry7etfDgXIPuJp | Testy | https://api.cloud.seqera.io/actions/5S5vQMXCry7etfDgXIPuJp/launch?workspaceId=235786397748080 | ACTIVE | tower

```

### tw actions view
```bash
# Command:
tw actions view -n Testy -w 235786397748080

# Output:
  Details for action 'Testy'

    --------------+-------------------------------------------------------------------
     ID           | 5S5vQMXCry7etfDgXIPuJp
     Name         | Testy
     Status       | ACTIVE
     Pipeline URL | https://github.com/nextflow-io/rnaseq-nf
     Source       | tower
     Hook URL     | https://api.cloud.seqera.io/actions/5S5vQMXCry7etfDgXIPuJp/launch
     Last event   | never
     Date created | Tue, 10 Jun 2025 09:02:12 GMT
     Last event   | never
     Labels       | No labels found

  Configuration:

     {
       "id" : "6BCuYRX63Zx4AJJvTDJT6D",
       "computeEnvId" : "78nvEJdcmDtCGtNL2HTBE5",
       "pipeline" : "https://github.com/nextflow-io/rnaseq-nf",
       "workDir" : "s3://llew-manual-test",
       "configProfiles" : [ ],
       "userSecrets" : [ ],
       "workspaceSecrets" : [ ],
       "resume" : false,
       "pullLatest" : false,
       "stubRun" : false,
       "dateCreated" : "2025-06-10T09:02:12Z"
     }

```

### tw actions add
```bash
# Command:
tw actions add tower -n example-hello-action --pipeline=https://github.com/nextflow-io/hello -w 235786397748080

# Output:
  Pipeline action 'example-hello-action' added at [seqeratest_kitorg1 / seqeratest_kitspace1] workspace with id '4DnYRApc8wadi34omlzsY6'
```

NOTE: Add to docs and cli --help that the pipeline URL is required, not saved name, not ID

### tw actions update
```bash
# Command:
tw actions update -n example-hello-action --status disabled -w 235786397748080

# Output:
  Pipeline action 'example-hello-action' updated at [seqeratest_kitorg1 / seqeratest_kitspace1] workspace with id '4DnYRApc8wadi34omlzsY6'
```

### tw actions delete
```bash
# Command:
tw actions delete -n example-hello-action -w 235786397748080

# Output:
  Pipeline action 'example-hello-action' deleted at [seqeratest_kitorg1 / seqeratest_kitspace1] workspace
```

### tw actions labels
```bash
# Command:
tw actions labels -n Testy -w 235786397748080 test-environment,label2

# Output:
 'set' labels on 'action' with id '5S5vQMXCry7etfDgXIPuJp' at 235786397748080 workspace
```

NOTE: Requires EITHER action name (-n) or action ID (-i), and labels must be added to the end of the command.
---

## Compute Environments (6 commands)

### tw compute-envs list
```bash
# Command:
tw compute-envs list -w 235786397748080

# Output:
  Compute environments at [seqeratest_kitorg1 / seqeratest_kitspace1] workspace:

       ID                     | Status    | Platform     | Name        | Last activity
    --------------------------+-----------+--------------+-------------+-------------------------------
       19hXq5yl2LSpfI0cLLkxOH | AVAILABLE | eks-platform | AWS-EKS     | never
       1AlFRv7CadTwEt9YGFdlWL | AVAILABLE | gke-platform | gke-ce      | never
       2UIQR46b2dghUWzaphD2AW | AVAILABLE | aws-batch    | AWSBatchCE  | Thu, 10 Jul 2025 11:24:20 GMT
       438rqlZ8EKrZ7d9OYqMbrY | AVAILABLE | aws-cloud    | AWSCloud    | never
       55e3MYNBhWN8DIQhWxhVf5 | AVAILABLE | gke-platform | GKE-CE2     | never
       6qW8p3DD3opVUeQVmK9TOe | AVAILABLE | google-batch | GCPBatch    | never
     * PVgfUYdWrBYVjKlImSsRZ  | AVAILABLE | aws-cloud    | AWSCloudCE2 | never
```

### tw compute-envs view
```bash
# Command:
tw compute-envs view -n AWSBatchCE -w 235786397748080

# Output:
  Compute environment at [seqeratest_kitorg1 / seqeratest_kitspace1] workspace:

    ---------------+-------------------------------
     ID            | 2UIQR46b2dghUWzaphD2AW
     Name          | AWSBatchCE
     Platform      | aws-batch
     Last updated  | Thu, 10 Jul 2025 11:23:28 GMT
     Last activity | Thu, 10 Jul 2025 11:24:20 GMT
     Created       | Thu, 10 Jul 2025 11:22:49 GMT
     Status        | AVAILABLE
     Labels        |

  Configuration:

     {
       "discriminator" : "aws-batch",
       "region" : "eu-west-2",
       "executionRole" : "arn:aws:iam::128997144437:role/TowerForge-2UIQR46b2dghUWzaphD2AW-ExecutionRole",
       "waveEnabled" : true,
       "fusion2Enabled" : true,
       "nvnmeStorageEnabled" : true,
       "fusionSnapshots" : false,
       "forge" : {
         "type" : "SPOT",
         "minCpus" : 0,
         "maxCpus" : 500,
         "gpuEnabled" : false,
         "instanceTypes" : [ ],
         "subnets" : [ ],
         "securityGroups" : [ ],
         "disposeOnDeletion" : true,
         "allowBuckets" : [ ],
         "efsCreate" : false,
         "dragenEnabled" : false,
         "fargateHeadEnabled" : false
       },
       "workDir" : "s3://llew-manual-test",
       "environment" : [ ]
     }
```

### tw compute-envs update
```bash
# Command:
tw compute-envs update -n AWSCloudCE2 --new-name AWSCloud-primary -w 235786397748080

# Output:
  Compute environment 'AWSCloudCE2' updated at [seqeratest_kitorg1 / seqeratest_kitspace1] workspace
```

### tw compute-envs primary get
```bash
# Command:
tw compute-envs primary get -w 235786397748080

# Output:
  Primary compute environment for workspace '[seqeratest_kitorg1 / seqeratest_kitspace1]' is 'AWSCloud-primary (PVgfUYdWrBYVjKlImSsRZ)'
```

### tw compute-envs primary set
```bash
# Command:
tw compute-envs primary set -n AWS-EKS -w 235786397748080

# Output:
  Primary compute environment for workspace '[seqeratest_kitorg1 / seqeratest_kitspace1]' was set to 'AWS-EKS (19hXq5yl2LSpfI0cLLkxOH)'
```

### tw compute-envs export
```bash
# Command:
tw compute-envs export -n AWSCloud-primary -w 235786397748080 > /tmp/cloudce-export.json

# Output:
(empty)

```

### tw compute-envs import
```bash
# Command:
tw compute-envs import -n example-imported-ce -c 11gg7Owxx6VyhZTbx50c3B /tmp/cloudce-export.json -w 235786397748080

# Output:
  New AWS-CLOUD compute environment 'example-imported-ce' added at [seqeratest_kitorg1 / seqeratest_kitspace1] workspace
```

---

## Credentials (1 command)

### tw credentials update
```bash
# Command:
tw credentials update aws -n aws-credentials -a AKIAR4CGUG52QIHS4QBQ -w 235786397748080

# Output:
  AWS credentials 'aws-credentials' updated at [seqeratest_kitorg1 / seqeratest_kitspace1] workspace
```

---

## Datasets (1 command)

### tw datasets url
```bash
# Command:
tw datasets url -i 7UCNLNb4ZeZqwH9d1I5A09 -w 235786397748080

# Output:
  Dataset URL

  -----------

  https://api.cloud.seqera.io/workspaces/235786397748080/datasets/7UCNLNb4ZeZqwH9d1I5A09/v/1/n/samplesheet.csv
```

---

## Labels (1 command)

### tw labels update
```bash
# Command:
tw labels update -i 69823456151265 -n label3 -w 235786397748080

# Output:
 Label with id '69823456151265' at '235786397748080' workspace updated to 'label3'

```

---

## Members (1 command)

### tw members leave
```bash
# Command:
tw members leave -o HackHackyHackHack

# Output:
  You have been removed from organization 'HackHackyHackHack'
```

---

## Organizations (4 commands)

### tw organizations list
```bash
# Command:
tw organizations list

# Output:
  Organizations for sai-user user:

     ID              | Name
    -----------------+------------------------------
     95552324696379  | SeqeraLabs-ManagedCompute
     187965850823746 | community
     43959530048275  | scidev
     171340222520856 | seqera-academy
     88848180287559  | seqeralabs
     226277939525011 | seqeratest_cli
     249242354779282 | seqeratest_kitorg1
     38551448290956  | seqeratest_your-organization
```

### tw organizations view
```bash
# Command:
tw organizations view -n seqeratest_kitorg1

# Output:
  Details for organization 'My organization LLC'

   -------------+---------------------------------------------------
    ID          | 249242354779282
    Name        | seqeratest_kitorg1
    Full Name   | My organization LLC
    Description | Organization created with seqerakit CLI scripting
    Website     | https://mydomain.com/
```

### tw organizations update
```bash
# Command:
tw organizations update -n seqeratest_kitorg1 --new-name=seqeratest_kitorg1-updated

# Output:
  Organization 'seqeratest_kitorg1' was updated
```

### tw organizations delete
```bash
# Command:
tw organizations delete -n seqeratest_cli

# Output:
  Organization 'seqeratest_cli' deleted
```

---

## Participants (2 commands)

### tw participants delete
```bash
# Command:
tw participants delete -n llewellyndaniel -t MEMBER -w 235786397748080

# Output:
  Participant 'llewellyndaniel' was removed from 'seqeratest_kitspace1' workspace
```

NOTE: Requires participant name, type, and workspace ID

### tw participants leave
```bash
# Command:
tw participants leave -w seqeratest_your-organization/TestWorkspace1

# Output:
  You have been removed as a participant from 'TestWorkspace1' workspace
```

---

## Pipelines (6 commands)

### tw pipelines list
```bash
# Command:
tw pipelines list -w 235786397748080

# Output:
  Pipelines at [seqeratest_kitorg1-updated / seqeratest_kitspace1] workspace:

     ID              | Name                 | Repository                           | Visibility
    -----------------+----------------------+--------------------------------------+------------
     111250478007869 | rnaseq4              | https://github.com/nf-core/rnaseq    | SHARED
     170460572761871 | nf-core-rnaseq       | https://github.com/nf-core/rnaseq    | SHARED
     20732368230187  | rnaseq2              | https://github.com/nf-core/rnaseq    | SHARED
     222831045090141 | nextflow-hello-saved | https://github.com/nextflow-io/hello | SHARED
     50807092010855  | rnaseqapitest        | https://github.com/nf-core/rnaseq    | SHARED
     95959005971783  | rnaseq3              | https://github.com/nf-core/rnaseq    | SHARED
```

### tw pipelines view
```bash
# Command:
tw pipelines view -n nextflow-hello-saved -w 235786397748080

# Output:
  Pipeline at [seqeratest_kitorg1-updated / seqeratest_kitspace1] workspace:

    --------------+--------------------------------------
     ID           | 222831045090141
     Name         | nextflow-hello-saved
     Description  |
     Repository   | https://github.com/nextflow-io/hello
     Compute env. | deleted-1019427855492350
     Labels       | label3

  Configuration:

     {
       "id" : "6xKeY5O5QK8QA8uZWPyUok",
       "computeEnvId" : "vbWA6HWSRl8TOMUOWVcTp",
       "pipeline" : "https://github.com/nextflow-io/hello",
       "workDir" : "s3://llew-seqerakit-1/work",
       "userSecrets" : [ ],
       "workspaceSecrets" : [ ],
       "resume" : false,
       "pullLatest" : false,
       "stubRun" : false,
       "dateCreated" : "2025-01-28T19:32:07Z"
     }
```

### tw pipelines delete
```bash
# Command:
tw pipelines delete -n rnaseq2 -w 235786397748080

# Output:
  Pipeline 'rnaseq2' deleted at [seqeratest_kitorg1-updated / seqeratest_kitspace1] workspace
```

### tw pipelines export
```bash
# Command:
tw pipelines export -n nf-hello-2026 -w 235786397748080 hello-pipeline-export2.json
# Output:
  Pipeline exported into 'hello-pipeline-export2.json'
```

### tw pipelines import
```bash
# Command:
tw pipelines import -n nf-hello-2026-imported -w 235786397748080 hello-pipeline-export2.json

# Output:
  New pipeline 'nf-hello-2026-imported' added at [seqeratest_kitorg1-updated / seqeratest_kitspace1] workspace
```

### tw pipelines labels
```bash
# Command:
tw pipelines labels -n nf-hello-2026 -w 235786397748080 newlabel

# Output:
 'set' labels on 'pipeline' with id '276926545173754' at 235786397748080 workspace
```

---

## Runs (4 commands)

### tw runs cancel
```bash
# Command:
tw runs cancel -i epPOfRr1Ue34p -w 235786397748080

# Output:
  Pipeline run 'epPOfRr1Ue34p' canceled at [seqeratest_kitorg1-updated / seqeratest_kitspace1] workspace
```

### tw runs delete
```bash
# Command:
tw runs delete -i 47tY0tv6WygLHg -w 235786397748080

# Output:
  Pipeline run '47tY0tv6WygLHg' deleted at [seqeratest_kitorg1-updated / seqeratest_kitspace1] workspace
```

### tw runs relaunch
```bash
# Command:
tw runs relaunch -i epPOfRr1Ue34p

# Output:
  Workflow 1kkHLW6UsRp14y submitted at [seqeratest_kitorg1-updated / seqeratest_kitspace1] workspace.

    https://cloud.seqera.io/orgs/seqeratest_kitorg1-updated/workspaces/seqeratest_kitspace1/watch/1kkHLW6UsRp14y/watch/1kkHLW6UsRp14y
```

### tw runs labels
```bash
# Command:
tw runs labels -i epPOfRr1Ue34p newlabel

# Output:
 'set' labels on 'run' with id 'epPOfRr1Ue34p' at 235786397748080 workspace
```

---

## Secrets (5 commands)

### tw secrets list
```bash
# Command:


# Output:


```

### tw secrets add
```bash
# Command:


# Output:


```

### tw secrets view
```bash
# Command:


# Output:


```

### tw secrets update
```bash
# Command:


# Output:


```

### tw secrets delete
```bash
# Command:


# Output:


```

---

## Studios (3 commands)

### tw studios templates
```bash
# Command:


# Output:


```

### tw studios checkpoints
```bash
# Command:


# Output:


```

### tw studios add-as-new
```bash
# Command:


# Output:


```

---

## Teams (1 command)

### tw teams members
```bash
# Command:


# Output:


```

---

## Workspaces (4 commands)

### tw workspaces view
```bash
# Command:


# Output:


```

### tw workspaces update
```bash
# Command:


# Output:


```

### tw workspaces delete
```bash
# Command:


# Output:


```

### tw workspaces leave
```bash
# Command:


# Output:


```

---

## Status Tracker

- [ ] Actions (6 commands)
- [ ] Compute Environments (6 commands)
- [ ] Credentials (1 command)
- [ ] Datasets (1 command)
- [ ] Labels (1 command)
- [ ] Members (1 command)
- [ ] Organizations (4 commands)
- [ ] Participants (2 commands)
- [ ] Pipelines (6 commands)
- [ ] Runs (4 commands)
- [ ] Secrets (5 commands)
- [ ] Studios (3 commands)
- [ ] Teams (1 command)
- [ ] Workspaces (4 commands)

**Total**: 45 commands
