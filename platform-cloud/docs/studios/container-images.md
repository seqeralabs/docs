---
title: "Studios container image templates"
description: "Use container images with Studios."
date created: "2025-10-16"
last updated: "2025-10-16"
tags: [container, container-images, session, studios]
---

## Container image templates

There are four container image templates provided: JupyterLab, R-IDE, Visual Studio Code, and Xpra. The image templates install a very limited number of packages when the Studio session container is built. You can install additional packages as needed during a Studio session.

The image template tag includes the version of the analysis application, an optional incompatibility flag, and the Seqera Connect version. Connect is the proprietary Seqera web server client that manages communication with the container. Tag strings use the following format:

```ignore title="Image template tag"
<TOOL_VERSION>-[<UPDATE_VERSION>]-<CONNECT_VERSION>
```

- `<TOOL_VERSION>`: Third-party analysis application that follows its own semantic versioning `<MAJOR>.<MINOR>.<PATCH>`, such as `4.2.5` for JupyterLab.
- `<update_version>`: Optional analysis application update version, such as `u1`, for instances where a backwards incompatible change is introduced.
- `<connect_version>`: Seqera Connect client version, such as `0.8` or `0.8.0`.

Additionally, the Seqera Connect client version string has the format:

```ignore title="Seqera version tag subset"
<major>.<minor>.<patch>
```

- `<MAJOR>`: Signifies major version changes in the underlying Seqera Connect client.
- `<MINOR>`: Signifies breaking changes in the underlying Seqera Connect client.
- `<PATCH>`: Signifies patch (non-breaking) changes in the underlying Seqera Connect client.

When pushed to the container registry, an image template is tagged with the following tags:

- `<TOOL_VERSION>-<MAJOR>.<MINOR>`, such as `4.2.3-0.8`. Seqera Platform displays this tag when adding a new container template image.
- `<TOOL_VERSION>-<MAJOR>.<MINOR>.<PATCH>`, such as `4.2.3-0.8.4`.

To view the latest versions of the images, see [public.cr.seqera.io](https://public.cr.seqera.io/). You can also augment the Seqera-provided image templates or use your own custom container image templates. This approach is recommended for managing reproducible analysis environments. For more information, see [Custom environments][custom-envs].

### JupyterLab 4.2.5

The default user is the `root` account. The following [conda-forge](https://conda-forge.org/) packages are available by default:

- `python=3.13.0`
- `pip=24.2`
- `jedi-language-server=0.41.4`
- `jupyterlab=4.2.5`
- `jupyter-collaboration=1.2.0`
- `jupyterlab-git=0.50.1`
- `jupytext=1.16.4`
- `jupyter-dash=0.4.2`
- `ipywidgets=7.8.4`
- `pandas[all]=2.2.3`
- `scikit-learn=1.5.2`
- `statsmodels=0.14.4`
- `itables=2.2.2`
- `seaborn[stats]=0.13.2`
- `altair=5.4.1`
- `plotly=5.24.1`
- `r-ggplot2=3.5.1`
- `nb_black=1.0.7`
- `qgrid=1.3.1`

To install additional Python packages during a running Studio session, execute `!pip install <packagename>` commands in your notebook environment. Additional system-level packages can be installed in a terminal window using `apt install <packagename>`.

To see the list of all JupyterLab image templates available, including security scan results or to inspect the container specification, see [public.cr.seqera.io/repo/platform/data-studio-jupyter][ds-jupyter].

### R-IDE 4.4.1

The default user is the `root` account. To install R packages during a running Studio session, execute `install.packages("<packagename>")` commands in your notebook environment. Additional system-level packages can be installed in a terminal window using `apt install <packagename>`.

To see the list of all R-IDE image templates available, including security scan results or to inspect the container specification, see [https://public.cr.seqera.io/repo/platform/data-studio-ride][ds-ride].

### Visual Studio Code 1.93.1

[Visual Studio Code][def-vsc] is an integrated development environment (IDE) that supports many programming languages. The default user is the `root` account. The container template image ships with the latest stable version of [Nextflow] and the [VS Code extension for Nextflow][nf-lang-server] to make troubleshooting Nextflow workflows easier. To install additional extensions during a running Studio session, select **Extensions**. Additional system-level packages can be installed in a terminal window using `apt install <packagename>`.

To see the list of all Visual Studio Code image templates available, including security scan results or to inspect the container specification, see [public.cr.seqera.io/platform/data-studio-vscode][ds-vscode].

[contact]: https://support.seqera.io/
[aws-cloud]: ../compute-envs/aws-cloud
[aws-batch]: ../compute-envs/aws-batch
[custom-envs]: ./custom-envs
[build-status]: ./custom-envs#build-status
[cloud-bucket-subdirectory]: ./managing#cloud-bucket-subdirectory
[ds-jupyter]: https://public.cr.seqera.io/repo/platform/data-studio-jupyter
[ds-rstudio]: https://public.cr.seqera.io/repo/platform/data-studio-rstudio
[def-vsc]: https://code.visualstudio.com/
[Nextflow]: https://nextflow.io/
[nf-lang-server]: https://marketplace.visualstudio.com/items?itemName=nextflow.nextflow
[ds-vscode]: https://public.cr.seqera.io/repo/platform/data-studio-vscode
[def-xpra]: https://github.com/Xpra-org/xpra
[ds-xpra]: https://public.cr.seqera.io/repo/platform/data-studio-xpra
[Wave]: https://seqera.io/wave/
[build-status]: ./custom-envs#build-status