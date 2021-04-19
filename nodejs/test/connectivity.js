const path = require('path')

const assert = require('assert');
const {getPeers_founder, getPeers_davidkhala} = require('./testUtil')
describe('grpc ping', function () {
    this.timeout(30000)
    const Orderers = require('../orderer')
    const Nodes = require('../nodes')
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
