Run `tw studios checkpoints -h` to view the required and optional fields for viewing checkpoints for a session.

List all checkpoints for an existing Studio session in a workspace. See [Session checkpoints](../studios/managing#studio-session-checkpoints) for more information.

```bash
tw studios checkpoints -i 19a3abbd -w community/showcase

Checkpoints at studio 19a3abbd at [community / showcase] workspace:

    ID   | Name                 | Author     | Date Created                  | Date Saved
  ------+----------------------+------------+-------------------------------+-------------------------------
    2010 | my_custom_named_ckpt | rob-newman | Fri, 31 Jan 2025 20:22:15 GMT | Fri, 31 Jan 2025 20:33:00 GMT
    2011 | foo_1738355617       | rob-newman | Fri, 31 Jan 2025 20:33:37 GMT | Fri, 31 Jan 2025 20:35:22 GMT
```
