const CAService = require('khala-fabric-sdk-node-builder/ca')
const AffiliationService = require('khala-fabric-sdk-node-builder/affiliationService');
const IdentityService = require('khala-fabric-sdk-node-builder/identityService')
const CertificateService = require('khala-fabric-sdk-node-builder/certificateService')
const {ECDSA_Key} = require('khala-fabric-formatter/key')
const UserBuilder = require('khala-fabric-sdk-node-builder/user')
const fs = require('fs')
const path = require('path')
const assert = require('assert')
const {transactionProposal} = require('khala-fabric-sdk-node-builder/transaction')
const {getPayloads} = require('khala-fabric-formatter/txProposal')
const Nodes = require('../nodes')
const enrollmentID = process.env.IDCS_ID
if (!enrollmentID) {
    throw Error('process.env.IDCS_ID not found')
}
const enrollmentSecret = process.env.IDCS_PASSWORD
if (!enrollmentSecret) {
    throw  Error('process.env.IDCS_PASSWORD not found')
}
const channelName = process.env.channel || 'default'
const keystore = path.resolve(`test/artifacts/founder-user-credential/${enrollmentID}-key`)
const signcert = path.resolve(`test/artifacts/founder-user-credential/${enrollmentID}-cert.pem`)
const getUser = () => {
    const userBuilder = new UserBuilder({name: enrollmentID})
    return userBuilder.build({
        key: fs.readFileSync(keystore),
        certificate: fs.readFileSync(signcert),
        mspId: 'founder'
    });
}
const QueryAsNormaluser = async () => {
    const Client = require('khala-fabric-sdk-node-builder/client')
    const user = getUser()
    const {client} = new Client().setUser(user)

    const fcn = 'whoami'
    const chaincodeId = 'diagnose'

    const peers_david = Nodes.FromExportedNodes(path.resolve('test/artifacts/davidkhala-exported-nodes.json'))
    const peers_founder = Nodes.FromExportedNodes(path.resolve('test/artifacts/founder-exported-nodes.json'))

    const peers = peers_david.map(({peer}) => peer).concat(peers_founder.map(({peer}) => peer))

    const rawResult = await transactionProposal(client, peers, channelName, {chaincodeId, fcn, args: []})
    return getPayloads(rawResult)
}
describe('ca', function () {
    this.timeout(30000)
    const caUrl = 'https://founder-4-hktwlab-iad.blockchain.ocp.oraclecloud.com:7443'
    const CAName = 'founderca'
    const {caService} = new CAService(caUrl, undefined, CAName)


    it('enroll: required Oracle IDCS credential', async () => {
        const {certificate, rootCertificate, key} = await caService.enroll({enrollmentID, enrollmentSecret});
        console.info({certificate})
        console.info({rootCertificate})
        const ecdsaKey = new ECDSA_Key(key, fs)

        ecdsaKey.save(keystore)

        fs.writeFileSync(signcert, certificate)
    })

    it('query as normal user', async () => {
        const result = await QueryAsNormaluser()
        assert.strictEqual(JSON.parse(result[0]).MspID, 'founder')
    })
    it('list affiliation: Not supported', async () => {

        const user = getUser()
        const {affiliationService} = new AffiliationService(caService);
        try {
            await affiliationService.getAll(user)
        } catch (e) {
            // Failed to get affiliation: Not supported
            assert.strictEqual(`fabric-ca request affiliations failed with errors [[{"code":49,"message":"Failed to get affiliation: Not supported"}]]`, e.message)
        }


    })
    it('list id: Not supported', async () => {
        const user = getUser()
        const idService = new IdentityService(caService);
        try {
            await idService.getAll(user);
        } catch (e) {
            assert.strictEqual(`fabric-ca request identities?ca=founderca failed with errors [[{"code":49,"message":"Failed to get users by affiliation and type: Not supported"}]]`, e.message)
        }
    })
    it('revoke user and it still works', async () => {
        const user = getUser()
        const certificate = fs.readFileSync(signcert, 'utf-8');
        const certificateService = new CertificateService(caService)
        const result = await certificateService.revokeCertificate(certificate, user)
        console.debug(result)

    })
})

