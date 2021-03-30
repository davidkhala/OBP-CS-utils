# OBP-CS-utils
Oracle Blockchain Platform Cloud Service utils

## Notes
- `Skip blockchain verification` is native Fabric peer property. Not related to Oracle ledger integrity ensurer.
- native fabric peer joined channel cannot be listed in Tab `Channels`
- channel menu -> `Join Peers to Channel` cannot perform joining `Remote Peer` in tab `Nodes` to channel
- npm_bcs_client script will not break usual grpc connection, it is compatible
- `./npm_bcs_client.sh: 56: declare: not found` indicate `declare` is undefined in `#!/bin/sh`, but in `#!/bin/bash`   
- You can't do a chaincode Invoke if you are a read-only org.

## Reference
- npm_bcs_client scripts can be accessed from 
  - OBP Service Console -> Tab `Developer Tools` -> `Application Development`
- Title `Upgrade Chaincode` -> `Step 1 of 2: Select a version` -- option `Version Source`. item `Select from existing versions`
  - it does not mean it automates to reuse existing chaincode then redeploy as a new version. Instead, it means you can specify an installed but not yet instantiated chaincode version for coming upgrade.
## TODO 
- allow ./npm_bcs_client_win.bat for windows
- [manage-certificates](https://docs.oracle.com/en/cloud/paas/blockchain-cloud/usingoci/manage-certificates.html#GUID-B27A3F26-3592-4F38-8AD3-37D29362854B)
- [REST API](https://docs.oracle.com/en/cloud/paas/blockchain-cloud/rest-api/rest-endpoints.html)
## Limitation
- handicapped channel policy management console 
- You can only subscribe to events via a REST proxy entity within the founder instance - not to participants in the network. This is due to the REST proxies using Kafka to handle events and non-founder instances don't have Kafka running.
