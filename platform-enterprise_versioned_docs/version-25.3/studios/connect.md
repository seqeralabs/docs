---
title: Connect changelog
date created: "2025-07-30"
last updated: "2025-12-03"
tags: [connect, changelog, connect-changelog]
---

:::note
Always use the `recommended` tagged template image for new Studios. Only two earlier minor versions of Seqera Connect are supported by Seqera.
:::

## Connect server

### server/v0.9.0 `latest` - 2025-12-05

- Add: missing env when testing with platform livedev
- Fix: security vulnerabilities for crypto ssh library and slack nebula
- Upgrade go (from v1.24.3 to 1.25.3) and caddyserver (from 2.10.0 to 2.10.2)

### server/v0.8.4 - 2025-10-31

* N/A

### server/v0.8.3 - 2025-07-25

:::warning
Connect version 0.8.3 introduced a change which required the creation of a `/data` folder which was mounted to `connect-proxy`. If this is not done, the deployment will fail.
:::

* Extract Fusion version 
* Fix(proxy): include prefix in Location header

### server/v0.8.2 - 2025-07-21

* Add ability to set tool identifier after compile time
* Add mount data to initial configuration logs
* Add eStargz support to client images build
* Add management API tunnels `GET` requests
* Add `$` to `metrics_patch.txt`
* Add `connector_id` to stored tunnel host in Redis
* Add CPU/memory collector
* Add `connector_id` to identify sessions in logs
* Add support for multi-platform build of Connect clients (adding Linux/ARM64)
* Improve race condition `reOpening`, `compareAndDelete`, and `Handle`
* Simplify `sessionid` functionality interface
* Use `CONNECT_MANAGEMENT_PORT`for proxy instead of deprecated `CONNECT_METRICS_PORT`
* Disable resource collector
* Spot instance termination watcher implementation
* Create a client and server packages
* Restructure proxy package
* Use `synctest` in `executor_test.go`
* Basic structure of management API
* Enable path-based routing
* Update go-jose library (v3 from 3.0.3 to 3.0.4; v4 from 4.0.4 to 4.0.5)
* Update x/net dependency (from v0.36.0 to v0.40.0)
* Upgrade go (from v1.23.0 to v1.24.3) and xcaddy (from v2.9.1 to v2.10.0)
* Upgrade go in Dockerfiles (from v1.23 to v1.24)
* Bump golang.org/x/net (from v0.35.0 to v0.36.0)
* Bump dependencies that were using vulnerable golang.org/x/crypto (from v0.33.0 to v0.35.0)

### server/v0.8.1-rc - 2025-04-10

* Extend `GithubActions` to trigger clients publishing/promoting in downstream repo studio-templates
* `sync.Map`: use `Swap` instead of `LoadAndDelete`

### server/v0.8.0-rc - 2025-03-19

* Feat: update caddy reverse proxy to dynamic A record
* Feat: change proxy Docker command to be the same as before
* Feat: client mux implementation
* Feat: server connect-tunnel implementation
* Feat: in case view scope is missing from access token, redirect with auth callback error query parameter
* Feat: removal of `go-gost`, implement `connect-tunnel`, and upgrade go from v1.20 to v1.23
* Feat: micromamba based RStudio
* Feat: add Git hash to stage releases
* Feat: add 10 minutes' waiting period before failing notifying Platform
* Cut 0.8.0 release
* Upgrade xcaddy version (from v0.4.2 to v0.4.4)
* Release Server version 0.7.5

### server/v0.7.8 - 2025-03-06

* Feat: update caddy reverse proxy to dynamic a record
* Feat: client mux implementation
* Feat: micromamba based rstudio
* Feat: server connect-tunnel implementation
* Feat: in case view scope is missing form access token, redirect with auth callback error query parameter
* Feat: removal of `go-gost`, implement `connect-tunnel`, and upgrade `go` (from v1.20 to v1.23)
* Use Fusion v2.4.9
* Upgrade xcaddy version

### server/v0.7.7 - 2025-01-10

* Feat: change proxy Docker command to be the same as before

### server/v0.7.6 - 2025-01-08

* Latest release with adjusted workflow

### server/v0.7.5 - 2025-01-07

* Env var capital letters

## Connect client

### client/v0.9.0 `latest` - 2025-12-05

- Add: disk size and auto resizing based on compute env
- Add: version module and add support for client version 
- Fix: security vulnerabilities for crypto ssh library and slack nebula
- Upgrade go (from v1.24.3 to 1.25.3) and caddyserver (from 2.10.0 to 2.10.2)
- Bump server to 0.9.0

### client/v0.8.7 - 2025-10-14

* * Fix(vscode): incorrect path in Dockerfile

### client/v0.8.6 - 2025-10-14

* Fix(vscode): incorrect path in Dockerfile

### client/v0.8.5 - 2025-07-29

* Feat: add eStargz support to client images
* Feat: send squash notifications to platform 
* Feat: extract Fusion version 

### client/v0.8.4 - 2025-07-18

* Feat: enable path-based routing (optional `CONNECT_TOOL_PATH_PREFIX` as base URL)
* Feat: install pip for VS Code images
* Feat: enable GHA runner cache to improve build time performance

### client/v0.8.3 - 2025-06-19

* Fix: return normal err when server closes connection 

### client/v0.8.2 - 2025-06-17

* Add R-IDE option and remove unused scripts

### client/v0.8.1 - 2025-05-29

* Feat: delay running notification until the downstream is connectable
* Feat: Spot instance termination watcher implementation
* Feat: simplify `sessionid` functionality interface
* Update x/net dependency (from v0.36.0 to v0.40.0)
* Update go-jose library v3 (from 3.0.3 to 3.0.4) and v4 (from 4.0.4 to 4.0.5)
* Bump golang.org/x/net (from v0.35.0 to v0.36.0)
* Bump dependencies that were using vulnerable golang.org/x/crypto (from v0.33.0 to v0.35.0)
* Upgrade go (from v1.23.0 to v1.24.3) and xcaddy (from v2.9.1 to v2.10.0)
* Upgrade go in Dockerfiles (from v1.23 to v1.24)

### client/v0.8.0-rc - 2025-03-19

* fix: swap connector after closing previous

### client/v0.7.7 - 2025-03-07
 
* Feat: add 10 minutes waiting period before failing notifying Platform

### client/v0.7.6 - 2025-03-03

* Feat: micromamba based RStudio
* Feat: client mux implementation
* Feat: in case view scope is missing from access token, redirect with auth callback error query parameter
* Feat: removal of `go-gost`, implement `connect-tunnel`, and upgrade go (from v1.20 to v1.23)
* Feat: server connect-tunnel implementation
* Upgrade xcaddy version
* Use Fusion v2.4.9

### client/v0.7.5 - 2024-11-18

* Updated Fusion version (from v2.4.2 to v2.4.6) and use released Nextflow language server (v1.0.0) VS Code extension

### client/v0.7.4 - 2024-10-28

* Feat: default to run, specify entrypoint

### client/v0.7.2-rc 2024-09-26

* Feat: add micromamba to VS Code Docker image

### client/v0.7.1 - 2024-09-17

* Feat: workflows for publishing versioned images for dev/staging/prod
* Feat: template to test clients locally against dev
* Bump clients version
* Bump version to fixed one used for release
* Bump Fusion to v2.3.5
