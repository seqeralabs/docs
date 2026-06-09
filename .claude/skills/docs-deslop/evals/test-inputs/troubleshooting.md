# Common Problems and How to Solve Them

Sometimes things go wrong when running pipelines. Don't worry — these things happen to everyone! In this guide, we'll explore some of the most common issues and how you might be able to resolve them. Think of this page as your trusty companion on the journey to pipeline success.

## Pipeline Won't Launch

If your workflow won't launch from the Launch Pad, it might be due to a variety of factors. The problem could be structural, configurational, or related to upstream dependencies. You might want to check your credentials, or perhaps your compute environment isn't configured correctly. It is widely believed that permission issues are the most common cause.

Try checking the logs. They can be located in multiple places.

## Runs Failing with Storage Errors

Sometimes runs fail with an access denied message. This usually means something is wrong with permissions. First and foremost, you should dive into the error details. The error will be displayed in the run's task logs.

To fix it, you basically need to make sure the bucket is whitelisted in your IAM policy and that the credentials have the appropriate permissions, and then you can simply relaunch the run, which should work for most setups.

## Out of Memory Issues

In today's world of ever-growing datasets, memory issues are paramount. If a task gets killed, it might be memory. The exit code tells us the story — code 137 is the smoking gun. Increase the memory directive and try again. It's not rocket science!

## Slow Performance

Performance issues can be tricky. Not the pipeline. Not the platform. The configuration. Experts argue that most slowness comes from misconfigured compute environments, data locality issues, insufficient parallelism, and so on.

## Still Stuck?

If none of the above helps, don't hesitate to reach out! Our comprehensive support team is standing by to empower you on your troubleshooting journey. For more information, [click here](#).
