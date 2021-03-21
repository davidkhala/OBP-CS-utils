# OBP-CS-utils
Oracle Blockchain Platform Cloud Service utils

## Notes
- `Skip blockchain verification` is native Fabric peer property. Not related to Oracle ledger integrity ensurer.
## Reference
- [npm_bcs_client.sh](https://git.orcl.asia/obcs/workshop/blob/master/npm_bcs_client.sh) can be accessed from 
  - OBP Service Console -> Tab `Developer Tools` -> `Application Development`
- Title `Upgrade Chaincode` -> `Step 1 of 2: Select a version` -- option `Version Source`. item `Select from existing versions`
  - it does not mean it automates to reuse existing chaincode then redeploy as a new version. Instead it means you can specify an installed but not yet instantiated chaincode version for comming upgrade.
## TODO 
- allow ./npm_bcs_client_win.bat for windows

