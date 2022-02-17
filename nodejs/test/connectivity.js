const path = require('path')

const assert = require('assert');
const {
    getPeers_founder,
    getPeers_davidkhala,
    getAdmin_founder_Client,
} = require('./testUtil')
describe('grpc ping', function () {
    this.timeout(0)
    const Orderers = require('../orderer')
    it('local peer:davidkhala', async () => {

        const peers = getPeers_davidkhala()
        for (const peer of peers) {
            const result = await peer.ping()
            assert.ok(result)
        }
    })
    it('OBP peer:founder', async () => {
        const peers = getPeers_founder()
        for (const peer of peers) {
            const result = await peer.ping()
            assert.ok(result)
        }
    })
    it('OBP orderer:founder', async () => {

        const settingsJSON = path.resolve('test/artifacts/founder-orderer-settings.json')

        const orderers = Orderers.FromOrdererSettings(settingsJSON)

        for (const orderer of orderers) {
            const result = await orderer.ping()
            assert.ok(result)
        }

    })
})
describe('query OBP peer:founder', () => {

    const {chaincodesInstalled} = require('khala-fabric-sdk-node/query')
    it('chaincode installed', async () => {
        const peers_founder = getPeers_founder()
        const {peer} = peers_founder[0]

        const client_founder = getAdmin_founder_Client()
        const result = await chaincodesInstalled(peer, client_founder)
        console.log(result.pretty)
    })
})
