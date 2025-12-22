


## Background


Seqera documentation related to platform operations currently accommodates multiple skill levels and includes extensive supporting information about third-party systems. This approach results in documentation that contains more foundational content than is typically found in other enterprise products.

When writing documentation for enterprise customers, focused content is more valuable than comprehensive coverage of tangential topics. By minimizing supporting documentation for third-party systems we don't control and assuming baseline reader knowledge, we can write more focused, relevant documentation about Seqera's products and platforms.

This approach enables us to maintain documentation that serves our intended audience experienced infrastructure professionals while reducing the maintenance burden of keeping third-party system guidance current.

**For customers who lack the requisite knowledge and skills**, several support options are available:

- **Cloud Vendor & supplier documentation** \- All cloud vendors provide up to date detailed documentation for how to deploy and run their services.
  - AWS
    - [Setting up ElastiCache](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/set-up.html)
    - [Amazon RDS for MySQL \- Amazon Relational Database Service](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html)
  - GCP
    - [MySQL on Compute Engine | Google Cloud Documentation](https://docs.cloud.google.com/compute/docs/instances/mysql/discover-mysql)
    - [Memorystore: in-memory Redis compatible data store | Google Cloud](https://cloud.google.com/memorystore?hl=en)
  - Azure
    - [Azure Cache for Redis | Microsoft Azure](https://azure.microsoft.com/en-us/products/cache)
    - [Azure Database for MySQL documentation | Microsoft Learn](https://learn.microsoft.com/en-us/azure/mysql/)
  - Redis
    - [Install on Kubernetes | Docs](https://redis.io/docs/latest/operate/redisinsight/install/install-on-k8s/)
  - MySQL
    - [MySQL Operator for Kubernetes Manual](https://dev.mysql.com/doc/mysql-operator/en/)
- **Seqera Professional Services** provides training and implementation support
- **Seqera Cloud** provides a fully managed alternative for organizations without the resources to run enterprise systems in-house

## Examples

**Wave installation documentation** provides a clear model for this approach. We specify prerequisites for installation and allow readers to install those dependencies before proceeding with the Wave installation itself. This keeps the documentation focused on Wave.

**Platform installation documentation** currently takes a different approach. We guide readers through the installation of prerequisites, which shifts focus away from the Seqera Platform installation itself. This results in longer documentation that mixes Seqera-specific guidance with general infrastructure setup.

**The gap:** Our intent is to provide deeper technical articles and tooling specific to Seqera products. However, it's not feasible to provide comprehensive coverage of how all dependencies work. Instead, we should make the core assumption that readers understand these foundational systems and focus our documentation on how Seqera integrates with them.

## Guiding Principle

**_Seqera is the client, not the server._**

Document what Seqera needs from infrastructure, not how to build that infrastructure.

This principle keeps documentation focused on the integration contract rather than becoming a general infrastructure guide.

## Assumptions

Our documentation assumes readers have:

- Working knowledge of their chosen cloud provider (AWS, Azure, GCP)
- Familiarity with container orchestration if deploying on Kubernetes
- Basic understanding of infrastructure components (databases, caching, networking)
- Access to internal or external resources for foundational training

---

## Scope Definition

### In Scope

| Category                           | Description                                                 | Example                                                                                              |
| :--------------------------------- | :---------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Technical requirements**         | Clearly specify what Seqera Platform needs to operate       | "Seqera requires Redis 6.2+"                                                                         |
| **Credential creation**            | How to create credentials for Seqera to connect to services | "Create a Kubernetes service account with these permissions"                                         |
| **Configuration**                  | Seqera-specific environment variables and settings          | `TOWER_REDIS_URL`, `TOWER_DB_URL`                                                                    |
| **Integration points**             | How Seqera connects to third-party services                 | "Configure OIDC callback URL in your identity provider"                                              |
| **Platform-specific tuning**       | Resource allocations, metrics, and optimization for Seqera  | "Recommended JVM heap size for your workload profile"                                                |
| **Links to authoritative sources** | References to official third-party documentation            | "See [Kubernetes RBAC documentation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)" |

### Out of Scope

| Category                        | Description                                       | Example                                           |
| :------------------------------ | :------------------------------------------------ | :------------------------------------------------ |
| **Infrastructure installation** | Step-by-step guides for deploying prerequisites   | Redis manifests, Kubernetes cluster creation      |
| **Service administration**      | How to operate and maintain third-party services  | Redis clustering, database optimization           |
| **General tooling tutorials**   | Educational content on third-party tools          | How to write PromQL queries, kubectl basics       |
| **Cloud provider setup**        | Infrastructure provisioning in cloud environments | Creating VPCs, configuring IAM roles from scratch |
| **Foundational training**       | Basic concepts for infrastructure technologies    | "What is Kubernetes?", Docker fundamentals        |

---

## Explicit Examples

### In Scope vs Out of Scope

| In Scope                                                                | Out of Scope                                         |
| :---------------------------------------------------------------------- | :--------------------------------------------------- |
| "Create a Kubernetes service account with these permissions for Seqera" | "How to create a Kubernetes cluster"                 |
| "Configure `TOWER_REDIS_URL` to connect to your Redis instance"         | "Here's a Redis manifest to deploy Redis"            |
| "Your database must support PostgreSQL 11+"                             | "How to install and configure PostgreSQL"            |
| "Seqera requires these IAM permissions" (policy JSON provided)          | "How to navigate the AWS IAM console"                |
| "Configure your ingress to route to the Seqera service"                 | "How to install and configure an ingress controller" |

### Service-Specific Guidance

#### Redis

- **In scope**: Version requirements (6.2+), connection variables (`TOWER_REDIS_URL`), TLS configuration for Seqera
- **Out of scope**: Redis deployment manifests, clustering setup, memory optimization

#### Kubernetes

- **In scope**: Required RBAC permissions, service account configuration, resource requests for Seqera pods
- **Out of scope**: Cluster provisioning, StorageClass tutorials, general kubectl usage

#### Databases

- **In scope**: Schema requirements, connection string format, supported versions
- **Out of scope**: Database installation, backup strategies, query optimization

#### Authentication Providers

- **In scope**: Callback URL format, required claims/scopes, Seqera environment variables
- **Out of scope**: How to set up Keycloak/Okta/Entra ID from scratch

---

## Rationale

### Benefits

| Benefit                             | Description                                                                                       |
| :---------------------------------- | :------------------------------------------------------------------------------------------------ |
| **Reduced maintenance burden**      | Third-party UIs and CLIs change frequently; linking to authoritative sources avoids version drift |
| **Clear ownership**                 | Seqera documentation covers Seqera; third-party documentation covers third-party tools            |
| **Faster navigation**               | Technical users find Seqera-specific guidance without wading through familiar content             |
| **Professional Services alignment** | Customers requiring foundational training engage pre-sales and PS teams                           |
| **Documentation authority**         | Seqera docs become the definitive source for Platform-specific knowledge                          |

### Target Audience

This approach assumes our readers are:

- DevOps engineers with infrastructure experience
- Platform engineers responsible for deployment
- Technical teams evaluating or implementing Seqera

Users requiring foundational knowledge in prerequisite technologies can access training through Seqera's pre-sales and professional services teams.

---

## Writing Guidelines

### When documenting integrations

1. **State the requirement** — What does Seqera need?
2. **Provide the configuration** — Which variables/settings connect Seqera to the service?
3. **Link to authoritative sources** — Where can users learn more about the third-party component?

### Template

```
## [Service Name] Integration

### Requirements

Seqera Platform requires [service] version X.X or later.

### Configuration

| Variable                 | Description                  |
| ------------------------ | ---------------------------- |
| `TOWER_SERVICE_URL`      | Connection URL for [service] |
| `TOWER_SERVICE_PASSWORD` | Authentication credential    |

### Additional Resources

See [Official Service Documentation](https://example.com) for installation and configuration guidance.
```

### Avoid

- Step-by-step console navigation for third-party services
- Screenshots of third-party UIs (they change frequently)
- Manifests or deployment files for prerequisite services
- Explanations of basic concepts users should already understand

---

## Exemplary Sections

These existing documentation sections demonstrate the proposed approach:

- **Monitoring guide** — Focuses on Seqera-specific metrics and alerting
- **Production checklist** — Provides Seqera recommendations with links to external resources
- **Configuration reference** — Comprehensive coverage of Seqera environment variables

Use these as templates when refactoring other sections.
