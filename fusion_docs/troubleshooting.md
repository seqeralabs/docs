---
title: Troubleshooting Fusion issues
---

## Too many open files

If you're experiencing an error about too many open files, increase the `ulimit` for the container. Append the following configuration to your Nextflow configuration:

```groovy
process.containerOptions = '--ulimit nofile=1048576:1048576'
```
