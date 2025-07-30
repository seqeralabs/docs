---
title: Connect changelog
date: 2025-07-30
tags: [connect, changelog, connect-changelog]
---

## Connect server

### server/v0.8.20-rc - 2025-07-21

* Server version 0.8.1 was released to prod, bumping to next version \[skip ci]
* \[PLAT-2066] - Add ability to set tool identifier after compile time
* Add mount data to initial configuration logs
* Improvements: race condition reOpening, compareAndDelete and Handle
* Feat: simplify sessionid functionality interface
* Fix: use CONNECT\_MANAGEMENT\_PORT for proxy instead of deprecated CONNECT\_METRICS\_PORT
* Revert "Improvements: race condition reOpening, compareAndDelete and Handle"
* Update go-jose library
* Fix: add \$ to metrics\_patch.txt
* Log: switch to info register logs
* Add cpu/memory collector
* Add connector\_id to identify sessions in logs
* CompareAndDelete from connectors
* Disable resource collector
* Feat: spot instance termination watcher implementation
* Task/plat 2238 include resource usage in notifications
* Increment resource collection interval to 30 seconds
* Bump golang.org/x/net
* Add network metering to the client
* Bump dependencies that were using vulnerable golang.org/x/crypto
* Update x/net dependency
* Impr: logging json instead of byte slice base64
* Restructure: tunnel package client server split
* Fix: add timeout to notifier call
* Impr: log response status from Platform
* Disable template clients publishing from connect repository
* Fix: delete outstanding studio templates GHA file reference for tool version info
* Restructure: create a client and server packages
* Fix: update Dockerfile with replacements
* \[PLAT-2232] add support for multi-platform build of connect clients (adding linux/arm64)
* Restructure: proxy package
* Fix: do not watch reclamation when not spot instance
* Upgrade to go 1.24.3
* Docker: upgrade Dockerfiles to go 1.24
* Experimental: use synctest in executor\_test.go
* Basic structure of management API
* Implemented proxy log management API and logging reload
* Feature: management API tunnels get
* Fix permission error in proxy socket
* Client version 0.8.1 was released to prod, bumping to next version
* Implementation of user tracking notifications
* CI: add last release step
* Docs: updated local dev docs
* Chore: add ride option and remove unused scripts
* Management: API tunnels close
* Client version 0.8.2 was released to prod, bumping to next version
* Fix: return normal err when server closes connection
* Client version 0.8.3 was released to prod, bumping to next version
* Add set ready endpoint
* Feat: enable path routing
* Fix: include all arch when retagging images
* CI: add option to promote scratch client only
* Client version 0.8.4 was released to prod, bumping to next version
* Server(fix): add connector\_id to stored tunnel host in redis
* Chore(server): improve ECR transfer workflow
* Build(server): use prod cloud image as base for enterprise release
* Build(server): fix summary \[ci skip]
* Build(client): add eStargz support to client images build \[PLAT-3128]

### server/v0.8.1-rc - 2025-04-10

* Fix: swap connector after closing previous
* Server version 0.8.0 was released to prod, bumping to next version \[skip ci]
* Client version 0.8.0 was released to prod, bumping to next version
* Add connect-registry module
* Fix: add replace to Dockerfile for connect-registry
* Client: fix: re-open tunnel if websocket connection is broken or closed
* Fix: setup deadlineDuration instead of static deadline
* Task/plat 1817 connect core module
* Rename connect-registry to registry
* Revert: ping error handling
* Add log when close mux session
* Feat: delay running notification until the downstream is connectable
* \[PLAT-1829] - Extend GithubActions to trigger clients publishing/promoting in downstream repo studio-templates
* Fix: sync.Map: use Swap instead of LoadAndDelete
* \[PLAT-1744] add workflow dependency to have scratch-client published first, before triggering downstream client publishing
* \[Release server] cut release 0.8.1

### server/v0.8.0-rc - 2025-03-19

* Open websocket and smux session
* Remove gost logger and xlogger, use zap everywhere as in caddy
* Send`CmdBind` command in a websocket and receive the answer
* Receive and send heartbeat
* Upgrade xcaddy version
* Change default metrics port
* \[Release] server version 0.7.5
* Do not enable metrics if port not defined
* Update troubleshooting docs for local execution for macOS
* Add catalog-info.yaml config file
* Fix: failing proxy build
* Feat: new github workflows for releasing server component
* Fix: remove missing target level from parameters in github action
* Feat: change proxy docker command to be the same as before
* Feat: client mux implementation
* Infra: add option to trigger client build via ui
* Fix: the workflow file condition
* Fix: do not skip jobs when run by workflow dispatch
* Add the retry policy for opening tunnel
* Fix: handle closing listener
* Feat: server connect-tunnel implementation
* Lower log panic when closing connection by peer
* Feat: in case view scope is missing from access token, redirect with auth callback error query parameter
* Feat: removal of go-gost and upgrade go 1.23
* Disable integration tests
* Fix docker images
* Fix: make listener open when created
* Fix storage errors shown by caddy
* Fix: add retrying logic to dial tool
* Add some logs to allow investigation of resolveTarget errors
* Task/plat 916 expose tunnel metrics
* Fix docker files
* Fix recorder not being used
* Use fusion 2.4.9
* Fix: set server address based on real host
* Enable workflow dispatch for server release
* Feat: micromamba based rstudio
* Add specific error for reason when tunnel not found
* Add exponential backoff for reopening tunnel
* Client version 0.7.6 was released to prod, bumping to next version
* Feat: update caddy reverse proxy to dynamic a record
* Refactor: management API and simplification of connection pool
* \[PLAT-1802] Update ASCII welcome text in Xpra container template to "Seqera Studios"
* Fix: remove only keys that belong to current server
* Logs: bump version and add more error logs tunnel
* Feat: add 10 minutes waiting period before failing notifying platform
* Bug: PLAT-1850 closure and redis issues
* Logs: move to info logs level for redis calls
* Feat: add git hash to stage releases
* Fix: unregister tunnel only when host is correct
* Fix: release pipeline for minor version changes
* Fix quarto not loading and loading of libraries with native deps
* Fix: reorder close to not accept incoming connections
* Chore: add r-markdown to the default environment
* Transactional redis operation
* Fix: Get should not remove values, ws close performed just once
* Client: improve error message when open fails and do not retry on closed websocket
* Fix: get the result of redis cleanup
* Intercept signals properly and don't duplicate configuration
* \[Release server] cut 0.8.0 release
* Fix: swap connector after closing previous

### server/v0.7.8 - 2025-03-06

* Open websocket and smux session
* Remove gost logger and xlogger, use zap everywhere as in caddy
* Send CmdBind command in a websocket and receive the answer
* Receive and send heartbeat
* Upgrade xcaddy version
* Server version 0.7.7 was released to prod, bumping to next version \[skip ci]
* Feat: client mux implementation
* Infra: add option to trigger client build via ui
* Fix: the workflow file condition
* Fix: do not skip jobs when run by workflow dispatch
* Docs: update technical docs
* Add the retry policy for opening tunnel
* Fix: handle closing listener
* Feat: server connect-tunnel implementation
* Lower log panic when closing connection by peer
* Feat: in case view scope is missing form access token, redirect with auth callback error query parameter
* Feat: removal of go-gost and upgrade go 1.23
* Disable integration tests
* Fix docker images
* Fix: make listener open when created
* Fix storage errors shown by caddy
* Fix: add retrying logic to dial tool
* Add some logs to allow investigation of resolveTarget errors
* Task/plat 916 expose tunnel metrics
* Fix docker files
* Fix recorder not being used
* Use fusion 2.4.9
* Fix: set server address based on real host
* Enable workflow dispatch for server release
* Feat: micromamba based rstudio
* Add specific error for reason when tunnel not found
* Add exponential backoff for reopening tunnel
* Client version 0.7.6 was released to prod, bumping to next version
* Feat: update caddy reverse proxy to dynamic a record
* Refactor: management API and simplification of connection pool
* Update ASCII welcome text in Xpra container template to "Seqera Studios"
* Fix: remove only keys that belong to current server

### server/v0.7.7 - 2025-01-10

* Server version 0.7.6 was released to prod, bumping to next version \[skip ci]
* Allow server release to be triggered manually
* Feat: change proxy docker command to be the same as before

### server/v0.7.6 - 2025-01-08

* Server version 0.7.5 was released to prod, bumping to next version
* \[Release server]\[skip ci] latest release with adjusted workflow
* \[Release server]
* Minimal change just to trigger build
* Missing previous patch output
* \[Release server]

### server/v0.7.5 - 2025-01-07

* [release server] env var capital letters

## Connect client

### client/v0.8.4 `latest` - 2025-07-18

* PLAT-2947: shut down docker gracefully upon container shutdown
* Fix: Use correct latest snapshot connect-client version when workflow triggered from merge
* Feat: add optional CONNECT\_TOOL\_PATH\_PREFIX as base url
* Enable GHA runner cache to improve build time performance
* Fix: include all arch when retagging images
* Feat: install pip for vscode images
* Fix: remove extra space
* Fix: github action job output propagation

### client/v0.8.3 - 2025-06-19

* Client version 0.8.2 was released to prod, bumping to next version 
* fix: return normal err when server closes connection 

### client/v0.8.2 - 2025-06-17

* Client version 0.8.1 was released to prod, bumping to next version
* Implementation of user tracking notifications
* CI: add last release step
* Docs: updated local dev docs
* Chore: add ride option and remove unused scripts
* Management: API tunnels close

### client/v0.8.1 - 2025-05-29

* Fix: swap connector after closing previous
* Server version 0.8.0 was released to prod, bumping to next version \[skip ci]
* Client version 0.8.0 was released to prod, bumping to next version
* Add connect-registry module
* Fix: add replace to Dockerfile for connect-registry
* Client: fix: re-open tunnel if websocket connection is broken or closed
* Fix: setup deadlineDuration instead of static deadline
* Task/plat 1817 connect core module
* Rename connect-registry to registry
* Revert: ping error handling
* Add log when close mux session
* Feat: delay running notification until the downstream is connectable
* \[PLAT-1829] - Extend GithubActions to trigger clients publishing/promoting in downstream repo studio-templates
* Fix: sync.Map: use Swap instead of LoadAndDelete
* \[PLAT-1744] add workflow dependency to have scratch-client published first, before triggering downstream client publishing
* \[Release server] cut release 0.8.1
* Server version 0.8.1 was released to prod, bumping to next version \[skip ci]
* \[PLAT-2066] - Add ability to set tool identifier after compile time
* Add mount data to initial configuration logs
* Improvements: race condition reOpening, compareAndDelete and Handle
* Feat: simplify sessionid functionality interface
* Fix: use CONNECT\_MANAGEMENT\_PORT for proxy instead of deprecated CONNECT\_METRICS\_PORT
* Revert "Improvements: race condition reOpening, compareAndDelete and Handle"
* Update go-jose library
* Fix: add \$ to metrics\_patch.txt
* Log: switch to info register logs
* Add cpu/memory collector
* Add connector\_id to identify sessions in logs
* CompareAndDelete from connectors
* Disable resource collector
* Feat: spot instance termination watcher implementation
* Task/plat 2238 include resource usage in notifications
* Increment resource collection interval to 30 seconds
* Bump golang.org/x/net
* Add network metering to the client
* Bump dependencies that were using vulnerable golang.org/x/crypto
* Update x/net dependency
* Impr: logging json instead of byte slice base64
* Restructure: tunnel package client server split
* Fix: add timeout to notifier call
* Impr: log response status from Platform
* Disable template clients publishing from connect repository
* Fix: delete outstanding studio templates GHA file reference for tool version info
* Restructure: create a client and server packages
* Fix: update Dockerfile with replacements
* \[PLAT-2232] add support for multi-platform build of connect clients (adding linux/arm64)
* Restructure: proxy package
* Fix: do not watch reclamation when not spot instance
* Upgrade to go 1.24.3
* Docker: upgrade Dockerfiles to go 1.24
* Experimental: use synctest in executor\_test.go
* Basic structure of management API
* Implemented proxy log management API and logging reload
* Feature: management API tunnels get
* Fix permission error in proxy socket

### client/v0.8.0-rc - 2025-03-19

* fix: swap connector after closing previous

### client/v0.7.7 - 2025-03-07
 
* logs: bump version and add more error logs tunnel
* feat: add 10 minutes waiting period before failing notifying platform

### client/v0.7.6 - 2025-03-03

* Open websocket and smux session
* Remove gost logger and xlogger, use zap everywhere as in caddy
* Send CmdBind command in a websocket and receive the answer
* Receive and send heartbeat
* Upgrade xcaddy version
* Server version 0.7.7 was released to prod, bumping to next version \[skip ci]
* Feat: client mux implementation
* Infra: add option to trigger client build via ui
* Fix: the workflow file condition
* Fix: do not skip jobs when run by workflow dispatch
* Docs: update technical docs
* Add the retry policy for opening tunnel
* Fix: handle closing listener
* Feat: server connect-tunnel implementation
* Lower log panic when closing connection by peer
* Feat: in case view scope is missing from access token, redirect with auth callback error query parameter
* Feat: removal of go-gost and upgrade go 1.23
* Disable integration tests
* Fix docker images
* Fix: make listener open when created
* Fix storage errors shown by caddy
* Fix: add retrying logic to dial tool
* Add some logs to allow investigation of resolveTarget errors
* Task/plat 916 expose tunnel metrics
* Fix docker files
* Fix recorder not being used
* Use fusion 2.4.9
* Fix: set server address based on real host
* Enable workflow dispatch for server release
* Feat: micromamba based rstudio
* Add specific error for reason when tunnel not found
* Add exponential backoff for reopening tunnel

### client/v0.7.5 - 2024-11-18

* Client version 0.7.4 was released to prod, bumping to next version
* Doc: gost protocol
* Updated fusion version and use released vscode extension
* Fix: error mounting tmpfs /sys/fs/cgroup
* Fix: create mount target folder if not exists
* Fix: include ca certs in tunnel docker image
* Limit the number of integration tests, and improved local development
* Skip publish results if tests not run

### client/v0.7.4 - 2024-10-28

* Use a separate env variable for notification v2 protocol
* Doc: document client release process
* Fix integration tests and support for v2 protocol
* Return running state before stop and not found to fix v1 tests
* Fix: increase retry timeout for integration test
* Increase heartbeat interval
* Print configured version and linger period
* Hide env vars and log which notifier version is instantiated
* Notask/updated tools versions
* Fix jupyter package versions and ulimit bug
* Release scratch image alongside supported clients
* Quickfix typo
* Notask/experiment simplified image
* Notask/gpu
* Feat: default to run, specify entrypoint
* Fix integration tests
* Fix: entrypoint
* Fix: if notifier is nil, do not notify
* Minor vscode fixes
* Updated rstudio client to not use rocker images
* Revert "Updated rstudio client to not use rocker images"

### client/v0.7.2-rc 2024-09-26

* Client version 0.7.1 was released to prod, bumping to next version
* Fix: correct release update
* Notification protocol document
* Feat: add micromamba to vscode docker image

### client/v0.7.1 - 2024-09-17

* Gracefully exit the client on failure
* Run clients locally
* Notask/warning notifications
* Feat: workflows for publishing versioned images for dev/staging/prod
* Fix: missed updating input to tags
* Fix: typo in ulimit param
* Fix: env var cannot use another env var
* Fix: condition typo
* Chore: remove go test from client release
* Allow sudo for user and use workspace dir
* Bump clients version
* Retry connecting to tool
* Update release client action
* Fix: restore writable permissions on mounted databind subfolders
* Stop client if tunnel registration is unsuccessful a number of times
* No caddyfile
* Implement error codes for client
* Feat: template to test clients locally against dev
* Chore: update LOCAL\_DEV.md
* Shared version action
* Fix version github action
* Fix: condition and missing checkout
* Impr: version increase and small improvements
* Fix: use exact caddy version
* Simple initial integration tests
* Notask/docs update
* Fix csp header injection
* Task/119 rebased variable name alignment
* Added xpra base container recipe
* Reconcile on status update response
* Github action to push images to enterprise
* Fix missing comma in gha workflow
* Fix workflow file again
* Bump version to fixed one used for release
* Adding permissions block so the action can assume the new IAM role
* Fix: always trigger test workflow
* Fix: get some extra space on build machines
* Use the new ConnectPushToEcrRole role to push connect server images too
* Fix: passing secret and removing xpra
* Explicitly handle SIGTERM in init script
* Fix: reduced size of xpra image and removed unnecessary packages
* Fix clients CD pipeline
* Stop xpra container gracefully, fix xpra integration tests
* Hacky way to fix rstudio wrong redirect
* Fix rstudio version 4.4
* Add custom xpra wallpaper
* \[story] New versioning and new rstudio
* GHA fixes
* GHA fixes part 2
* \[Docs] Add a note about incompatible arch and pulling an image for the first time
* Fix: optional client auth certificate for redis tls connection
* Task/plat 462 refine gha
* Some more minor fixes
* Bump fusion to v2.3.5
* Fix: update clients to fusion compatible version
* Notask/gha fixes 5

