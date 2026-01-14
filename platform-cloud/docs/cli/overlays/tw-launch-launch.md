The CLI can directly launch pipelines that have not been added to the Launchpad in a Platform workspace by using the full pipeline repository URL:

```bash
tw launch https://github.com/nf-core/rnaseq \
--params-file=./custom_rnaseq_params.yaml \
--config=<path/to/nextflow/conf/file> \
--compute-env=my_aws_ce --revision 3.8.1 \
--profile=test,docker

  Workflow 2XDXxX0vCX8xhx submitted at user workspace.

    https://cloud.seqera.io/user/user1/watch/2XDXxX0vCX8xhx
```

- Pipeline parameters are defined within the `custom_rnaseq_params.yaml` file.
- The optional `--config` flag is used to pass a custom Nextflow configuration file — configuration values passed here override the same values in the default pipeline repository `nextflow.conf` file. When this flag is set, all configuration values specified in Platform pipeline or compute environment **Nextflow config** fields are ignored.
- Other parameters such as `--profile` and `--revision` can also be specified.
- A non-primary compute environment can be used to launch the pipeline. Omit `--compute-env` to launch with the workspace default compute environment.

:::note
CLI users are bound to the same user permissions that apply in the Platform UI. Launch users can launch pre-configured pipelines in the workspaces they have access to, but they cannot add or run new pipelines.
:::
