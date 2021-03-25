const {register} = require('khala-fabric-sdk-node/ca')
const CAService = require('khala-fabric-sdk-node-builder/ca')
const {getAdmin_founder_Client} = require('./testUtil')
const fs = require('fs')
const AffiliationService = require('khala-fabric-sdk-node-builder/affiliationService');
const IdentityService = require('khala-fabric-sdk-node-builder/identityService')

describe('ca info list', function () {
    this.timeout(3000)
    const caUrl = 'https://founder-4-hktwlab-iad.blockchain.ocp.oraclecloud.com:7443'
    const CAName = 'founderca'
    const {caService} = new CAService(caUrl, undefined,CAName)
    const {_userContext: admin} = getAdmin_founder_Client();


    it.skip('initAdmin is not allowed: 401', async () => {
        const enrollmentID = `Admin-${Date.now()}`
        const enrollmentSecret = 'password'
        const result = await caService.enroll({enrollmentID, enrollmentSecret});
        console.log(result)
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
    it.skip('register with timestamp', async () => {


        const enrollmentID = `user-${Date.now()}`
        const affiliation = 'founder'
        const {enrollmentSecret} = await register(caService, admin, {enrollmentID, role: 'user', affiliation})
        fs.writeFileSync(enrollmentID, enrollmentSecret)
    })
})