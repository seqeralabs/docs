---
title: "Authentication"
description: "Login, logout, and session management for Seqera AI CLI"
date: "15 Dec 2025"
tags: [seqera-ai, cli, authentication, login]
---

:::caution
Seqera AI is currently in beta. Features and commands may change as we continue to improve the product.
:::

Seqera AI uses your Seqera Platform account for authentication. This page covers how to login, manage sessions, and logout.

## Login

Authenticate with your Seqera Platform account:

```bash
seqera login
```

This will:
1. Open your default browser to the Seqera login page
2. Prompt you to sign in with your Seqera Platform credentials
3. Automatically capture the authentication token
4. Display a success message in your terminal

```
Opening browser for authentication...
Successfully authenticated as user@example.com
```

## Check session status

View your current authentication status:

```bash
seqera status
```

This shows:
- Whether you're logged in
- Your authenticated email
- Session details

```
Logged in as: user@example.com
Session expires: 2025-12-16 14:30:00
```

## Logout

### Standard logout

Sign out from the current session:

```bash
seqera logout
```

This:
- Revokes your authentication token
- Removes locally stored credentials
- Requires re-authentication on next use

### Clear all sessions

If you've used multiple profiles or want to completely reset authentication:

```bash
seqera logout --all
```

This removes all stored credentials and session data.

## How credentials are stored

Seqera AI stores authentication tokens securely:

1. **Primary storage**: Your operating system's secure keychain
   - macOS: Keychain Access
   - Linux: Secret Service (GNOME Keyring, KWallet)
   - Windows: Windows Credential Manager

2. **Fallback storage**: If keychain access isn't available, tokens are stored in:
   ```
   ~/.config/seqera-ai/refresh-token.<profile>
   ```

Session metadata (email, login timestamp) is stored in:
```
~/.config/seqera-ai/auth-state.json
```

## Automatic token refresh

Seqera AI automatically refreshes your authentication token when needed. You don't need to re-login unless:

- You explicitly logout
- Your refresh token expires (typically after extended inactivity)
- Your Seqera Platform account permissions change

## Using access tokens (CI/CD)

For automated environments, you can provide a Seqera Platform access token directly:

```bash
seqera ai --token <your-platform-access-token>
```

To get a Platform access token:

1. Go to [Seqera Platform](https://cloud.seqera.io)
2. Click your profile icon and select **User tokens**
3. Click **Add token** and copy the generated token

:::caution
Access tokens provide full access to your Platform account. Store them securely and never commit them to version control. Use environment variables or secret management for CI/CD.
:::

You can also set the token via environment variable:

```bash
export TOWER_ACCESS_TOKEN=<your-platform-access-token>
seqera ai
```

## Troubleshooting

### Browser doesn't open

If the browser doesn't open automatically:

1. Check the terminal output for a URL
2. Copy and paste the URL into your browser manually
3. Complete authentication in the browser

### Login timeout

If authentication times out:

1. Ensure you have internet connectivity
2. Check that `https://seqera.io` is accessible
3. Try logging out and logging in again

### Token storage errors

If you see keychain-related errors:

1. Ensure your system keychain service is running
2. Check that you have permission to access the keychain
3. The CLI will automatically fall back to file-based storage

### Session expired

If your session has expired:

```bash
seqera logout
seqera login
```

## Next steps

- [Getting started](./getting-started) - Start using the AI assistant
- [Approval modes](./approval-modes) - Configure command execution settings
