const {register} = require('khala-fabric-sdk-node/ca')
const CAService = require('khala-fabric-sdk-node-builder/ca')
const {getAdmin_founder_Client} = require('./testUtil')
const fs = require('fs')
const AffiliationService = require('khala-fabric-sdk-node-builder/affiliationService');
const IdentityService = require('khala-fabric-sdk-node-builder/identityService')

describe('ca info list', function () {
    this.timeout(30000)
    const caUrl = 'https://founder-4-hktwlab-iad.blockchain.ocp.oraclecloud.com:7443'
    const CAName = 'founderca'
    const {caService} = new CAService(caUrl, undefined, CAName)
    const {_userContext: admin} = getAdmin_founder_Client();


    it('enroll: required Oracle IDCS credential', async () => {
        const enrollmentID = process.env.IDCS_ID
        const enrollmentSecret = process.env.IDCS_PASSWORD

        const {certificate, rootCertificate, key} = await caService.enroll({enrollmentID, enrollmentSecret});
        console.info({certificate})
        console.info({rootCertificate})
        console.debug(key)
    })
    it.skip('list affiliation', async () => {
        const {affiliationService} = new AffiliationService(caService);
        const result = await affiliationService.getAll(admin)
        console.info(result)
    })
    it.skip('list id', async () => {
        const idService = new IdentityService(caService);
        const allIDs = await idService.getAll(admin);
        for (const id of allIDs) {
            console.info(id.id, id.attrs);
        }
    })
})