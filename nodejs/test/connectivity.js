const path = require('path')

const assert = require('assert');

describe('grpc ping', function () {
    this.timeout(30000)
    const Orderers = require('../orderer')
    const Nodes = require('../nodes')
    it('local peer', async () => {

        const settingsJSON = path.resolve('test/artifacts/davidkhala-exported-nodes.json')
        const peers = Nodes.FromExportedNodes(settingsJSON)
        for (const peer of peers) {
            const result = await peer.ping()
            assert.ok(result)
        }
    })
    it('OBP peer', async () => {
        const settingsJSON = path.resolve('test/artifacts/founder-exported-nodes.json')
        const peers = Nodes.FromExportedNodes(settingsJSON)
        for (const peer of peers) {
            const result = await peer.ping()
            assert.ok(result)
        }
    })
    it('orderer', async () => {

        const settingsJSON = path.resolve('test/artifacts/founder-orderer-settings.json')

        const orderers = Orderers.FromOrdererSettings(settingsJSON)

        for (const orderer of orderers) {
            const result = await orderer.ping()
            assert.ok(result)
        }

    })
})
describe('http ping', function () {
    this.timeout(5000)
    const {ping} = require('khala-fabric-sdk-node/ca')
    it('ca', async () => {
        // 3 seconds timeout sometimes
        const caUrl = 'https://founder-4-hktwlab-iad.blockchain.ocp.oraclecloud.com:7443'
        const result = await ping(caUrl)
        console.info(result)
        assert.strictEqual(result.Version, '1.4.4')
    })
})