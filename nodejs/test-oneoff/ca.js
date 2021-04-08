const {transactionProposal} = require('khala-fabric-sdk-node-builder/transaction')
const UserBuilder = require('khala-fabric-sdk-node-builder/user')
const CertificateService = require('khala-fabric-sdk-node-builder/certificateService')
const fs = require('fs')
const path = require('path')
const assert = require('assert')
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
const QueryAsNormalUser = async () => {
    const Client = require('khala-fabric-sdk-node-builder/client')
    const user = getUser()
    const {client} = new Client().setUser(user)
    const channelName = 'default'
    const fcn = 'whoami'
    const chaincodeId = 'diagnose'

    const peers_david = Nodes.FromExportedNodes(path.resolve('test/artifacts/davidkhala-exported-nodes.json'))
    const peers_founder = Nodes.FromExportedNodes(path.resolve('test/artifacts/founder-exported-nodes.json'))

    const peers = peers_david.map(({peer}) => peer).concat(peers_founder.map(({peer}) => peer))

    const rawResult = await transactionProposal(client, peers, channelName, {chaincodeId, fcn, args: []})
    return getPayloads(rawResult)
}

describe('Apply CRL after Revoke', () => {
    it('after manual Apply CRL, it should not work', async () => {
        const certificate = fs.readFileSync(signcert, 'utf-8');
        const result = CertificateService.inspect(certificate)
        console.debug(result)

        const queryResult = await QueryAsNormalUser()
        assert.strictEqual(queryResult[0], '2 UNKNOWN: access denied: channel [default] creator org [founder]')
    })
})