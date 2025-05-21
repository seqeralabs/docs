## Administration of users, organizations, and memberships

title: "overview"

As a **Root user**, you can access a comprehensive overview of the users, workspaces, and organizations in the system from the **Admin panel**.

The Admin panel menu entry will only be accessible in the top right avatar menu if you are logged in as a Root user. This role should only be assigned to a system administrator, since it enables several high level and potentially risky operations.

### User administration

The User administration page lists all the users in the Tower database. From this page, you can:

#### Search users

The user search function allows you to find a specific user by name or email and perform various operations with that user.

#### Create a user

The Add user button above the table allows you to create a new user. If the new user email already exists in the system, the user creation will fail. Once the new user has been created, inform them that access has been granted.

#### Edit a user

By selecting a username from the table, you can edit the user's details, or delete the user.

### Membership administration

**Available from version 22.3.X**

From the user list, you have an overview of all the memberships for the selected user. The Membership administration page is reached by selecting the **Edit organizations** button. From here, you can list and search for all the organizations the user belongs to (as a member or as an owner), change the role of the user for a given membership, remove the user from an organization, or add the user to a new organization.

**Note:** You can only add users to an existing organization, and you cannot remove the last owner of an organization.

### Organization administration

The Organization administration page lists all the organizations in the Tower database. From this page, you can:

#### Search organizations

The organization search function allows you to find a specific organization by its name or email and perform various operations with that organization.

#### Create an organization

The Add organization button above the table allows you to create a new organization from scratch.

#### Edit an organization

By selecting an organization name from the table, you can edit the organization's details, or delete it.

#### Membership administration

**Available from version 22.3.X**

From the organizations list, you have an overview of all the memberships for the selected organization. Select the **Manage users** button to access the Membership administration page. From here, you can list and search for all the users that are members or owners of the selected organization, change the role of the user for the given membership, remove the member from the organization, or add a new user to the organization.

**Note:** You can only add existing users to an organization, and you cannot remove a membership if the user being removed is the last owner of the selected organization. To overcome this, promote another user to **Owner** before removing or demoting the last owner.
