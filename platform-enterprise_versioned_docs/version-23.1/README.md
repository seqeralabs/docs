# Nextflow Tower documentation

title: "README"

As of June 2023, a new process was implemented for sourcing and publishing Nextflow Tower public documentation:

1. Markdown content is stored in the `/docs` folder of the [**nf-tower-cloud**](https://github.com/seqeralabs/nf-tower-cloud) repository.
2. New content must be created in `feature branches` generated from `master`.
3. Content changes must be pushed to `master` via PRs with two approvers:
   1. An engineering team member (ideally the engineer that worked on the feature being documented)
   2. A writing team member.
4. A GitHub Action in the nf-tower-cloud repo will automatically sync the `/docs` folder to our legacy [**nf-tower-docs**](https://github.com/seqeralabs/nf-tower-docs) repository. **DO NOT MAKE CONTENT EDITS IN nf-tower-docs DIRECTLY.**
5. nf-tower-docs repo content will be published to the public `help.tower.nf` website manually using Mkdocs.

## Render this documentation locally

### Install dependencies and preview locally

1. **Generate a token on git.seqera.io**

   To build the docker container and serve the Mkdocs site, you must generate a token on Gitea.

   - Log in to [git.seqera.io](https://git.seqera.io) using your Seqera credentials
   - In the top right menu, click on your avatar and select `Settings` from the drop-down menu
   - Select `Applications` near the top of the page
   - Generate a new token and copy the value after form submission
   - Store the token value as a `GITEA_TOKEN` environment variable, optionally added to .bashrc/.zshrc. Run `source .bashrc` or `source .zshrc` once saved.

2. **Install dependencies**

   Install Mkdocs, Mkdocs plugins, and Mkdocs Material Insiders. From the root folder of your local repository clone, run:

   - `pip install mkdocs mkdocs-material`
   - `pip install -r requirements.txt`
   - `pip install "git+https://${GITEA_TOKEN}@git.seqera.io/seqeralabs/mkdocs-material-insiders@7.3.3-insiders-3.1.3"`

3. **Run `mkdocs serve`**

### Generate a Mkdocs-ready container

1. **Generate a token on git.seqera.io**

   To build the docker container and serve the Mkdocs site, you must generate a token on Gitea.

   - Log in to [git.seqera.io](https://git.seqera.io) using your Seqera credentials
   - In the top right menu, click on your avatar and select `Settings` from the drop-down menu
   - Select `Applications` near the top of the page
   - Generate a new token and copy the value after form submission
   - Store the token value as a `GITEA_TOKEN` environment variable, optionally added to .bashrc/.zshrc. Run `source .bashrc` or `source .zshrc` once saved.

2. **Build docs image**

   ```bash
   # Build the image direclty via Docker
   docker build --build-arg GITEA_TOKEN=${GITEA_TOKEN} -t seqera-docs .

   # Or, use a `make` command
   make build-docker
   ```

3. **Run the container**

   ```bash
   # Navigate to the root of your local nf-tower-cloud repo and run the following
   docker run --rm -p 8000:8000 -v ${PWD}:/docs seqera-docs:latest serve --dev-addr=0.0.0.0:8000
   ```

4. **Visit `0.0.0.0:8000` from your favorite browser**.

## Contribution guidelines

- Write according to the [content style guide](https://docs.google.com/document/d/1j8cQAtwJLW891TDBSDMYTy3Jcr4gRVxtqwcWzPCjTY4/edit?usp=sharing)

## Technical review guidelines

When assessing doc content for technical accuracy, keep in mind:

- How the content fits into our overall documentation and whether it is being added to the correct place.
- Whether the content can be simplified or streamlined in relation to existing content.
- Does the content instruct users according to best practices?
- Are there any edge cases or caveats that are helpful for users to know that should be added to the content?

## Mkdocs mechanics

Mkdocs is a powerful framework with many opportunities to extend functionality via plugins. Some packages have already been added to our project and affect how content is structured and referenced.

### Navigation

To update the Tower docs navigation menu, edit the `navigation` section of the `mkdocs.yml` file in the root of this repo.

### Plugins

- [mkdocs-table-reader-plugin](https://timvink.github.io/mkdocs-table-reader-plugin/)

  - Insert tables (CSV, YML, etc.) directly into markdown pages using a tag.
  - How it's implemented:

    1. Activate as a `plugins` entry in `mkdocs.yml` (below `social` and `search`, but above other mkdocs plugins)
    2. Create an external yaml file in a `tables` folder within the content subfolder (e.g., `docs/enterprise/configuration/tables/compute_env.yml`)
    3. Add key-value pairs in groups, where each key represents a column name, and each value represents an entry in a row, e.g.:

    ```yaml
    -
    Environment variable:            "`TOWER_DB_USER`"
    Description: >
        The user account to access your database.<br/>
        Create this user manually if using an external database.
    Value:                "e.g., `db_user`"
    -
    Environment variable:            "`TOWER_DB_PASSWORD`"
    Description: >
        The user password to access your database.<br/>
        Create this password manually if using an external database.
    Value:
    -
    ```

    4. Each unique column name will be rendered in the table, so ensure that all row entries have the same column name keys. The example above shows the structure for two row entries in a table with three columns.
    5. Reference this table in other markdown files with `{{ read_yaml('./tables/compute_env.yml')}}` (relevant path to the table from the markdown file where it is being referenced).

- [mkdocs-markdownextradata-plugin](https://github.com/rosscdh/mkdocs-markdownextradata-plugin)

  - Implement DRY-like variables for content which appears throughout the site. ( _Example: The latest Tower Enterprise container names._ )
  - How it's implemented:

    1. Activate as a `plugins` entry in `mkdocs.yml`
    2. Create an external yaml file in `/docs/_data/` ( _e.g. `my_dry_vars`_ )
    3. Add key-value pairs to the external file ( _e.g. `tower_fe_image: "cr.seqera.io/private/nf-tower-enterprise/frontend:v23.1.3"`_ ).
    4. Update the `plugins` entry with a path to the file:

       ```yaml
       plugins:
         - markdownextradata:
             data: _data/YOUR_FILE
       ```

    5. Reference this variable in other markdown files with `{{ my_dry_vars.tower_fe_image }}`.

- [mkdocs-same-dir](https://github.com/oprypin/mkdocs-same-dir)
  - Enable Mkdocs to build with `mkdocs.yml` inside the `/docs` folder. Once listed as a `plugins` entry in the `mkdocs.yml`, no further action is needed.
