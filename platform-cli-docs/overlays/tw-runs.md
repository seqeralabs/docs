Run `tw runs -h` to view supported runs operations.

Runs display all the current and previous pipeline runs in the specified workspace. Each new or resumed run is given a random name such as _grave_williams_ by default, which can be overridden with a custom value at launch. See [Run details](../monitoring/run-details) for more information. As a run executes, it can transition through the following states:

- `submitted`: Pending execution
- `running`: Running
- `succeeded`: Completed successfully
- `failed`: Successfully executed, where at least one task failed with a terminate [error strategy](https://www.nextflow.io/docs/latest/process.html#errorstrategy)
- `cancelled`: Stopped manually during execution
- `unknown`: Indeterminate status
