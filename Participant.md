
## Join to Network with Founder as another OBPCS

### Onboard: information exchange with a Founder instance
The following will show up at the first time entering Participant instance Service Console.

**To join a network**
1. Go to `step 2: Export Certificates` to export your organization's certificates to a JSON file.
2. Provide the JSON file to the founding organization to import using Add Organizations wizard on its Network tab. Then the founding organization needs to export the orderer settings to a JSON file and provide it to you.
3. Go to `step 3: Import Orderer Settings` to import the JSON file provided by the founding organization with its orderer settings.
4. Click on `step 4: Complete` to complete the process and exit the wizard.

### Join peers to channel of Founder
1. Go to Founder instance Service Console
2. Tab `Channels` -> expand menu of your target channel -> `Edit Channel Organizations`
3. check in Participant MSP ID and `Submit` to apply change
4. Go to Participant instance Service Console
5. Tab `Nodes` -> expand menu of your target peer -> `Join New Channels` -> expand `Channel Name` dropdown -> select the target Founder channel


## Reference
- [Extend the Network](https://docs.oracle.com/en/cloud/paas/blockchain-cloud/usingoci/extend-network.html)
