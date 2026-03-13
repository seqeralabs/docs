Run `tw teams members -h` to view the fields and additional commands for managing team members.

To add a new team member, include an existing username or new user email:

```bash
tw teams members -t Testing -o TestOrg2 add -m user1@domain.com

Member 'user1' added to team 'Testing' with id '243206491381406'
```

To delete a team member, include the member's username:

```bash
tw teams members -t Testing -o TestOrg2 delete -m user1

Team member 'user1' deleted at 'Testing' team
```
