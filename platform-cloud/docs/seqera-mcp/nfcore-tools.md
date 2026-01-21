---
title: nf-core Tools
description: "Search and explore nf-core bioinformatics modules and get analysis recommendations"
date created: "2026-01-12"
tags: [nf-core, nextflow, bioinformatics, pipelines, modules]
---

The nf-core tools provide access to 1630+ pre-built, standardized Nextflow bioinformatics modules and pipelines. These tools help discover modules for specific tasks, get detailed usage information, and receive recommendations for analysis pipelines based on your data type.

## Available Tools

### search_nfcore_module

Search nf-core modules using natural language queries. Find modules for tasks like alignment, variant calling, quality control, assembly, and annotation.

**Example prompts:**
- "Find nf-core modules for quality control of sequencing data"
- "Search for alignment modules that support paired-end reads"
- "What modules are available for variant calling?"
- "Find modules for RNA-seq quantification"
- "Search for tools that can trim adapters from FASTQ files"

### describe_nfcore_module

Get comprehensive metadata for a specific module including input/output schemas, command templates, configuration examples, and AI execution guidance.

**Example prompts:**
- "Describe the nf-core/fastqc module"
- "Show me how to use the bwa/mem module"
- "What are the inputs and outputs for samtools/sort?"
- "Give me the Nextflow command to run the multiqc module"
- "How do I configure the star/align module for my analysis?"

### nfcore_suggest_analysis

Suggest appropriate nf-core pipelines and reference genomes based on library strategy and organism. Maps sequencing assay types to recommended analysis workflows.

**Supported Library Strategies:**
- RNA-Seq, mRNA-Seq → nf-core/rnaseq
- WGS, WXS → nf-core/sarek
- ATAC-Seq → nf-core/atacseq
- ChIP-Seq → nf-core/chipseq
- Bisulfite-Seq → nf-core/methylseq
- miRNA-Seq → nf-core/smrnaseq
- Amplicon → nf-core/ampliseq
- Hi-C → nf-core/hic

**Supported Organisms (with genome builds):**
- Homo sapiens → GRCh38
- Mus musculus → GRCm39
- Rattus norvegicus → Rnor_6.0
- Danio rerio → GRCz11
- Drosophila melanogaster → BDGP6
- Arabidopsis thaliana → TAIR10
- And many more...

**Example prompts:**
- "What pipeline should I use for human RNA-seq data?"
- "Suggest an analysis pipeline for mouse ATAC-seq"
- "What's the recommended genome for Homo sapiens?"
- "I have WGS data from zebrafish, what should I use?"
- "Recommend a pipeline for ChIP-seq analysis of mouse samples"

## Typical Workflow

1. **Search** for modules using natural language with `search_nfcore_module`
2. **Describe** specific modules to understand inputs, outputs, and usage with `describe_nfcore_module`
3. **Suggest** the best pipeline and genome for your data type with `nfcore_suggest_analysis`
4. **Execute** the recommended pipeline with Nextflow

## Example Session

```
User: I have paired-end RNA-seq data from human liver samples. What should I use to analyze it?

AI: [Uses nfcore_suggest_analysis]
    Recommended pipeline: nf-core/rnaseq
    Pipeline URL: https://nf-co.re/rnaseq
    Reference genome: GRCh38
    iGenomes path: s3://ngi-igenomes/igenomes/GRCh38

User: What modules does rnaseq use for quality control?

AI: [Uses search_nfcore_module with "quality control RNA-seq"]
    Found relevant modules:
    1. nf-core/fastqc - QC checks on sequencing data
    2. nf-core/multiqc - Aggregate QC reports
    3. nf-core/trimgalore - Adapter and quality trimming

User: Tell me more about fastqc

AI: [Uses describe_nfcore_module for nf-core/fastqc]
    Module: nf-core/fastqc
    Description: Run FastQC quality control checks on sequencing data

    Inputs:
    - reads: FASTQ files (*.fastq.gz)

    Outputs:
    - html: FastQC HTML report
    - zip: FastQC data archive

    Nextflow command:
    nextflow run nf-core/fastqc \
      --input samplesheet.csv \
      --outdir results \
      -profile docker
```

## Pipeline Mapping Reference

| Library Strategy | nf-core Pipeline | Description |
|-----------------|------------------|-------------|
| RNA-Seq | rnaseq | RNA sequencing analysis |
| WGS/WXS | sarek | Variant calling for germline/somatic |
| ATAC-Seq | atacseq | Chromatin accessibility |
| ChIP-Seq | chipseq | Protein-DNA binding |
| Bisulfite-Seq | methylseq | DNA methylation |
| miRNA-Seq | smrnaseq | Small RNA analysis |
| Amplicon | ampliseq | Amplicon sequencing |
| Hi-C | hic | Chromosome conformation |

## Genome Reference

| Organism | Common Name | Genome Build |
|----------|-------------|--------------|
| Homo sapiens | Human | GRCh38 |
| Mus musculus | Mouse | GRCm39 |
| Rattus norvegicus | Rat | Rnor_6.0 |
| Danio rerio | Zebrafish | GRCz11 |
| Drosophila melanogaster | Fruit fly | BDGP6 |
| Caenorhabditis elegans | Worm | WBcel235 |
| Saccharomyces cerevisiae | Yeast | R64-1-1 |
| Arabidopsis thaliana | Arabidopsis | TAIR10 |
