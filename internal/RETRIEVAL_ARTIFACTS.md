# Retrieval Artifacts

The docs build publishes a canonical retrieval corpus under `build/retrieval/`.
Consumers such as Portal/Co-Scientist, docs Ask AI, and future internal tools can
ingest these artifacts instead of re-cloning and re-chunking the docs repo.

## Artifacts

- `manifest.json`: schema version, source commit, corpus counts, chunking
  settings, embedding profiles, artifact paths, record counts, and checksums.
- `chunks.jsonl.gz`: one JSON object per canonical docs chunk.
- `embeddings/<profile>.jsonl.gz`: optional embedding vectors keyed by
  `chunk_id`.

Generated chunk records include:

- `chunk_id`
- `source_id`
- `source_file`
- `source_path`
- `source_commit`
- `product`
- `tag`
- `kind`
- `version`
- `language`
- `title`
- `hierarchy`
- `heading_path`
- `url`
- `anchor`
- `content_hash`
- `content`

## Commands

```bash
npm run build:retrieval
npm run build:retrieval:validate
npm run build:retrieval:embeddings
```

`npm run build` also runs `build:retrieval` through `postbuild`, so chunks stay
fresh with the published docs site. Embeddings are explicit because they require
AWS credentials and incur Bedrock usage.

## Bedrock Profile

The current embedding profile is:

- profile: `bedrock-titan-v2-1024`
- provider: Bedrock
- model: `amazon.titan-embed-text-v2:0`
- dimensions: `1024`
- normalized: `true`

The embedding command expects standard AWS environment credentials:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN` (optional)
- `BEDROCK_REGION`, `AWS_REGION`, or `AWS_DEFAULT_REGION`

## Consumer Contract

The docs repo owns corpus production: canonical chunk text, product metadata,
URLs, checksums, and optional embedding profiles.

Consumers own serving indexes:

- Portal can ingest chunks and Bedrock vectors into Redis Stack, then keep its
  generation promotion, rollback, BM25 fields, and retrieval logic.
- Typesense Ask AI can ingest the same chunks into its own collection and either
  reuse a compatible embedding profile or generate a separate one later.
