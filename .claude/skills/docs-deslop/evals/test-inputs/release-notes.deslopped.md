# Seqera Platform v24.1 release notes

## Breaking changes

Review the [v24.1 migration guide](https://docs.seqera.io/platform-cloud/migrate/24.1) before you upgrade.

- Removed the deprecated `tw --token` flag. Set the `TOWER_ACCESS_TOKEN` environment variable instead.
- Changed the `tw` CLI default output format from JSON to `table`. Set the format with `--output`.

## Performance

- Reduced p99 run submission latency to AWS Batch compute environments from 12s to 4s (#1842)
- **Launchpad** now loads the pipeline list through a paginated query, around 3x faster for workspaces with more than 1000 pipelines (#1856)
- **Data Explorer** now batches storage API calls when listing buckets instead of issuing them sequentially (#1871)

## Security

- Added single sign-on (SSO) through SAML 2.0 and OpenID Connect (OIDC)
- Added role-based access control (RBAC) with five built-in roles plus custom roles
- Added audit logging that writes to Amazon S3, with optional write-once-read-many (WORM) retention
