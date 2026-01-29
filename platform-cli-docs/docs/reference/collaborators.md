---
title: tw collaborators
description: Manage organization collaborators
---

# tw collaborators

Manage organization collaborators.

Run `tw collaborators -h` view all the required and optional fields for managing organization collaborators.

## tw collaborators list

List organization collaborators.

Command:

```bash
tw collaborators list [OPTIONS]
```

### Options

| Option | Description | Required | Default |
|--------|-------------|----------|----------|
| `-o`, `--organization` | Organization name or identifier | Yes | `null` |
| `-f`, `--filter` | Filter members by username prefix | No | `null` |
| `--page` | Page number for paginated results (default: 1) | No | `null` |
| `--offset` | Row offset for paginated results (default: 0) | No | `null` |
| `--max` | Maximum number of records to display (default: ) | No | `null` |

Command:

```bash
tw collaborators list -o seqeralabs

Collaborators for 88848180287xxx organization:
```

Example output:

```bash
ID              | Username             | Email
  -----------------+----------------------+--------------------
    13136942731xxx  | external_user1       | user1@domain.com
    127726720173xxx | external_user2       | user2@domain.com
    59151157784xxx  | external_user3       | user3@domain.com
    132868466675xxx | external_user4       | user4@domain.com
    178756942629xxx | external_user5       | user5@domain.com
```
