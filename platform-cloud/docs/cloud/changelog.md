---
title: "Cloud changelog"
description: "Seqera Platform Cloud changelog"
date: "4 July 2024"
tags: [changelog]
---

### v24.2.0_cycle24 — 25 September 2024

- Feature: Azure service principal credentials
- Feature: Data Studios: Add direct Data Explorer browse link to mounted data items
- Feature: Data Studios: Make studio details page tabs routable
- Feature: Define cache configuration once, only override changes
- Improvement: Data Explorer: Highlight invalid custom datalinks
- Improvement: Disable AWS and Google Batch spot instance auto retry
- Improvement: Data Explorer: Remove folder validation
- Improvement: Update 204 pipeline schema response description
- Improvement: Patch workflow revision
- Improvement: Render Parameters UI correctly with new schemas based on 2020-12 draft
- Improvement: Upgrade to Angular 16
- Improvement: Pipeline launch form: Delegate form creation to a form builder service
- Fix: Connection to Redis SSL server
- Fix: `pairingId` declaration in API schema
- Fix: Copying empty list for cloud data links
- Fix: Visual glitches in launch form
- Fix: Datalink status always null
- Fix: Update last used field in compute environment when creating a data studio job
- Fix: `Terminated by Tower` error

### v24.2.0_cycle23 — 2 September 2024

- Fix: [Data Explorer] enable task working directory navigation using Data Explorer in personal workspaces by adding routing
- Fix: Remove -/+ increment buttons from numeric input components in Platform, including compute environment and launch form interfaces
- Fix: Hide compute environment variables section actions when component is disabled (previously indicated that environment variables could be edited in this state)

### 24.2.0_cycle21 — 13 August 2024

- Feature: Add global Nextflow configuration support in compute environments
- Feature: Add flexibility for pipeline names in workspaces
- Feature: Add tag propagation to launch templates
- Feature: Add managed identities support for manual Azure Batch compute environments
- Feature: Implement custom launch container logic
- Fix: Improve workflow launch screen look and feel
- Fix: Allow pipeline work directory to be changed during pipeline launch
- Fix: Handle special characters in prompt modal confirmation text regex
- Bump nf-launcher:j17-24.04.4
- Bump codecommit 0.2.1

### 24.2.0_cycle20 — 25 July 2024

- Feature: Add code blocks syntax highlighting and background color
- Improvement: Role selector dropdown detail
- Improvement: Update navbar help & support links
- Fix: Disable launch form submit button during form validation
- Fix: Update team guest welcome email visuals and copy
- Fix: Tag search with underscore
- Fix: Add missing gap between shared badge and labels
- Fix: Data Studios template override
- Fix: View credentials back navigation
- Fix: Data Explorer search bar misalignment
- Fix: Parameters merging in schema form without key in schema
- Bump nf-launcher:24.04.3

### 24.1.0 - May 2024

- Managed identities:
  * Allow organization members and collaborators to list managed identities
- Data Studios: 
  * Data studio user activity auditlog
  * Delete checkpoints
  * Rename checkpoints
- Data Explorer:
  * Multi-download functionality

### 23.3.0 - 16 October 2023

- Feature: Add feedback form to mkdocs
- Feature: [Data Explorer M4.2]: use Data Explorer to navigate workflow and tasks work directories
- Feature: Do not install aws cli when fusion 2 is enabled
- Added: Reverse proxy instructions to the docs
- Added: Audit logs to data explorer
- Added: Docs page about meta endpoint for firewall configuration
- Improved: Audit logs count query by
- Improve error message when creating private data link as public
- Updated: Git integration page - admonition fix
- Fixed: Do not leave search box disabled when there are no  results in r…
- Fixed: Dataset limit provides misleading result
- Fixed: add missing https://*.$host to connect-src CSP headers
- Fixed: Missing double quote for _JAVA_OPTIONS value
- Fixed: Data explorer previewing Google files instead of downloading
- Fixed: Optimization service response proxied by Tower
- Fixed: Redisson Hibernate 2nd-level cache config
- Fixed: Live updates broadcasting
- Fixed: Description of wall time
- Migrate: Several Modals to Material design MatDialog
- Migrate WorkflowLaunchReportsComponent to use MatDialog
- Decrease audit log lifespan for cloud
- tw CLI note about spot allocation strategy in AWS CEs
- task add download as json option for workflow run parameters
- Show cloud data links without schema prefix
- [Task] Implement pipelinesecretsprovider for Google Cloud
- [Data Explorer M3.2] Support uploading files to bucket
- Implement live events endpoint with WebSockets
- Set workflow unknown refactor
- Permission checker for pipeline launch with simple labels
- Remove objects without name from explorer
- Delete unused LaunchpadItemComponent
- Add support for cloudcache
- Creation of public AWS datalinks fails in cloud
- Enhancements on the cloud bucket creation dialog
- tweak: adjust dataset form buttons according to figma
- Adjust batch locations and gcp locations list
- Return full error message when JsonParseException
- Hide data explorer navigation elements if it is not enabled in the workspace
- Configuration overview updates

### 23.2.0 - 31 Jul 2023

- Added: Support for Fargate for head job
- Added: Support for Graviton architecture in AWS Batch compute environments
- Added: Ability to rename Actions, CEs, Pipelines, and Workspaces
- Added: support for AWS SES (simple email service) as alternative to SMTP service for sending emails
- Added: Ability to edit the names of Tower entities:
  - Organizations
  - Workspaces
  - Compute environments
  - Pipelines
  - Actions
- Added: Support for mobile screen layout in **Runs** list page
- Allow advanced settings in the AWS ECS config field
- Allow Launcher users to create, edit, and upload datasets
- Fixed: AWS Batch allocation strategy: `BEST_FIT_PROGRESSIVE` for on-demand CEs and `SPOT_CAPACITY_OPTIMIZED` for spot CEs
- Updated: **Runs** list page with new status badges and improved layout
- Updated: Enable GPU label, sublabel, and add warning when activated
- Increase the AWS Batch Memory / CPUs ratio to 4GB
- Harmonize list sorting in **Compute environments** and **Credentials** list pages
- Set workflow status to unknown when job status is also in an unknown state

### 23.1.3 - 09 Jun 2023

- Reverted: `Set BEST_FIT_PROGRESSIVE` as default AWS Batch allocation strategy (#5126)
- Fixed: Unable to view workflow details on runs page on the newest version of Chrome #5105
- Fixed: AWS SSE setting configuration (#5067)
- Fixed: Failing tests
- Fixed: Mat dropdown options height (#5134)
- Bump: nf-launcher version j17-23.04.2

### 23.1.0 - 28 Apr 2023

- Added: Fusion logs download (#4385) [49eb6dbe]
- Added: Fusion support for Google Batch (#4654) [968d9fb1]
- Added: Missing launch option in pipeline action menu (#4441) [56313780]
- Added: Source reference to launch entity (#4527) [bd073128]
- Added: Support for AWS Parameters Store (#4563) [0f9f5400]
- Added: Teams management to admin panel (#4553) [8e019921]
- Added: **Save run as pipeline** (#4610) [a14e1280]
- Added: Workspace selection in All runs page [b574db06]
- Added: Launchpad redesign with list and cards views (#4110) [92345120]
- Added: Ability to export dashboard data as CSV (#4463) [765931ad]
- Added: Azure repos credentials (#4012) [f03f8a55]
- Added: The possibility to customize the log format (#4558) [3891345c]
- Added: Wave pairing via websockets (#4624) [cf16292e]
- Added: Dashboard stats date filter (#4575) [86e95d3e]
- Added: `AWS_MAX_ATTEMPTS` and `AWS_RETRY_MODE` to Batch launch environment (#4738) [e7ec2c96]
- Allowed: S3 `PutObjectTagging` to instance role created by Batch Forge (#4511) [c8c8e76a]
- Allowed: Exact match search filters (#4396) [d90acc18]
- Allowed: To share a Tower Agent connection (#4395) [1cfaee91]
- Allowed: The customisation prefix of Batch Forge resources (#4693) [67072462]
- Move workflow deletion audit event to service method (#4531) [9b56ad79]
- Remove required check from "headQueue" field in grid platform providers (#4655) [782ab02d]
- Improved: Fusion v2 support for EBS disk (#4740) [e1d280d1]
- Improved: Config properties documentation reference (#4757) [01d08d9d]
- Improved: Support for AWS SSM as Params store (#4824) [3e2c568d]
- Improved: Trace service removing blocking queue (#4427) [1c788612]
- Increase 10 min length for pwd hint (#4606) [6adaba95]
- Deprecate Fusion v1 (#4694) [74fb5bd6]
- Fixed: Partial failure workflow status icon shows green check (#4371) [981aeb26]
- Fixed: Missing AWS Cloudstream logs (#4476) [3d88a618]
- Fixed: NPE when retrieving progress usage data  (#4621) [85c4836c]
- Fixed: Bug that throws ConcurrentModificationException while cancelling tasks (#4656) [9d0eda97]
- Fixed: Cancellation of a workflow already terminated (#4622) [d665beeb]
- Fixed: "Row size too large" MySQL problem (#4688) [793471da]
- Fixed: Incorrect loading of Runs page after launching a pipeline (#4530) [b297bf42]
- Fixed: Make OAuth 2 cookies secured (#4478) [904e1e2d]
- Fixed: Return HTTP 503 error when Redis is not available (#4605) [fa88e17d]
- Fixed: Set name on FSx file system create by Tower (#4393) [cb631a72]
- Fixed: Datasets page CSV viewer crashes if there is an empty column and first row as header is checked (#4489) [21275c9a]
- Fixed: Handle unexpected error when accessing Azure repos with node creds (#4707) [6df882f0]
- Fixed: Relaunch workflow form does not populate the CE field if initial CE was deleted (#4538) [1fc7494f]
- Fixed: Do not show incomplete text on Launchpad for Launcher users (#4495) [1ed88626]
- Fixed: Navigate to Pipeline detail from "Pipeline successfully saved" notification (#4774) [0420c0d8]
- Fixed: Prevent changing launch work dir inside pipeline input form (#4408) [496827ea]
- Fixed: Properly display default Launchpad sort option (#4492) [1e712aa3]
- Fixed: Remove duplicate ECS config input in AWS CE form (#4423) [52d057ab]
- Fixed: Remove secrets controls if CE does not support them (#4714) [f3137ca7]
- Fixed: Restore Launchpad loading indicator (#4509) [9b3fbc26]
- Fixed: Sanitize characters in job and workflow error text messages (#4712) [0e6b2b7d]
- Fixed: Tag correctly compute environment and service role when resource (#4379) [ed96b5a6]
- Fixed: Workflow deletion failure when has a launch record associated (#4786) [9778e579]
- Fixed: Workflow launch form autoselects CE when workspace is shared (#4744) [9b6c5df8]
- Bump: Version nf-launcher:j17-23.04.1 [72eaa795]
- Bump: Micronaut to version 3.8.5 (#4324) [79c1e50c]

### 22.4.2 - 21 Feb 2023

- Fixed: Issue retrieving execution logs from CloudWatch (#4476) [638513b7]
- Fixed: Issue setting AWS CloudWatch custom log group name (#4475) [f020719c]
- Chore: Improve cloudwatch labels (#4498) [69b790fa]
- Bump: nf-launcher:j17-22.10.7 [a7b6fd26]

### 22.4.1 - 10 Feb 2023

- Fixed: Add auto height to selectable columns (#4409) [e4f62488]
- Fixed: Remove duplicate ECS config input in AWS CE form (#4423) [3dbb0dad]

### 22.4.0 - 6 Feb 2023

- Feat: All workflow runs page (#3777) [b89ba895]
- Feat: Refresh the dashboard data every 5 seconds (#3935) [dd65935d]
- Feat: Support for Gitea provider (#3995) [c1640d7b]
- Feat: Allow resume workflow in different CEs having compatible work directory (#4169) [ae782606]
- Feat: AWS Batch ECS custom configuration [1a5faf12]
- Feat: Wave pairing naming refactor (#4300) [c9c9dc8f]
- Feat: Pipeline and workflow resource labels customization (#3955) [b1fa9756]
- Added: `europe-west2` location for Google Batch (#4203) [8bfda45c]
- Added: Missing lvm2 package to be able to mount multiple NVMe disks as a single volume (#4091) [4ffba872] [80c72e1c]
- Added: Support for custom CloudWatch logs group name (#3866) [97156c57]
- Added: Missing sourceWorkspaceId OpenAPI parameters (#4050) [72fa1822]
- Added: Fusion NVMe support (#3942) [9ea72cc9]
- Added: Credentials/keys endpoint [25906e00]
- Fixed: Prevent calling BE with undefined `workspaceId` (#4349) [25943dd3]
- Fixed: Relaunch of Tower actions should preserve parameters (#4270) [2a232104]
- Fixed: iframe for HTML reports (#4135) [bb878118]
- Fixed: Azure CE creation fails in CI because of auto-scaling formula (#4180) [35543dd4]
- Fixed: Replace clr running color with the proper primary one (#4222) [8e424cf5]
- Fixed: Add explicit `Authorization` header as param name to security scheme in order to fix issue with wrong header in OpenAPI GUI requests (#4218) [48fdb2fa]
- Fixed: Improve search syntax error handling (#4020) [a19ffbd5]
- Fixed: AWS Batch kernel issue causing OOM error (#4015) [7a8c5488]
- Fixed: Move authentication method to private app for HubSpot (#3960) [a8aa6e79]
- Fixed: Additional joins for audit publisher entity (#3934) [23deb598]
- Chore: gh actions workflows updates to suppress deprecation warnings (#4342) [b9bce117]
- Chore: Implements patch gcp registry credentials to remove newlines (#4307) [aed573ff]
- Chore: Increase `pipeline/projectName` limit to 200 chars (#4317) [beb79d8d]
- Chore: Run status time enhancements (#4289) [69848871]
- Chore: Task 2882/add validation for custom role (#4068) [86967166]
- Chore: Increase prod labels limit to 1k [9e5cccd9]
- Chore: Update AWS regions (#4118) [99d7f6bb]
- Chore: Revert FSx unmount (#4177) [199eb24b]
- Chore: When running with Gitpod, create valid AWS credentials with assume role (#4114) [7ed1491f]
- Chore: Improve task duration stats (#4106) [4a51d956]
- Chore: Update workflow status timing messages (#4075) [9939145b]
- Chore: [BREAKING] remove autoinjection of roles when `allowInstanceCredentials` property is true (#4093) [5de61137]
- Chore: Limit the time range selection when querying stats  (#3993) [e273130d]
- Chore: Cache restore and backup via Tower plugin (#3599) [719442fb]
- Chore: Set `BEST_FIT_PROGRESSIVE` as default AWS Batch allocation strategy (#3956) [6442dcd8]
- Test: Create Playwright e2e tests for Google Life Sciences CEs (#3899) [ba1c1254]
- Bump: Upgrade to Java 17 (#3973) [2e915336]
- Bump: nextflow 22.10.6 in get started page [28f44796]
- Bump: nf-launcher:j17-22.10.6 [570658c5]
- Bump: Upgrade backend to Micronaut 3.7 (#3876) [11203a05]

### 22.3.2 - 9 Feb 2022

- nf-launcher:j17-tw-22.3-nf-22.10.6

## 2022

#### 22.3.1 - 12 Dec 2022

- Fixed: Remove autoinjection of roles when `allowInstanceCredentials` property is true [BREAKING] (#4093) [1d6adc9f]
- Fixed: AWS Batch kernel issue causing OOM error (#4015) [f59b9edd]
- Bump: nf-launcher:j17-22.10.4 [26da757f]

#### 22.3.0 - 4 Nov 2022

- [BREAKING] Added: `batch:TagResource` to Batch instance role [dba6cb34]
- Added: Support for Google Batch (#3532) [ba641280]
- Added: Support for Resource Labels (#3511) [1fa2dc7e]
- Added: Support for Resource Labels for Google Batch (#3836) [157f3cd8]
- Added: Support for Wave + Fusion (#3713) [0f49a7cb]
- Added: Users and orgs management to admin panel (#3659) [9fda24b6]
- Added: Ability to expand boot EBS volume size (#3299) (#3425) [b523c5dc]
- Added: Runs dashboard page (#3734) [35073fdb]
- Added: Support for txt reports preview (#3862) [bba73371]
- Added: Confirmation dialog enhancements (#3470) [bd19b70d]
- Added: Unmount FSx lustre filesystem on Spot instance termination (#3430) [155c8a7b]
- Added: Run detail page link to both HTML and txt email templates (#3907) [58f5ef4e]
- Added: Allow organization owners to access all workspaces in the organization (#3703) [a0fad25f]
- Fixed: 3423 optimization configuration not retained on relaunch (#3841) [19b4bbe4]
- Fixed: 3654 regression optimization column in workflow list lost (#3655) [10471ade]
- Fixed: 3769 delete confirmation message allows prompts to be bypassed without entering delete in the text box (#3770) [ba442e24]
- Fixed: 3773 invalid unit for `vol ctxt` and `inv ctxt` at tasks table (#3774) [0e34ae0e]
- Fixed: `BitBuckerServer` Git provider #3670 [c91635b0]
- Fixed: Container registry name (#3708) [1f42959e] [9dd37809]
- Fixed: Missing file existence check for GLS in nf-launcher [7ca43e51]
- Fixed: Resume functionality on Google Life Sciences (#3539) [10419c93]
- Fixed: Stalling on failing local submit (#3492) [ea82e5f4]
- Fixed: **Pre-run script** errors are not displayed in the logs (#3484) [65134954]
- Fixed: Cannot add optimization status to unknown response object (#3450) [ac1fd478]
- Fixed: Invalid unit in the tasks table (#3714) [53399902]
- Fixed: Resume does not work when user has `launch` permission (#3072) [15433b31]
- Fixed: Unable to save status for job when a DB exception occurs (#3490) [9788ace0]
- Fixed: Escape `qstat` command for Altair PBS batch scheduler (#3489) [adb2b773]
- Fixed: Failing test due to phantom job interval on Mysql (#3537) [b4249066]
- Fixed: Trim sub-second precision from dates (mysql compat) (#3788) [2ade7174]
- Fixed: Disallow dashes in secret names (#3643) (#3644) [81d09056]
- Fixed: Invalid job transition to unknown status [ci fast] [65f44fc2]
- Fixed: Resource label input parses whole word before `'='` (#3847) [12d6b09d]
- Fixed: Admin tests race condition (#3868) [977fbff1]
- Fixed: Gray screen when navigating back after opening a task detail (#3873) [3a04872a]
- Fixed: Add `ListWorkspaceSettings` permission to admin and maintainer (#3453) [d9bae03a]
- Fixed: Added new query for star row deletion and modified test (#3514) [459bc3e4]
- Fixed: Broken labels input formcontrol binding (#3656) [139e633a]
- Fixed: Broken quick-launch page layout on personal workspace (#3495) [ebd0cf11]
- Fixed: Increase the quota limit for datasets (and dataset versions) per workspace to 100 (#3673) [818c4bf5]
- Fixed: Bypass name checks if the label name has not changed (case-insensitive) (#3578) [293e5478]
- Fixed: Case-insensitive search for orgs and users (#3739) [766d8056]
- Fixed: Datasets suggestions for pipelines with schemas that expect tsv type (#3582) [1f48e0de]
- Fixed: Disable ngx-bootstrap collapsible component animation (#3727) [a13dcecc]
- Fixed: Highlight support nav button when in welcome page (#3798) [312f1c91]
- Fixed: Humanize values for duration and realtime in tasks table (#3707) [30819908]
- Fixed: Include personal workspace as possible value for last accessed workspace item in local storage (#3885) [151b708a]
- Fixed: Inconsistent navigation to an organization when the organization name matches a resource label name [e2e] (#3685) [d045ac0c]
- Fixed: Inherit from DataSpecification (#3745) [be04f004]
- Fixed: Lazy load workflow details page main tabs (#3857) [8e504625]
- Fixed: Make routing service always get routeContext from params when requested [e2e] [ci fast] [a6baca64]
- Fixed: Check for `workspace id` in the endpoint URL of an action in the workspace context (#3464) [db80231f]
- Fixed: Move credentials keys patching/removal logic into credentials component base (#3765) [4537df99]
- Fixed: Prevent double task endpoint invocation (#3830) [49a14f6e]
- Fixed: Prevent null reference exception on `humanizeCounter` formatter util (#3785) [e5810dec]
- Fixed: Redirect to personal workspace if user is not a participant in any workspace (#3683) [21e98d3c]
- Fixed: Redirect to the last route on login after jwt token failed to refresh (#3619) [7ec1cfe3]
- Fixed: Remove deprecated share button (#3496) [55b47cd3]
- Fixed: Restore inline credentials creation functionality for grid platforms (#3542) [8707a05e]
- Fixed: Restore MOAB platform icon (#3821) [e6688528]
- Fixed: Restore tasks table column formatters after migration to mat table [e2e] (#3787) [009f5e76]
- Fixed: Restore vertical scroll inside inputs (#3853) [df65253c]
- Fixed: Set `resume` param depending on workflow completion status [e2e] (#3572) [177a7805]
- Fixed: Show actionable error message on unparsable config file (#3451) [3cfd96d6]
- Fixed: Small visual bugs fixes (#3837) [ci fast] [1b0a685b]
- Fixed: Wrong launchpad layout when pipeline names are long (#3527) [318b02b3]
- Chore: Restore workflow reports messaging (#3802) [9640254a]
- Chore: Bad request response when query parameters are malformed (#3649) [376def9c]
- Tweak: Switch typing method to help prompt display (#3698) [c31b02f3]
- Tweak: Required/optional field labels enhancement (#3544) [e7f08557]
- Tweak: Allow path variables for grid platform launch directory field (#3883) [6ed1eba6]
- Tweak: Apply standard glob surrounding to task list search (#3672) [d66c8740]
- Tweak: Check that users with invalid names are not rejected when registering (#3816) [02e89664]
- Tweak: Move repo link to repo name in workflow detail header (#3564) [44fdd0ba]
- Tweak: Pass date filters when clicking on the run stat inside the dashboard page (#3901) [5cfda8b6]
- Tweak: Remove confirmation input from cancel workflow prompt [5d3aca10]
- Tweak: Remove redundant logs.length from log view (#3446) [794cbe3b]
- Tweak: Set max length of revision field to 100 characters (#3882) [4040166c]
- Tweak: Enable angular strict template checking (#3596) [a569e5fe]
- Tweak: Display provider icon in credentials/CE selection dropdowns, encapsulate in icon component (#3690) [8a4c7ffd]
- Tweak: Do not allow email using a top-level domain hostname (#3526) [0bae08ca]
- Tweak: Email validators are out of sync (FE side) (#3778) [0d564656]
- Tweak: Establish use of english locale globally in tower-web (#3679) [a40d0483]
- Tweak: Customize the head node resources in the launch/relaunch form (#3448) (#3449) [42caa475]
- Tweak: Update pages layout (#3481) [24fc32cf]
- Tweak: Improve SSH connector resilience + UGE qstat [cbdab74d]
- Bump: nf-launcher:j17-22.10.1 [ci fast] [bfc1ea0d]
- Bump: Angular 14 (#3660) [130f0ffc]
- Make stage URL config (#3700) [b7219259]
- Open up all endpoints and parameters related to labels and resource labels (#3814) [bf9a30e8]
- Restyling of workflow detail header (#3547) [d2024f66]
- Update xpack urls [BREAKING] [700436e5]

#### 22.2.4 - 2 Sept 2022

- Fixed: `BitBucketServer` Git provider #3670 [3b4172b]
- Bump the quota limit for dataset per workspace to 100 (#3673) [c8df0e6]

#### 22.2.3 - 11 Aug 202

- Rollback to nf-launcher:j17-22.06.1-edge [135f5d59]

#### 22.2.2 - 8 Aug 202

- Fixed: Resume functionality on Google Life Sciences (#3539) [5b2a50b7]
- Fixed: Remove deprecated share button (#3496) [5af149f8]
- Bump: nf-launcher@22.08.0-edge [786d43be]

#### 22.1.8 - 8 Aug 2022

- Fixed: Resume functionality on Google Life Sciences (#3539) [5b389773]

#### 22.2.1 - 5 Aug 2022

- Feat: Unmount FSx lustre filesystem on SPOT instance termination
- Fixed: Escape qstat command for Altair PBS batch scheduler
- Fixed: Improve SSH connector resilience + UGE qstat
- Fixed: Patch invalid job transition to unknown status

#### 22.1.7 - 25 Jul 2022

- Improved: SSH connector resilience + UGE qstat [755b6ce4][8e876d22]

#### 22.2.0 - 15 Jul 2022

##### Breaking Changes

- The MySql DB driver `com.mysql.cj.jdbc.Driver` has been replaced by `org.mariadb.jdbc.Driver`
- Env variable `TOWER_DB_DRIVER` referencing the first should be changed with the latter

##### Other Changes

- Feat: Added support for Illumina DRAGEN
- Feat: Added support to mysql8
- Feat: Allow access remote pipelines via Tower Agent
- Feat: Feature 3025 reports download limit
- Feat: Adds used datasets tab to run details page
- Feat: Add support for redis password
- Feat: Pipeline reports index page
- Feat: Feature 2663 / Labels
- Feat: Add support for AWS CodeCode repositories
- Feat: `runName` filled with random run name by default if not in relaunch mode
- Feat: Allow the ability to send cluster options from head queue to child nodes
- Feat: Add advanced search capabilities to runs page
- Fixed: Error when trying to remove unexistent csv renderer options component
- Fixed: Invalid escape of blank chars in URL [ci fast]
- Fixed: Issue download report with blanks
- Fixed: Nginx proxy pass decoding
- Fixed: Solves #3077 by modifying the validation logic
- Fixed: Set dataset file mime type depending on file extension
- Fixed: Use mdiag command to check MOAB platform
- Fixed: Do not force a `main.nf` file at default branch when creating a pipeline
- Fixed: Suggest valid runName when launcher resumes
- Fixed: Populate timestamps for partial workflow progress updates
- Fixed: Enable maintainers to create workspace secrets
- Fixed: Prevent infinite redirection when `landingUrl` = `applicationUrl`
- Fixed: Change MOAB queue status command
- Fixed: Hide workflow run datasets tab in the personal workspace context
- Fixed: Add the support for USR2 signal for grid providers launcher script
- Fixed: Fix perms for encrypted bucket
- Fixed: Missing dataset in workflow run page
- Fixed: 3309 compute environment not visible when viewing actions
- Fixed: Multiple dropdown menus remain when selecting
- Fixed: `IllegalArgumentException` on empty config file
- Fixed: Can't relaunch failed workflow without commit
- Fixed: Cancel button malfunctions in most menus where elements get added
- Fixed: Prevent the deletion of a CE when the status is CREATING.
- Fixed: Produce two different entries for custom user config and optimized config
- Fixed: Tweak: remove "None" item from select inputs when the field is required
- Fixed: Fixed the case when optimization config was not shown for workflow details page
- Fixed: Disallow relative path workdir
- Fixed: Use `NotFound` exception at Google LS provider
- Chore: Update `ENVIRONMENT*VARIABLE_NAME` regex to allow `NXF*` env variables
- Chore: Update `computeJobRole` and `headJobRole` validation
- Chore: Bump ebs-autoscale to version 2.4.6-6ce65d32 [ci fast]
- Chore: Add KMS permissions required by EBS autoscale
- Chore: Upgrade to Micronaut 3.4.x
- Chore: Typography sync between tower and design

* Full Changelog: v22.1.5-enterprise...v22.2.0-rc0-enterprise

#### 22.1.6 - 15 Jul 2022

- Patch invalid job transition to unknown status [5ac1a4fd]

#### 22.1.5 - 7 Jun 2022

- Fixed: Perms for encrypted bucket [96f00f39]
- Add the support for USR2 signal to launcher script [40c4ab68]

#### 22.1.4 - 1 Jun 2022

- Enable maintainers to create workspace secrets [2d1a225f]
- Forward revision when creating a pipeline (#3203) [2ff2f171]
- Change MOAB queue status command (#3219) [4eda7f90]

#### 22.1.3 - 18 May 2022

- Update Nextflow to 22.04.3
- Bump: nf-launcher:j17-22.04.3
- Bump: nf-jdk:corretto-11.0.15_up1

#### 22.1.2 - 9 May 2022

- Fixed: Add KMS permissions required by EBS autoscale with encrypted volumes [387ed6c3]
- Fixed: Update HTTP content security policy to allow host URLs for frames and workers [327b27ac]
- Fixed: Minor navigation error when removing unexistent CSV renderer component [a501225c]
- Fixed: Issue downloading a report with containing a blank character [70ab2033]
- Fixed: Nginx proxy pass decoding break query parameters with blank character [48a2ef6b]
- Fixed: Kubernetes control plan URL only allow host name [1b4b1240][da552afc]
- Bump:  ebs-autoscale to version 2.4.6-6ce65d32 [d52de172]

#### 22.1.1 - 25 Apr 2022

- Added: EBS encrypt role policy at AWS forge creation (#2817) [ci fast]
- Added: `TOWER_ENABLE_UNSAFE_MODE` setting to allow cookies over HTTP (#3023) [69100d51]
- Improved: Cloud price download logs [a0e69b57]
- Fixed: Azcopy cache commands (#3022) [4932a54d]
- Fixed: AES regular expression [a7b1ed02]
- Fixed: Update CSP to allow captcha frame [a984ec39]
- Fixed: Download of task log files (#3004) [3389a8d7]
- Fixed: Dataset table is not rendered in Safari [ab297ff4]
- Fixed: Avoid analytics service making calls when there's no analytics URL (#2991) [fd56afab]
- Fixed: NF version in welcome page [c5c8492c]
- Allow NXF env variables (#3026) [553015d8]
- Remove log trace from workflow limiter [64f8161e]
- Bump: nf-launcher:j17-22.04.0 [9e55c873]
- Bump: nf-jdk:corretto-11.0.15 as base image [1832c282]

#### 22.1.0 - 12 Apr 2022

- Added: Secure cookies [e28a3388]
- Added: `GetLogsEvents` perm to AWS Batch instance role [04b18668]
- Added: Credentials view page [f3c63483]
- Added: ECS pull strategy in user-data template [e1b4914a]
- Added: Root users environment when `TOWER_ROOT_USERS` variable is provided [e09db3e5]
- Added: Tower system message
- Added: Support for JSON formatted logs [92122adb]
- Added: Support for AWS agent and logging [6e68fd98][c080e9d4]
- Added: Navigate back button to second level screens (#2578) (#2623) (5 weeks ago)
- Added: Validation for SSH hostname and username [d0115de0][efb962bf]
- Added: Config option to disable user private workspace [9e667bc0]
- Added: Share run deprecation banner
- Improved: Secrets obfuscation in log file [7e52c76b]
- Improved: EBS autoscaling [fe7fe728]
- Fixed: Job status is updated in the in-memory tracker before running the job in the local CE platform (#2460) (3 months ago)
- Fixed: Normalize dataset name [fcbe417d]
- Fixed: Allow dot in AWS ARN string [d5c5cd9e]
- Fixed: Issue with K8s compute env stalling in creating status [72c03cd9]
- Fixed: Set cookie acceptance cookie path to / e2e [ba0cae7a]
- Fixed: EFS and FSx permission when job run with non-root user (#2659) [0e169bb9]
- Fixed: Reports at grid and agent platforms [ba397137]
- Fixed: Load SLURM CE details in view mode [80cc0e9b]
- Fixed: Display dates with YYYY-MM-DD format on runs page [830606af]
- Fixed: Unable to download execution log from a workflow with working directory specified just as "bucket" name [d025917c]
- Fixed: Prevent the creation of Spot fleet role [95acea2c]
- Fixed: Prevent deletion of an active workflow run [ba1f1ce9]
- Fixed: Prevent XSS attacks when uploading a datatable file [#2944] (6d98210c)
- Allow partial searches [b8788b38]
- Allow the use S3 bucket work dir along with EFS or FSx mounts [368d5caa]
- Upload encrypted files at AWS S3 [40b87a2e]
- Use default listening port (80) [a64852d9]
- Increase tower config max size to 3500 character [a01ee72c]
- Disable resume for failed workflows [3c2c7ad3]
- Set max length validator to the workflow launch form fields [5326114b]
- Check valid EFS and FSx mount points [633fdcd8]
- Make Dataset api public (#2240) [2fd32c51]
- Increase agent websockets payload size to 5Mb [5f3e5428]
- 484005bd - Always retry NF process when using AWS sport instances
- fe7fe728 - Improve EBS autoscaling (8 days ago)
- 8dc800c2 - feature: improve parse the pipeline schema
- Default to Nextflow DSL version 1 [e88a3e59]
- 8759d92e - Validate launch/relaunch action depending the user role
- Upgrade Angular 13
- Upgrade Micronaut 3.x (#2364)
- Upgrade logback to version 1.2.8 (#2418)
- Bump: log4js from 6.3.0 to 6.4.0 in /tower-web (#2535)
- Bump: base image nf-jdk:corretto-11.0.14_2
- Bump: nf-launcher 22.03.1-edge
- Bump: base image nf-jdk:corretto-11.0.14_2 [ci fast] [d6113805]

#### 21.12.3 - 31 Mar 2022

- Bump base image nf-jdk:corretto-11.0.14_2 [8cc71b91]

#### 21.12.2 - 31 Mar 2022

- Fixed: Issue with K8s compute env stalling in creating status [3745e793]
- Fixed: Upload encrypted files at AWS S3 [716d2938]
- Fixed: EFS/FSx permission when using non-root container (#2659) [002f4426]
- Create `/.nextflow` folder in backend container [333a8a68]
- Bump: nf-launcher:j17-21.10.6 [8b3d6490]

#### 21.12.1 - 3 Feb 2022

- Fixed: Reports endpoint exception on NF CLI workflows [c310c3cf]
- Disable H8 stats verbose logging [7e5e08b0]
- Enable root users environment when `TOWER_ROOT_USERS` variable is provided [390e079a]

#### 21.12.0 - 17 Jan 2022

- Added: Shared workspace feature
- Added: Pipeline reports feature [preview]
- Added: Dataset public APIs
- Added: Tower agent reverse connection
- Added: Dataset API public ci fast [942f3f4e3]
- Fixed: Auto-normalize inline credentials name (#2405) [9d5453716]
- Fixed: Prevent making multiple get pipeline info requests in workflow launch form ci skip [e21619bd1]
- Fixed: Set `Launch.resumeLaunchId` only if it's a resume. (#2427) [a784e635b]
- Fixed: Possible `connectionId null` reference exception ci skip
- Updated: Resources descriptions [538069df9]
- Prevent the use of master as default branch (#2499) [791f45a11]
- Allow the use of S3 as work directory when using EFS and FSx mounts [6199d8fd6]
- Display dates with YYYY-MM-DD format on runs page [5d2f3215a]
- Change email template office address [5edfa3a26]
- Increase agent websockets payload size to 5Mb [4ce9af8f2]
- Bump: nf-launcher 21.10.4 based on correto:17.0.1 based image

#### 21.10.3 - 3 Feb

- Enabled: `root` users environment when `TOWER_ROOT_USERS` variable is provided [0ba7190e0]

## 2021

#### 21.10.2 - 10 Dec

- Fixed: NPE error when marking unknown status
- Bump: nf-launcher 21.10.5

#### 21.10.1 - 8 Dec

The `21.10.x` release series starts with `v21.10.1`

- Added: Container registry creds for Azure
- Added: Datasets feature
- Added: Support custom CE environment variables
- Added: New Workflows Runs list page
- Added: Support for custom landing page
- Added: Display job info on workflow general panel (#2142) (#2151)
- Improved: landing page config #1996 #748
- Fixed: Make hidden params a part of pipeline input form even if not shown + small fix (#2134)
- Fixed: Validate final values of config properties on startup (#2100)
- Fixed: Redisson default connection pool size (#2229)
- Fixed: Return a bad request when `workspaceId` is not parsable (#2220) #2205
- Fixed: Race condition on repo pull (#2110)
- Fixed: Grid platform default launch dir (#2037)
- Fixed: Redirect to the Runs page after launch (#2057)
- Fixed: Discard deleted entities from name validation queries and rename them (#2052)
- Fixed: Download hangs when streaming a S3 file (#2005)
- Hide `ebsBlockSize` field from AWS manual config (#2004)
- Make hidden params a part of pipeline input form even if not shown + small fix (#2134)
- Parallelize Az metadata retrieval
- Refactor Google LifeScience head job execution (#1981)
- Make sure to authenticate the Google storage (#1984)
- Use amazoncorretto:11.0.13 as base image
- Minor schema fetching improvement (#2183)
- Make sure the workflows list query returns the workflows in a workspace even if they have been starred by other users (#2174)
- Bump: nf-launcher 21.10.4

#### 21.06.5 - 10 Dec

- Increasing the throttling rate on the ECS agent metadata endpoint (#2338) [51a519691]
- Bump nf-launcher 21.10.5

#### 21.06.4 - 25 Nov

- Increasing the throttling rate on the ECS agent metadata endpoint (#2338)
- Bump: nf-launcher 21.10.3

#### 21.06.3 - 19 Nov

- Bump: nf-launcher 21.10.1

#### 21.06.2 - 5 Oct

- Fixed: Race condition on repo pull when using Kubernetes platform (#2110) [90b1dbe7c]
- Fixed: Altair `infoCli` method [f5226d03d]
- Hide `ebsBlockSize` field from aws manual config (#2004) [24650f47c]
- Connection pool properties log can leak sensitive data [1878a2e4f]
- Changing workspace multiple requests fix (#1985) [5f66be4b0]
- Make sure to authenticate the Google storage (#1984) [398897422]

#### 21.06.1 - 27 Aug

- Fixed: OpenId attributes blows up response header
- Fixed: Mention in the Get started page how setup Tower workspace id
- Fixed: Tune AWS client caching timeout
- Fixed: Pipeline params JSON parsing on Windows client #1949
- Fixed: Add better control of cron/redis config (#1944) [45579b5bd]
- Fixed: DB migration detected table on foreign schema - Bump migtool 1.0.2 705c905db
- Fixed: For the case when blur event handler was executed before chip selection event handler #1932
- Fixed: Bug 1926/Modify bootDiskSize Config Param #1931

#### 21.06.0 - 26 Jul

- Added: Support for AWS Host credentials and role-based permissions
- Added: Support for AWS EFS storage
- Added: Ability to specify custom AWS CLI path
- Added: AWS regions `eu-south-1` and `af-south-1`
- Added: `uploadChunkSize` configuration parameter to abstract k8 provider (#1820)
- Fixed: Launch form `pipelineParameters` after navigating to pipeline input form (#1847)
- Fixed: Error report for missing invalid/creds
- Fixed: GitHub action creation
- Fixed: Prevent GitHub delete action hook exception
- Display team ID in team page
- Disable `index.html` caching in `nginx.config`
- Limit compute env error message length
- Invalidate compute envs associated to deleted credentials
- Bump: Nextflow launcher 21.04.3
- Bump: groovy 3.0.8

#### 21.04.9 - 2 Aug

- Fixed: Nextflow plugins deps

#### 21.04.8 - 14 Jul

- Improved: Error report for missing/invalid AWS creds [b5c550236]
- Do not trigger config profiles field reset after patching the workflow launch form (#1836) [f863c8cbb]

#### 21.04.7 - 21 Jun

- Added: Head service account to deployment pod (#1773) [6e0e7281f]
- Parse profiles using the correct revision at launch time (#1572) [e78eda2f2]

#### 21.04.6 - 21 Jun

- Fixed: GitHub action creation 
- Fixed: The case when the dropdown was over-shadowing other fields 
- Change schema and default params usage 
- K8s use deployment for service pod 

#### 21.04.5 - 8 Jun

- Fixed: Action update settings (#1679) [a485c5d75]
- K8s head pod custom specs (#1668) [d82a864c8]
- Allow selecting empty values for schema dropdown fields (#1674) [d27e5b905]

#### 21.04.4 - 3 Jun

- Fixed: Missing scm server and platform

#### 21.04.3 - 2 Jun

- Fixed: Pattern test validator when the value is empty 
- Fixed: Navigation dropdown display when user has no `CreateOrganization` permission

#### 21.04.2 - 1 Jun

- Fixed: FSx creation failure

#### 21.04.1 - 31 May

- Added: Timeout on AWS Forge waiters
- Added: Log response to UI error message (#1602) [2d705289c]
- Added: Support for BitBucket server [8c09241e3]
- Fixed: Admin project security vulnerabilities (#1637) [972255faf]
- Fixed: Missing GitLab token creds (#1631) [c188a76b2]
- Fixed: Action launch user (#1615) #1611 [691fe4c9d]
- Use `RegExp.test` for json schema pattern validation + small pipeline input form fix (#1619) [d9d2cd317]
- Reorganized login page (#1635) [9a46f393a]
- Do not config mail proxy using global proxy settings (#1626) [e1c8b1dab]

#### 21.04.0 - 21 May

- New organizations feature
- New teams feature
- New workspace feature
- New launchpad feature
- Added: Support for private Git repositories
- Added: Support for Nextflow timeline downloads
- Fixed: Issues with Compute environment status reporting
- Updated: Nextflow runtime to version 21.04.0

#### 21.02.5 - 12 May

- Fixed: S3 log downloads when using fusion feature

#### 21.02.4 - 29 Apr

- Bump Nexflow 21.04.0-edge required to fix BitBucket server

#### 21.02.3 - 21 Apr

- Fixed: Cloud price downloader using Seqera Labs endpoint
- Fixed: Error message when S3 bucket is not accessible

#### 21.02.2 - 14 Apr

- Fixed: Missing commit ID when resuming execution fails to start

#### 21.02.1 - 12 Apr

- Fixed: Support for custom bitbucket servers
- Bump: Nextflow launcher 21.04.0-edge

#### 21.02.0 - 16 Mar

- Added: Azure Batch provider
- Added: Altair PBS pro provider
- Added: `sessionId` to workflows search-box criteria
- Added: Support for multiple GLS zones
- Added: Grid provider head job options
- Added: Support for AWS Batch cost percentage
- Added: Azure Batch Forge
- Added: Support for Grid Engine batch scheduler
- Added: K8s service pod
- Added: Support for Tower license
- Improved: Detection of NF config profiles #1074
- Fixed: Issue on work dir path composition with ending slash
- Fixed: Issue when retrieving non-existing file via SSH/SCP
- Fixed: Issue resolving non-canonical GitHub/Gitlab project name #353
- Fixed: Issue with AWS Batch allocation strategy #931
- Fixed: Phantom job unknown status
- Fixed: Prevent requeuing of mail with invalid addresses
- Fixed: Issue on creating AWS CE with manual config
- Updated: Backend base image to corretto:11.0.10
- Updated: nf-launcher to 21.03.0-edge
- Upgrade to Angular 11
- Use Kubernetes Java-client 10.0.1

#### 20.12.4 - 23 March

- Added: Support for AWS Marketplace

#### 20.12.2 - Feb 16

- Fixed: Phantom job status
- Fixed: Invalid email rejection

#### 20.12.1 - 21 Jan

- Fixed: Head job submission to head queue when using batch schedulers eg. Slurm, GridEngine, LSF

#### 20.12.0 - 11 Jan

- Added: Support for Kubernetes clusters
- Added: Support for AWS EKS clusters
- Added: Support for Google Kubernetes Engine clusters
- Added: Support for Launch stub-run feature
- Added: AWS Batch Fusion mounts
- Improved: System security
- Upgraded: Java runtime to version 11
- Upgraded: Micronaut runtime to version 2.1
- Upgraded: Nextflow launcher to version 20.12.0-edge
- Enhanced security, API uses bearer auth

#### 20.10.4 - 11 Jan

- Improved: SSH client debugging
- Fixed: Backend container security

## 2020

#### 20.10.3 - 30 Nov

- Fixed: Migration tool when using MariaDB
- Fixed: Execution issue with Batch forge when creating a new FSx file system
- Fixed: Invalid warn message

#### 20.10.2 - 2 Nov

- Added: Support for `TOWER_LAUNCH_CONTAINER` env var [6fd06581f]
- Fixed: EBS autoexpand volume issue + add ebs block size [cbdb8b1af]
- Disable cache on problematic cached query (#608) [11ef28e10]
- Allow pre-run script to modify launch env [56ed5cca1]

#### 20.10.1 - 27 Oct

- Updated: Nextflow launcher container

#### 20.10.0 - 22 Oct

- Added: Workflow sharing feature
- Added: Support for Slurm batch cluster
- Added: Support for IBM LSF batch cluster
- Added: Customizable navbar menu
- Added: Built-in support for MariaDB
- Added: Built-in support for Google SSO
- Added: Auth allow-list emails
- Improved: System security
- Updated: Java mail 1.6.2

#### 20.08.0 - 28 Aug

- Added: Support for AWS FSx mount name to Launch feature
- Added: Batch Forge option to to Launch feature
- Added: Support for GPU instances to Launch feature
- Added: Execution and tasks logs view and downloads features
- Added: Support for Compute env AWS advanced options
- Added: Compute environment primary option feature
- Added: Pipeline Actions
- Added: Support for GA4GH WES API (beta)
- Added: Status & process name filtering to dashboard
- Added: Favicon for dark theme
- Added: Login pass-through mechanism
- Improved: Workflow general stats tooltips
- Fixed: AWS Batch workflow cancellation
- Fixed: Issue when launching projects w/o config file
- Fixed: Issue on port and scheme forwarding
- Fixed: Local repositories configuration issue
- Updated: Launch base image to AWS corretto:262
- Updated: MN version 1.3.7

#### 20.06.1 - 12 Aug

- Fixed: Reverse proxy scheme and port forwarding when using local Docker environment

#### 20.06.0 - 16 Jun

- Added: Pipeline Launch feature
- Added: Pipeline execution cancellation
- Added: Tomcat DB connection pool
- Improved: UI look and feel
- Improved: security
- Improved: OAuth login
- Upgraded: Micronaut runtime to 1.3.3

#### 20.05.1 - 12 May

- Add: `TOWER_SECURITY_LOGLEVEL` env variable for security module debugging
- Path OpenID connect upgrading MN security to 1.2.3

#### 20.05.0 - 28 Apr

- Added: Support for OpenId connect
- Added: Limit to max records returned
- Improved: K8s deployment descriptors
- Fixed: Critical issue saving tasks
- Fixed: Invalid tag deserialization error
