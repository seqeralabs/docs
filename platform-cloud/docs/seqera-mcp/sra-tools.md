---
title: SRA Tools
description: "Search and retrieve sequencing data from NCBI SRA, EBI ENA, and GEO databases"
date created: "12 Jan 2026"
tags: [sra, ena, geo, sequencing, bioinformatics]
---

The SRA tools provide access to public sequencing data repositories including NCBI SRA, EBI ENA, and NCBI GEO. These tools enable searching for datasets, exploring study metadata, and generating sample sheets for downstream analysis.

## Available tools

### sra_search_ncbi

Search NCBI Sequence Read Archive using the E-utilities API.

**Example prompts:**
- "Search NCBI SRA for human RNA-seq studies on liver cancer"
- "Find all single-cell RNA-seq datasets for mouse brain"
- "Search for COVID-19 sequencing studies from 2023"

### sra_search_ebi

Search EBI European Nucleotide Archive with advanced query syntax.

**Example prompts:**
- "Search EBI ENA for ATAC-seq data from Homo sapiens"
- "Find paired-end Illumina WGS studies for Arabidopsis thaliana"
- "Search ENA for ChIP-seq experiments targeting H3K27ac"

### sra_fetch_geo_study

Fetch GEO study metadata and find linked SRA projects. Given a GSE accession, retrieves study title, summary, organism, sample count, and linked SRA/BioProject accessions.

**Example prompts:**
- "Get metadata for GEO study GSE147507"
- "What is the GSE110004 study about and how many samples does it have?"
- "Find the SRA project linked to GSE164073"

### sra_list_runs_detailed

Get detailed metadata for all runs in a study, including library strategy, layout, size, and organism. Accepts both GEO (GSE) and SRA (SRP) accessions.

**Example prompts:**
- "List all runs in GSE147507 with their library strategies"
- "Show me the detailed run information for SRP253951"
- "What sequencing platforms were used in GSE110004?"

### sra_group_by_assay

Group runs by assay type (library strategy + layout) for multi-assay studies. Useful for selecting specific data types from complex studies.

**Example prompts:**
- "Group the runs in GSE147507 by assay type"
- "Show me how many RNA-seq vs ATAC-seq runs are in this study"
- "Organize the runs in SRP253951 by library strategy and layout"

### sra_fetch_download_urls

Get download URLs for SRA and FASTQ files with MD5 checksums. Supports FTP, HTTP, and HTTPS protocols.

**Example prompts:**
- "Get FASTQ download URLs for SRR10971381"
- "Fetch download links for runs SRR001, SRR002, SRR003"
- "Get the FTP URLs for all runs in my search results"

### sra_create_samples_sheet

Generate downloadable sample sheets in CSV, TSV, or JSON format with metadata and download URLs. Ideal for preparing pipeline inputs.

**Example prompts:**
- "Create a CSV sample sheet for the RNA-seq runs in GSE147507"
- "Generate a TSV file with download URLs for these SRR accessions"
- "Make a sample sheet I can use with nf-core/rnaseq"

## Typical workflow

1. **Search** for datasets using `sra_search_ncbi` or `sra_search_ebi`
2. **Explore** a study with `sra_fetch_geo_study` to get overview
3. **List** detailed run information with `sra_list_runs_detailed`
4. **Group** by assay type with `sra_group_by_assay` for multi-assay studies
5. **Download** URLs with `sra_fetch_download_urls` or create a sample sheet with `sra_create_samples_sheet`

## Example session

```
User: Find RNA-seq studies for human liver cancer

AI: [Uses sra_search_ncbi to find relevant studies]
    Found 150 results. Top study: GSE147507 - "COVID-19 and liver damage"

User: Tell me more about GSE147507

AI: [Uses sra_fetch_geo_study]
    Study: GSE147507
    Title: Human liver organoids to model COVID-19
    Organism: Homo sapiens
    Samples: 48
    Linked SRA: SRP253951

User: What types of assays are in this study?

AI: [Uses sra_list_runs_detailed then sra_group_by_assay]
    - RNA-Seq:PAIRED: 36 runs (450 GB)
    - ATAC-Seq:PAIRED: 12 runs (120 GB)

User: Create a sample sheet for just the RNA-seq data

AI: [Uses sra_create_samples_sheet with RNA-seq runs]
    Generated samples.csv with 36 samples
    Download URL: https://storage.example.com/samples.csv
```
