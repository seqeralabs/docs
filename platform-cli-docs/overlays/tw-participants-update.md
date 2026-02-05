To update the role of a _Collaborator_ to `ADMIN` or `MAINTAIN`, use the `update` subcommand:

Command:

```bash
tw  participants update --name=collaborator@mydomain.com --type=COLLABORATOR --role=MAINTAIN
```

Example output:

```bash
Participant 'collaborator@mydomain.com' has now role 'maintain' for workspace 'shared-workspace'
```
