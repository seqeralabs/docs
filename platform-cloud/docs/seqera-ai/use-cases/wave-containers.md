---
title: "Build containers with Wave"
description: "Create containerized environments with Wave using Co-Scientist, without writing Dockerfiles"
date created: "2026-05-27"
tags: [seqera-ai, co-scientist, cli, wave, containers, use cases]
---

Co-Scientist can create containerized environments using Wave, without the need to write Dockerfiles. The examples below are prompts you can adapt to your own tools.

<div style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden'}}>
<iframe style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/lihF6g9C3RY?autoplay=1&mute=1" title="Use Co-Scientist to build containers with Wave" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

## Create a container with conda packages

```
> Create a container with samtools and bwa from bioconda
```

## Create a container with pip packages

```
> Build a container with pandas, numpy, and scikit-learn
```

## Get a container for a specific tool

```
> I need a container with FastQC version 0.12.1
```

:::note
Co-Scientist generates a Wave container URL that you can use directly in your Nextflow pipelines or pull with Docker.
:::

## Learn more

- [Use cases](../use-cases.md): More Co-Scientist use cases
- [Develop and debug Nextflow pipelines](./nextflow.md): Use your containers in a pipeline
- [Skills](../skills.md): Discover, create, and install skills
