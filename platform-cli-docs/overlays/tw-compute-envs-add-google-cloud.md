Use the networking options to place VMs in an existing VPC instead of the project's default network:

```bash
tw compute-envs add google-cloud --name=my_gcp_ce \
--credentials=<my_gcp_creds> --region=europe-west2 --zone=europe-west2-a \
--work-dir=gs://<bucket name> \
--network=my-vpc --subnetworks=my-subnet-a,my-subnet-b \
--network-tags=allow-ssh --use-private-address
```

- `--subnetworks` and `--network-tags` require `--network`. The CLI rejects the command before contacting Platform if `--network` is missing or a tag is not lowercase letters, numbers, and hyphens.
- Subnetworks must be in the compute environment region. VMs are placed in the first listed subnetwork, and Intelligent Compute may use all of them.
- With `--use-private-address`, VMs have no public IP address, so the VPC must provide outbound access through Cloud NAT and Private Google Access.

See [Advanced options][google-cloud-advanced-options] for the equivalent fields in the Platform UI.
