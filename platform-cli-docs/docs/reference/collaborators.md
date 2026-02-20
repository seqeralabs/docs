---
title: tw collaborators
description: Manage organization collaborators
---

# tw collaborators

Manage organization collaborators.

Run `tw collaborators -h` view all the required and optional fields for managing organization collaborators.

## tw collaborators list

List organization collaborators.

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

### Example

Command:

```bash
tw collaborators list -o seqeralabs
```

Example output:

```bash
Collaborators for 888481802873456 organization:

ID              | Username             | Email
  -----------------+----------------------+--------------------
    131369427314567  | external_user1       | user1@domain.com
    127726720173456 | external_user2       | user2@domain.com
    591511577845678  | external_user3       | user3@domain.com
    132868466675789 | external_user4       | user4@domain.com
    178756942629012 | external_user5       | user5@domain.com
```
