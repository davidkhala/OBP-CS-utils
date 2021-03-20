const path = require('path')
const assert = require('assert')
const {ObjectEqual} = require('khala-nodeutils/helper')
describe('join channel', function () {
    this.timeout(30000);
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
    it('try', async () => {
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
    const {channelJoined} = require('khala-fabric-sdk-node/query')
    it('channelJoined', async () => {
        const settingsJSON = path.resolve('test/artifacts/davidkhala-exported-nodes.json')
        const peers = Nodes.FromExportedNodes(settingsJSON)
        const {peer} = peers[0]

        const mspConfigPath = path.resolve('test/crypto-config/peerOrganizations/davidkhala.com/users/Admin@davidkhala.com/msp')
        const mspId = 'davidkhala-com'
        const client = new Client()
        const user = loadFrom(mspConfigPath, 'Admin', mspId)
        client.setUser(user)

        const result = await channelJoined(peer, client.client)

        assert.ok(ObjectEqual(result, {channels: [{channel_id: 'default'}]}))
    })
})