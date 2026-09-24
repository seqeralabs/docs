---
title: "Bedrock setup"
description: "Configure Amazon Bedrock model access, IAM permissions, and the AgentCore runtime for Co-Scientist"
date created: "2026-08-19"
last updated: "2026-09-22"
tags: [co-scientist, aws, iam, installation]
---

Co-Scientist runs Claude inference in your own AWS account through Amazon Bedrock. Before you install the Helm charts, enable model access, grant the IAM permissions the agent backend needs, and create an AgentCore runtime if you use sandboxed sessions.

Complete this page after the [prerequisites](./prerequisites.md) and before [installation](./installation.mdx).

:::info[**Prerequisites**]{#prerequisites}

You need the following:

- An AWS account with Amazon Bedrock available in the region you plan to use.
- Permission to modify IAM policies and to enable Bedrock model access in that account.
- The AWS CLI v2.34.1 or later installed locally.
- For sandboxed AgentCore sessions, an Amazon Elastic Container Registry (ECR) registry in the same account, a local container tool (Docker or Podman), and credentials for `cr.seqera.io`.

:::

## Enable model access

Enable access to the Claude models Co-Scientist uses in your chosen region. See the AWS documentation for [adding or removing access to Amazon Bedrock foundation models](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access-modify.html).

| Role | Model | How it is set |
| --- | --- | --- |
| Primary | Claude Sonnet 4.6, through the `global.anthropic.claude-sonnet-4-6` inference profile | `bedrock.inference.anthropicModel` in the agent backend chart. Defaults to `global.anthropic.claude-sonnet-4-6` when unset. |
| Fast, deep, and summary | Claude Sonnet 4.6, through the `global.anthropic.claude-sonnet-4-6` inference profile | Agent backend default. Not exposed as chart values. |

By default, every role uses Claude Sonnet 4.6, the only Claude model you need to enable.

If you plan to use documentation semantic search, also enable the `amazon.titan-embed-text-v2:0` embedding model, the chart default for `bedrock.embeddings.model`. To disable documentation search and skip this model, leave `embeddings.provider` unset.

:::note
The first time an account requests access to Anthropic models, AWS may ask you to submit use case details before approving access. Approval is not instant. Request access before you schedule your installation.
:::

### Activate the Marketplace subscription

You can invoke a model served through AWS Marketplace only while an active agreement exists for it. AWS creates the agreement on first use. Activate each model once before you install, with either of these methods:

- Open the model in the [Bedrock model catalog](https://docs.aws.amazon.com/bedrock/latest/userguide/model-catalog.html) and run it in the playground.
- Invoke the model once with the [InvokeModel](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_InvokeModel.html) or [Converse](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html) API.

If you skip this step, Co-Scientist's first inference call fails even with model access enabled.

## Use an inference profile for Claude Sonnet

Bedrock does not offer Claude Sonnet 4.6 with on-demand throughput. Invoke it through the global inference profile:

```
global.anthropic.claude-sonnet-4-6
```

Supply its full ARN to the agent backend as `bedrock.inference.anthropicModel` when you install the chart:

```yaml
arn:aws:bedrock:<region>:<account-id>:inference-profile/global.anthropic.claude-sonnet-4-6
```

## Grant Bedrock inference permissions

Attach the following policy to the IAM role or user that the agent backend pods use. Include one resource entry for the foundation model and one for the inference profile of each model you enabled above:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:::foundation-model/anthropic.claude-sonnet-4-6",
        "arn:aws:bedrock:<region>:<account-id>:inference-profile/global.anthropic.claude-sonnet-4-6"
      ]
    }
  ]
}
```

Replace `<region>` and `<account-id>` with your own values. Foundation model ARNs have no region or account component because they are not region-scoped. List both the inference profile and the foundation model it routes to. Bedrock authorizes a request through a profile against both.

:::caution
By default, the primary, fast, deep, and summary roles all use Claude Sonnet 4.6. The example policy covers every Claude call the agent backend makes. If you set `bedrock.inference.anthropicModel` to a different model, add its foundation model entry and inference profile ARN. If you use documentation semantic search, also add the embedding model:

```
arn:aws:bedrock:::foundation-model/amazon.titan-embed-text-v2:0
```

Calls to a model missing from this policy fail with an access-denied error at runtime, not at install time.
:::

## Set up the AgentCore runtime

Complete this section only if you enable sandboxed sessions with `sandbox.provider: bedrock`. Bedrock AgentCore is the only supported sandbox provider. To run without sandboxed sessions, leave `sandbox.provider` unset and skip this section.

### Copy the runtime image into your ECR

Seqera publishes the AgentCore runtime image. Copy it into a repository in your own Amazon ECR registry, in the same account as the runtime.

:::caution
AgentCore cannot pull the image from Seqera's container registry because it resolves images through AWS IAM within your account. Store the image in your own ECR registry.
:::

Seqera builds the image for `arm64`. Pull it, retag it for your registry, and push:

```bash
podman pull --arch arm64 cr.seqera.io/ai/agent-backend/bedrock-agentcore-runtime:<tag>

aws ecr get-login-password --region <region> \
  | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com

docker tag cr.seqera.io/ai/agent-backend/bedrock-agentcore-runtime:<tag> \
  <account-id>.dkr.ecr.<region>.amazonaws.com/agent-backend/bedrock-agentcore-runtime:<tag>

docker push <account-id>.dkr.ecr.<region>.amazonaws.com/agent-backend/bedrock-agentcore-runtime:<tag>
```

Pin a specific dated tag, not `latest`. Contact Seqera for the tag that matches your deployment.

### Create the runtime

:::note
The identity you use to create the runtime needs the `bedrock-agentcore:CreateAgentRuntime` and `bedrock-agentcore:ListAgentRuntimes` permissions. These are separate from the invocation permissions the agent backend pods need, described in the next section. Service control policies or permissions boundaries in your organization can block these actions even when your own role allows them.
:::

To create the runtime:

1. In the AWS console, create a new AgentCore runtime with the **Host agent or tool** option.
2. Set its source to the image in your ECR registry, and accept the defaults for the remaining options.
3. Copy the runtime ARN. It has this format:

   ```
   arn:aws:bedrock-agentcore:<region>:<account-id>:runtime/<name>-<id>
   ```

4. Supply that ARN to the agent backend as `bedrock.sandbox.runtimeArn` when you install the chart.

### Grant runtime invocation permissions

Attach the following policy to the IAM role or user that the agent backend pods use:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock-agentcore:InvokeAgentRuntime",
        "bedrock-agentcore:InvokeAgentRuntimeCommand",
        "bedrock-agentcore:InvokeAgentRuntimeForUser",
        "bedrock-agentcore:InvokeAgentRuntimeWithWebSocketStream",
        "bedrock-agentcore:InvokeAgentRuntimeWithWebSocketStreamForUser"
      ],
      "Resource": [
        "arn:aws:bedrock-agentcore:*:<account-id>:runtime/*",
        "arn:aws:bedrock-agentcore:*:<account-id>:runtime/*/runtime-endpoint/*"
      ]
    }
  ]
}
```

## Provide credentials to the pods

Bedrock authenticates with AWS IAM credentials. You do not need an API key secret for Bedrock.

| Method | When to use |
| --- | --- |
| Amazon Elastic Kubernetes Service (EKS) Pod Identity | Recommended. Associates the IAM role with the agent backend's Kubernetes service account, with no long-lived credentials in the cluster. |
| IAM roles for service accounts (IRSA) | Supported alternative on clusters already standardized on IRSA. |
| Static AWS credentials | Supported, but stores long-lived keys in a Kubernetes Secret. Use only when neither role-based option is available. |

When the pods must assume a role to reach Bedrock, set `bedrock.default.assumeRoleArn` to that role's ARN. Leave it empty when the pods already hold credentials for the target account. To use a different role for each capability, set the per-service overrides `bedrock.inference.assumeRoleArn`, `bedrock.embeddings.assumeRoleArn`, and `bedrock.sandbox.assumeRoleArn`.

For the full values file and the surrounding chart configuration, see [Install Co-Scientist](../enterprise/install-seqera-coscientist.mdx).

## Next steps

After you configure your AWS account, continue with the following pages:

- [Install Co-Scientist](../enterprise/install-seqera-coscientist.mdx)
- [Usage and cost](./usage-and-cost.md) — how model access, inference profiles, quotas, and IAM roles map to what your organization is billed for
