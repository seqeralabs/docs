Run `tw participants add -h` to view the required and optional fields for adding a participant.

To add a new _collaborator_ to the workspace, use the `add` subcommand. The default role assigned to a _collaborator_ is `Launch`.

See [Participant roles][participant-roles] for more information.

Command:

```bash
tw participants add --name=collaborator@mydomain.com --type=MEMBER
```

Example output:

```bash
User 'collaborator' was added as participant to 'shared-workspace' workspace with role 'launch'
```
