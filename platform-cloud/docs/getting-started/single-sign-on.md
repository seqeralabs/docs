---
title: "Single sign-on (SSO)"
description: "Configure single sign-on for a Seqera Platform Cloud organization."
date created: "2026-03-10"
last updated: "2026-05-05"
tags: [sso, authentication, organization-settings, cloud-pro]
---

Single sign-on (SSO) lets a Seqera Platform Cloud organization use its corporate identity provider (IdP) for authentication. After SSO is enabled, users with a matching email domain are routed to the organization's IdP when they sign in.

SSO is available for **Cloud Pro** organizations and uses Auth0 self-service SSO to connect supported SAML and OpenID Connect (OIDC) identity providers.

## Before you begin

- SSO is available only for [Cloud Pro](https://seqera.io/pricing/) organizations.
- Only organization owners should configure or manage SSO. For more information, see [User roles](../orgs-and-teams/roles).
- Your organization must claim one email domain that is not already active for another organization.
- All existing organization members should use email addresses on the domain you want to claim. If members use other domains, Seqera blocks setup until that mismatch is resolved.
- Your organization must not have workspace collaborators. Remove collaborators or add them as organization members before you configure SSO.
- You need permission to configure your organization's IdP. Depending on the provider, you might need values such as a client ID, client secret, metadata URL, issuer URL, or signing certificate.

:::caution
After SSO is enabled, users on the claimed domain authenticate through the configured IdP. If the IdP is unavailable, those users can't fall back to another login method.
:::

## Organization settings states

In **Organization settings**, the SSO experience depends on your subscription tier:

- Cloud Pro organization owners see an option to configure SSO.
- Cloud Basic organization owners see an upgrade prompt stating that enterprise SSO is available on Cloud Pro, with a link to pricing information.

## Prepare users before setup

Before you configure SSO, resolve any users who can't authenticate through the domain you want to claim:

- Remove organization members whose email addresses don't use the claimed domain, or update their accounts to use email addresses on the claimed domain.
- Remove all workspace collaborators. If external users need continued access, add them to your IdP as guest or external accounts so they can sign in through SSO and be provisioned as organization members.
- If an existing collaborator already uses the claimed domain, add them as an organization member before you claim the domain.

Seqera blocks domain claiming when the organization has members with email addresses outside the claimed domain or existing workspace collaborators. The setup flow lists the affected users so you can resolve them before trying again.

Full claims-based provisioning for collaborator migration is planned for Q2 2026. Until then, external users must be added to the IdP and provisioned through the SSO sign-in flow.

## Configure SSO

1.  Open your organization, then select **Settings**.
2.  Choose the option to configure SSO and enter the email domain your organization wants to claim.
3.  Select **Generate setup URL**.
4.  Open the setup URL to start the Auth0 self-service SSO wizard.
5.  In the wizard, select your identity provider and complete the provider-specific configuration.
6.  Run the connection test in the Auth0 wizard to confirm that authentication works.
7.  Return to Seqera and select **Enable SSO** to activate the connection.

Seqera validates the configured Auth0 connection when you enable SSO. If the domain configured in Auth0 doesn't match the domain claimed in Seqera, activation fails. Correct the Auth0 configuration or delete the SSO configuration and create a new one with the correct domain.

The setup link expires after five days. After an IdP administrator opens the Auth0 access ticket, the ticket expires after five hours. If the wizard requires DNS verification for the claimed domain, verification can take up to 48 hours. If the ticket expires before verification or setup is complete, refresh the URL from the SSO settings page.

## Identity provider setup

The Auth0 self-service SSO wizard provides provider-specific instructions. Follow the wizard for the exact values and configuration steps required by your IdP.

For the current list of supported providers, see [Auth0 Self-Service Enterprise Configuration](https://auth0.com/docs/authenticate/enterprise-connections/self-service-enterprise-config).

Configure user or group access in your IdP before you run the connection test in Auth0.

## Sign-in behavior

When an organization has active SSO:

- The sign-in flow starts with an email-first step.
- Users whose email domain matches an active SSO connection are redirected to their corporate IdP.
- Users whose email domain does not match an SSO connection continue with the standard Seqera login options.
- Users who previously signed in with a social provider and have a matching SSO domain are redirected to the corporate IdP instead.

## User provisioning and account linking

When a user signs in through an active SSO connection for the first time:

- Existing Seqera accounts with the same email are linked to the SSO identity instead of creating a duplicate user.
- Users who first access Seqera after SSO is active are created through the SSO sign-in flow and automatically added to the organization as members.
- Existing organization memberships, workspace roles, ownership, and run history are preserved for linked accounts.
- Name and profile fields are populated from the IdP when those attributes are available.

Newly provisioned users receive the lowest organization-level role by default. Organization owners can then promote those users or grant workspace-level access as needed.

SSO applies only to users with the claimed email domain. External users who need workspace access must be added to the organization's IdP as guest or external accounts, provisioned as organization members through SSO, and granted the appropriate workspace access. Active SSO blocks new workspace collaborator assignments.

## Manage an existing connection

Organization owners can manage the SSO connection from **Organization settings**:

- Disable SSO enforcement without deleting the existing configuration.
- Re-enable a previously disabled connection if no other organization has activated the same domain.
- Generate a management link for IdP-side changes, such as certificate rotation or provider configuration updates.
- Delete the connection and release the claimed domain.

:::note
You can't change the claimed domain through the edit flow. To move SSO to a different domain, delete the existing connection and create a new one.
:::

## Audit log coverage

SSO activity is recorded in the audit log for compliance and troubleshooting. Audit coverage includes:

- SSO configuration changes such as create, enable, disable, and delete
- Identity-linking updates for existing users

## Troubleshooting

### The setup link isn't generated

Check whether your organization already contains members with email addresses outside the domain you are trying to claim or existing workspace collaborators.

### Setup is blocked because the organization has collaborators

Remove existing workspace collaborators before you configure SSO. If external users need continued access, add them to your IdP as guest or external accounts so they can sign in through SSO and be provisioned as organization members.

### The claimed domain is rejected

The domain may already be claimed by another organization. In that case, contact Seqera support.

### Users are not redirected to the corporate IdP

Confirm that SSO is enabled for the organization and that the user's email domain matches the claimed domain.

### An IdP user can't complete sign in

Confirm that the user has access to the application or connection configured in your IdP and that the user's email domain matches the domain claimed in Seqera.

### An existing user sees a linking problem during login

If Seqera can't link an existing account to the SSO identity, the user should contact an organization owner or Seqera support before trying again.
