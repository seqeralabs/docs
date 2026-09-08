Run `tw teams members -h` to view the commands for managing team members.

Add an existing username or a new user's email address:

```console
$ tw teams members -t Testing -o TestOrg2 add -m user1@domain.com

Member 'user1' added to team 'Testing' with id '243206491381406'
```

Delete a team member by username:

```console
$ tw teams members -t Testing -o TestOrg2 delete -m user1

Team member 'user1' deleted at 'Testing' team
```
