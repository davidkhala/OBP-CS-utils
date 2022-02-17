const {getContext} = require('./testUtil')
const Nodes = require('../nodes/index')
const Peers = require('../nodes/peers')
const path = require('path')
const fs = require('fs')
describe('nodes', function () {
    this.timeout(0)
    const context = getContext()
    const nodes = new Nodes(context)
    it('list', async () => {
        const {peers, orderers, fabricCAs, RESTProxies} = await nodes.list()

        const result = {peers, orderers, fabricCAs, RESTProxies}
        const outputFile = path.resolve(__dirname, '../../nodejs/test/artifacts/founder-nodes.json')
        fs.writeFileSync(outputFile, JSON.stringify(result, null, 2))

    })
    const peers = new Peers(context)
    it('peers', async function () {
        this.timeout(0)
        const peerId = 'peer0'
        const channelName = 'default'
        const result = await peers.blockAudit(peerId, channelName)
        console.log(result)
    })
})