---
title: Connect changelog
date created: "2025-07-30"
last updated: "2025-09-13"
tags: [connect, changelog, connect-changelog]
---

## Connect server

### server/v0.8.3 `latest` - 2025-07-25

* Released 0.8.2 - bump server version
* Extract Fusion version to it's own constant
* Fix location header for path-based routing reverse proxy requests

### server/v0.8.2 - 2025-07-21

* Add ability to set tool identifier after compile time
* Add mount data to initial configuration logs
* Add eStargz support to client images build
* Add Slack notification for Enterprise release
* Add missing Slack webhook secret
* Add management API tunnels `GET` requests
* Add `$` to `metrics_patch.txt`
* Add `connector_id` to stored tunnel host in Redis
* Add CPU/memory collector
* Add option to promote scratch client only
* Add set ready endpoint
* Add last release step to CI
* Add R-IDE option and remove unused scripts
* Add management API tunnels close
* Add network metering to the client
* Add `connector_id` to identify sessions in logs
* Add support for multi-platform build of Connect clients (adding Linux/ARM64)
* Improve race condition `reOpening`, `compareAndDelete`, and `Handle`
* Simplify `sessionid` functionality interface
* Use `CONNECT_MANAGEMENT_PORT`for proxy instead of deprecated `CONNECT_METRICS_PORT`
* Switch to info register logs
* `CompareAndDelete` from connectors
* Disable resource collector
* Spot instance termination watcher implementation
* Include resource usage in notifications
* Increment resource collection interval to 30 seconds
* Logging JSON instead of byte slice Base64
* Restructure: tunnel package client server split
* Log response status from Platform
* Disable template clients publishing from connect repository
* Create a client and server packages
* Restructure proxy package
* Use `synctest` in `executor_test.go`
* Basic structure of management API
* Implemented proxy log management API and logging reload
* Implemented of user tracking notifications
* Updated local dev docs
* Return normal err when server closes connection
* Enable path-based routing
* Include all arch when retagging images
* Improve ECR transfer workflow
* Use prod Cloud image as base for Enterprise release
* Fix summary
* Fix permission error in proxy socket
* Fix: do not watch reclamation when not Spot instance
* Fix: delete outstanding studio templates GHA file reference for tool version info
* Fix: add timeout to notifier call
* Fix: update Dockerfile with replacements
* Client version 0.8.1 was released to prod, bumping to next version
* Client version 0.8.2 was released to prod, bumping to next version
* Client version 0.8.3 was released to prod, bumping to next version
* Client version 0.8.4 was released to prod, bumping to next version
* Update go-jose library (v3 from 3.0.3 to 3.0.4; v4 from 4.0.4 to 4.0.5)
* Update x/net dependency (from v0.36.0 to v0.40.0)
* Upgrade go (from v1.23.0 to v1.24.3) and xcaddy (from v2.9.1 to v2.10.0)
* Upgrade go in Dockerfiles (from v1.23 to v1.24)
* Bump golang.org/x/net (from v0.35.0 to v0.36.0)
* Bump dependencies that were using vulnerable golang.org/x/crypto (from v0.33.0 to v0.35.0)

### server/v0.8.1-rc - 2025-04-10

* Add workflow dependency to have scratch-client published first, before triggering downstream client publishing
* Add log when close mux session
* Add connect-registry module
* Add replace to Dockerfile for connect-registry
* Re-open tunnel if websocket connection is broken or closed
* Set up `deadlineDuration` instead of static deadline
* Rename `connect-registry` to `registry`
* Swap connector after closing previous
* Delay running notification until the downstream is connectable
* Extend `GithubActions` to trigger clients publishing/promoting in downstream repo studio-templates
* `sync.Map`: use `Swap` instead of `LoadAndDelete`
* Update connect core module
* Server version 0.8.0 was released to prod, bumping to next version
* Client version 0.8.0 was released to prod, bumping to next version
* Cut release 0.8.1

### server/v0.8.0-rc - 2025-03-19

* Feat: update caddy reverse proxy to dynamic A record
* Feat: new GitHub workflows for releasing server component
* Feat: change proxy Docker command to be the same as before
* Feat: client mux implementation
* Feat: server connect-tunnel implementation
* Feat: in case view scope is missing from access token, redirect with auth callback error query parameter
* Feat: removal of `go-gost`, implement `connect-tunnel`, and upgrade go from v1.20 to v1.23
* Feat: micromamba based RStudio
* Feat: add Git hash to stage releases
* Feat: add 10 minutes' waiting period before failing notifying Platform
* Add `catalog-info.yaml` config file
* Add the retry policy for opening tunnel
* Add retrying logic to dial tool
* Add some logs to allow investigation of `resolveTarget` errors
* Add r-markdown to the default environment
* Add specific error for reason when tunnel not found
* Add exponential backoff for reopening tunnel
* Improve error message when open fails and do not retry on closed websocket for Connect Client
* Open websocket and smux session
* Remove gost logger and xlogger, use zap everywhere as in caddy
* Send `CmdBind` command in a websocket and receive the answer
* Receive and send heartbeat
* Change default metrics port
* Do not enable metrics if port not defined
* Update troubleshooting docs for local execution for macOS
* Lower log panic when closing connection by peer
* Disable integration tests
* Make listener open when created
* Expose tunnel metrics
* Set server address based on real host
* Enable workflow dispatch for server release
* Refactor management API and simplification of connection pool
* Update ASCII welcome text in Xpra container template to "Seqera Studios"
* Transactional Redis operation
* Intercept signals properly and don't duplicate configuration
* Fix quarto not loading and loading of libraries with native deps
* Fix Docker files
* Fix Docker images
* Fix recorder not being used
* Fix storage errors shown by caddy
* Fix closure and Redis issues
* Fix: handle closing listener
* Fix: remove only keys that belong to current server
* Fix: the workflow file condition
* Fix: do not skip jobs when run by workflow dispatch
* Fix: Get should not remove values, ws close performed just once
* Fix: swap connector after closing previous
* Fix: get the result of Redis cleanup
* Fix: failing proxy build
* Fix: remove missing target level from parameters in GitHub action
* Fix: unregister tunnel only when host is correct
* Fix: release pipeline for minor version changes
* Fix: reorder close to not accept incoming connections
* Logs: bump version and add more error logs tunnel
* Logs: move to info logs level for redis calls
* Infra: add option to trigger client build via UI
* Cut 0.8.0 release
* Update CI if statement
* Use Fusion v2.4.9
* Upgrade xcaddy version (from v0.4.2 to v0.4.4)
* Release Server version 0.7.5
* Client version 0.7.6 was released to prod, bumping to next version

### server/v0.7.8 - 2025-03-06

* Feat: update caddy reverse proxy to dynamic a record
* Feat: client mux implementation
* Feat: micromamba based rstudio
* Feat: server connect-tunnel implementation
* Feat: in case view scope is missing form access token, redirect with auth callback error query parameter
* Feat: removal of `go-gost`, implement `connect-tunnel`, and upgrade `go` (from v1.20 to v1.23)
* Add specific error for reason when tunnel not found
* Add exponential backoff for reopening tunnel
* Add the retry policy for opening tunnel
* Add some logs to allow investigation of `resolveTarget` errors
* Open websocket and smux session
* Remove gost logger and xlogger, use zap everywhere as in caddy
* Send `CmdBind` command in a websocket and receive the answer
* Receive and send heartbeat
* Update technical docs
* Lower log panic when closing connection by peer
* Disable integration tests
* Expose tunnel metrics
* Enable workflow dispatch for server release
* Refactor management API and simplification of connection pool
* Update ASCII welcome text in Xpra container template to "Seqera Studios"
* Fix Docker files
* Fix Docker images
* Fix recorder not being used
* Fix storage errors shown by caddy
* Fix: set server address based on real host
* Fix: the workflow file condition
* Fix: do not skip jobs when run by workflow dispatch
* Fix: make listener open when created
* Fix: add retrying logic to dial tool
* Fix: handle closing listener
* Fix: remove only keys that belong to current server
* Infra: add option to trigger client build via UI
* Use Fusion v2.4.9
* Upgrade xcaddy version
* Server version 0.7.7 was released to prod, bumping to next version
* Client version 0.7.6 was released to prod, bumping to next version

### server/v0.7.7 - 2025-01-10

* Feat: change proxy Docker command to be the same as before
* Allow server release to be triggered manually
* Server version 0.7.6 was released to prod, bumping to next version

### server/v0.7.6 - 2025-01-08

* Latest release with adjusted workflow
* Minimal change just to trigger build
* Missing previous patch output
* Update CI if statement
* Server version 0.7.5 was released to prod, bumping to next version

### server/v0.7.5 - 2025-01-07

* Env var capital letters

## Connect client

### client/v0.8.4 `latest` - 2025-07-18

* Feat: add optional `CONNECT_TOOL_PATH_PREFIX` as base URL
* Feat: install pip for VS Code images
* Shut down Docker gracefully upon container shutdown
* Enable GHA runner cache to improve build time performance
* Fix: use correct latest snapshot Connect-client version when workflow triggered from merge
* Fix: include all arch when retagging images
* Fix: remove extra space
* Fix: GitHub action job output propagation

### client/v0.8.3 - 2025-06-19

* Fix: return normal err when server closes connection 
* Client version 0.8.2 was released to prod, bumping to next version 

### client/v0.8.2 - 2025-06-17

* Add R-IDE option and remove unused scripts
* Add last release step to CI
* Implementation of user tracking notifications
* Updated local dev docs
* API tunnels close
* Client version 0.8.1 was released to prod, bumping to next version

### client/v0.8.1 - 2025-05-29

* Feat: delay running notification until the downstream is connectable
* Feat: Spot instance termination watcher implementation
* Feat: simplify `sessionid` functionality interface
* Add management API tunnels `GET` requests
* Add connect-registry module
* Add support for multi-platform build of connect clients (adding Linux/ARM64)
* Add network metering to the client
* Add workflow dependency to have scratch-client published first, before triggering downstream client publishing
* Add ability to set tool identifier after compile time
* Add log when close mux session
* Add mount data to initial configuration logs
* Re-open tunnel if websocket connection is broken or closed
* Set up `deadlineDuration` instead of static deadline
* Update connect core module
* Rename `connect-registry` to `registry`
* Extend `GithubActions` to trigger clients publishing/promoting in downstream repo studio-templates
* `sync.Map`: use `Swap` instead of `LoadAndDelete`
* Improved race condition `reOpening`, `compareAndDelete`, and `Handle`
* Use `CONNECT_MANAGEMENT_PORT` for proxy instead of deprecated `CONNECT_METRICS_PORT`
* Revert "Improvements: race condition `reOpening`,`compareAndDelete`, and `Handle`"
* Add CPU/memory collector
* Add `connector_id` to identify sessions in logs
* `CompareAndDelete` from connectors
* Disable resource collector
* Include resource usage in notifications
* Increment resource collection interval to 30 seconds
* Improve logging JSON instead of byte slice Base64
* Restructure: tunnel package client server split
* Improve log response status from Platform
* Disable template clients publishing from connect repository
* Create a client and server packages
* Restructure proxy package
* Use synctest in `executor_test.go`
* Basic structure of management API
* Implemented proxy log management API and logging reload
* Switch to info register logs
* Fix permission error in proxy socket
* Fix: add `$` to `metrics_patch.txt`
* Fix: delete outstanding Studio templates GHA file reference for tool version info
* Fix: do not watch reclamation when not Spot instance
* Fix: add replace to Dockerfile for connect-registry
* Fix: add timeout to notifier call
* Fix: swap connector after closing previous
* Fix: update Dockerfile with replacements
* Cut server release 0.8.1
* Server version 0.8.0 was released to prod, bumping to next version 
* Client version 0.8.0 was released to prod, bumping to next version
* Server version 0.8.1 was released to prod, bumping to next version
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
* Logs: bump version and add more error logs tunnel

### client/v0.7.6 - 2025-03-03

* Feat: micromamba based RStudio
* Feat: client mux implementation
* Feat: in case view scope is missing from access token, redirect with auth callback error query parameter
* Feat: removal of `go-gost`, implement `connect-tunnel`, and upgrade go (from v1.20 to v1.23)
* Feat: server connect-tunnel implementation
* Add specific error for reason when tunnel not found
* Add exponential backoff for reopening tunnel
* Add the retry policy for opening tunnel
* Add some logs to allow investigation of `resolveTarget` errors
* Open websocket and smux session
* Expose tunnel metrics
* Remove gost logger and xlogger, use zap everywhere as in caddy
* Send `CmdBind` command in a websocket and receive the answer
* Receive and send heartbeat
* Enable workflow dispatch for server release
* Update technical docs
* Lower log panic when closing connection by peer
* Disable integration tests
* Fix Docker images
* Fix Docker files
* Fix recorder not being used
* Fix storage errors shown by caddy
* Fix: make listener open when created
* Fix: add retrying logic to dial tool
* Fix: the workflow file condition
* Fix: do not skip jobs when run by workflow dispatch
* Fix: handle closing listener
* Fix: set server address based on real host
* Infra: add option to trigger client build via ui
* Upgrade xcaddy version
* Server version 0.7.7 was released to prod, bumping to next version
* Use Fusion v2.4.9

### client/v0.7.5 - 2024-11-18

* Limit the number of integration tests, and improved local development
* Skip publish results if tests not run
* Doc: gost protocol
* Fix: error mounting `tmpfs /sys/fs/cgroup`
* Fix: create mount target folder if not exists
* Fix: include ca certs in tunnel Docker image
* Updated Fusion version (from v2.4.2 to v2.4.6) and use released Nextflow language server (v1.0.0) VS Code extension
* Client version 0.7.4 was released to prod, bumping to next version

### client/v0.7.4 - 2024-10-28

* Feat: default to run, specify entrypoint
* Use a separate env variable for notification v2 protocol
* Document client release process
* Return running state before stop and not found to fix v1 tests
* Increase heartbeat interval
* Print configured version and linger period
* Hide env vars and log which notifier version is instantiated
* Updated tools versions
* Experiment with simplified image
* Bind all container mount points for GPUs
* Fix integration tests and support for v2 protocol
* Fix Jupyter package versions and ulimit bug
* Fix integration tests
* Fix: entrypoint
* Fix: if notifier is nil, do not notify
* Fix: increase retry timeout for integration test
* Release scratch image alongside supported clients
* Minor VS Code fixes
* Updated RStudio client to not use rocker images
* Revert "Updated rstudio client to not use rocker images"

### client/v0.7.2-rc 2024-09-26

* Feat: add micromamba to VS Code Docker image
* Notification protocol document
* Fix: correct release update
* Client version 0.7.1 was released to prod, bumping to next version

### client/v0.7.1 - 2024-09-17

* Feat: workflows for publishing versioned images for dev/staging/prod
* Feat: template to test clients locally against dev
* Add warning notifications
* Add custom Xpra wallpaper
* Add a docs note about incompatible arch and pulling an image for the first time
* Gracefully exit the client on failure
* Run clients locally
* Remove go test from client release
* Allow sudo for user and use workspace dir
* Retry connecting to tool
* Update release client action
* Stop client if tunnel registration is unsuccessful a number of times
* No caddyfile
* Implement error codes for client
* Update `LOCAL_DEV.md`
* Shared version action
* Improve version increase and small improvements
* Simple initial integration tests
* Docs update
* Rebased variable name alignment
* Added Xpra base container recipe
* Reconcile on status update response
* GitHub action to push images to Enterprise
* Adding permissions block so the action can assume the new IAM role
* Use the new `ConnectPushToEcrRole` role to push Connect Server images too
* Explicitly handle `SIGTERM` in init script
* Stop Xpra container gracefully, fix Xpra integration tests
* Hacky way to fix RStudio wrong redirect
* New versioning and new RStudio
* GitHub actions fixes
* GitHub actions fixes
* Refine GitHub actions
* GitHub actions fixes
* Fix RStudio version 4.4
* Fix missing comma in GHA workflow
* Fix workflow file again
* Fix csp header injection
* Fix clients CD pipeline
* Fix version GitHub action
* Fix: use exact caddy version
* Fix: condition and missing checkout
* Fix: always trigger test workflow
* Fix: update clients to Fusion-compatible version
* Fix: passing secret and removing xpra
* Fix: optional client auth certificate for Redis TLS connection
* Fix: get some extra space on build machines
* Fix: restore writable permissions on mounted databind subfolders
* Fix: missed updating input to tags
* Fix: typo in ulimit param
* Fix: env var cannot use another env var
* Fix: reduced size of xpra image and removed unnecessary packages
* Fix: condition typo
* Bump clients version
* Bump version to fixed one used for release
* Bump Fusion to v2.3.5
