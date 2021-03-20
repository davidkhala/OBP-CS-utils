const path = require('path')
const Orderer = require('../orderer')
const Nodes = require('../nodes')
const assert = require('assert');

describe('grpc ping', function () {
    this.timeout(30000)
    it('peer', async () => {

        const settingsJSON = path.resolve('test/artifacts/davidkhala-exported-nodes.json')
        const peers = Nodes.FromExportedNodes(settingsJSON)
        for (const peer of peers) {
            const result = await peer.ping()
            assert.ok(result)
        }
    })
    it('orderer', async () => {

        const settingsJSON = path.resolve('test/artifacts/founder-orderer-settings.json')

        const {orderers} = new Orderer().fromOrdererSettings(settingsJSON)

        for (const orderer of orderers) {

            await orderer.ping()
        }

    })
})