const path = require('path')
const assert = require('assert');
describe('join channel', () => {
    const Orderers = require('../orderer')
    const Nodes = require('../nodes')
    const {join} = require('khala-fabric-sdk-node/channel')
    const Channel = require('khala-fabric-sdk-node-builder/channel')
    const Client = require('khala-fabric-sdk-node-builder/client')
    const {loadFrom} = require('khala-fabric-sdk-node/user')
    const channelName = 'default'
    const settingsJSON = path.resolve('test/artifacts/founder-orderer-settings.json')


    const orderers = Orderers.FromOrdererSettings(settingsJSON)
    const {orderer} = orderers[0]
    it.skip('try', async () => {
        const settingsJSON = path.resolve('test/artifacts/davidkhala-exported-nodes.json')
        const peers = Nodes.FromExportedNodes(settingsJSON)

        const mspConfigPath = path.resolve('test/crypto-config/peerOrganizations/davidkhala.com/users/Admin@davidkhala.com/msp')

        const mspId = 'davidkhala-com'
        const client = new Client()
        const user = loadFrom(mspConfigPath, 'Admin', mspId)
        client.setUser(user)
        const {channel} = new Channel({channelName, client: client.client})
        for (const {peer} of peers) {
            await join(channel, peer, undefined, orderer)
        }

    })
})