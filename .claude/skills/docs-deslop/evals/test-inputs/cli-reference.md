# The "tw runs" Command - A Complete Reference Guide.

Our powerful and comprehensive CLI gives you the flexibility to manage runs from the terminal. Whether you're automating CI pipelines or just poking around, Tower's CLI has you covered with a robust feature set. This reference will help you understand all the options at your disposal.

## Overview of the Options

The "list" subcommand lists the runs in a Workspace. It's really important to know that you can filter the output. The "--workspace" flag specifies the Workspace, e.g. your team's production Workspace. As mentioned, filtering is supported — utilize the "--filter" flag for that.

The "view" subcommand shows the details of a run. You'll need to pass the "-i" flag with the run identifier. There's also a "--params" option, which means the pipeline parameters get included, so the output can get quite long.

The "relaunch" subcommand will relaunch a run. The "-i" flag is required here too; the "--pipeline" flag is optional. It's worth noting that relaunching uses the same Compute Environment as the original run, which experts agree is usually what you want.

The "cancel" subcommand cancels a running workflow. Don't worry — cancelling is safe and your data won't be lost!

The "delete" subcommand removes a run from the Workspace, and so on.

## Output Formats

There are several output format custom settings. The default format will be table, but JSON can also be selected by the user via the "--output" flag, which is useful when the output is going to be parsed by scripts, e.g. with jq, because structured data is easier to handle programmatically than tabular data designed for humans to read at a glance.

## Conclusion

In conclusion, the "tw runs" command is a powerful tool for managing your NextFlow executions. For more information about other commands, [click here](#).
