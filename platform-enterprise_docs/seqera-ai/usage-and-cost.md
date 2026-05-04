---
title: "Usage and cost"
description: "Understand Co-Scientist usage and inference costs in Seqera Platform Enterprise"
date created: "2026-05-04"
tags: [seqera-ai, co-scientist, enterprise, ai]
---

Co-Scientist in Seqera Platform Enterprise runs in your self-hosted environment and uses your configured inference provider for Claude model access.

Enterprise deployments do not use Seqera Cloud credit balances or the Cloud credit request flow. Instead, your organization manages inference access, limits, and costs through AWS Bedrock or Anthropic API. AWS Bedrock is recommended for Enterprise deployments.

## What users see

In Enterprise deployments, Co-Scientist does not enforce Seqera Cloud credit balances. If your session is blocked because of usage limits, contact your Seqera Platform administrator. The administrator can verify the agent backend configuration and inference provider account.

## What administrators manage

Administrators should manage:

- AWS Bedrock model access, inference profiles, quotas, and IAM roles, when Bedrock is used.
- Anthropic API keys, usage limits, and billing, when direct Anthropic API access is used.
- Amazon Titan embedding access, if improved documentation search is enabled.
- Any organization-specific policies for Co-Scientist availability.

For deployment configuration, see [Co-Scientist](../enterprise/install-seqera-ai.md).

## Learn more

- [Co-Scientist in the Seqera CLI](./index.md): Co-Scientist overview
- [Authentication](./authentication.md): Log in, log out, and session management
- [Use cases](./use-cases.md): Seqera CLI use cases
