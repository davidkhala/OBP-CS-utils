const path = require('path')
const fs = require('fs')
const assert = require('assert')
const {ObjectEqual, homeResolve} = require('khala-nodeutils/helper')
const Nodes = require('../nodes')
const {loadFrom} = require('khala-fabric-sdk-node/user')
const Client = require('khala-fabric-sdk-node-builder/client')
const UserBuilder = require('khala-fabric-sdk-node-builder/user')
const getAdmin_davidkhala_Client = () => {
    const mspConfigPath = path.resolve('test/crypto-config/peerOrganizations/davidkhala.com/users/Admin@davidkhala.com/msp')
    const mspId = 'davidkhala-com'
    const client = new Client()
    const user = loadFrom(mspConfigPath, 'Admin', mspId)
    client.setUser(user)
    return client.client
}
const getAdmin_founder_Client = () => {
    const builder = new UserBuilder({name: 'Admin'});
    const mspId = 'founder'
    const keystore = path.resolve('test/artifacts/founder-admin-credential/founder-key');
    const signcert = path.resolve('test/artifacts/founder-admin-credential/founder-cert.pem')
    const user = builder.build({
        key: fs.readFileSync(keystore),
        certificate: fs.readFileSync(signcert),
        mspId
    });

    const client = new Client()
    client.setUser(user)
    return client.client
}
describe('join channel', function () {
    this.timeout(30000);
    const Orderers = require('../orderer')

    const {join} = require('khala-fabric-sdk-node/channel')
    const Channel = require('khala-fabric-sdk-node-builder/channel')


    const channelName = 'default'
    const settingsJSON = path.resolve('test/artifacts/founder-orderer-settings.json')


    const orderers = Orderers.FromOrdererSettings(settingsJSON)
    const {orderer} = orderers[0]
    it('join', async () => {
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


        const client = getAdmin_davidkhala_Client()

        const result = await channelJoined(peer, client)
        console.debug(result)
        assert.ok(ObjectEqual(result, {channels: [{channel_id: 'default'}]}))
    })
})
describe('deploy chaincode', function () {
    this.timeout(60000)
    const chaincodeId = 'diagnose'
    const {install} = require('khala-fabric-sdk-node/chaincode')
    const {setGOPATH} = require('khala-fabric-sdk-node/golang')
    it('install', async () => {
        const chaincodePath = 'github.com/davidkhala/chaincode/golang/diagnose'
        const chaincodeVersion = 'v1'
        const peers_david = Nodes.FromExportedNodes(path.resolve('test/artifacts/davidkhala-exported-nodes.json'))

        const client_david = getAdmin_davidkhala_Client();
        await setGOPATH()
        const results0 = await install([peers_david[0].peer], {
            chaincodeId,
            chaincodePath,
            chaincodeVersion
        }, client_david)

        console.debug('install towards davidkhala.com', results0)
        const peers_founder = Nodes.FromExportedNodes(path.resolve('test/artifacts/founder-exported-nodes.json'))

        const client_founder = getAdmin_founder_Client()

        const results1 = await install(peers_founder.map(({peer}) => peer), {
            chaincodeId,
            chaincodePath,
            chaincodeVersion
        }, client_founder)
        console.debug('install towards founder', results1)

    })
    it.skip('instantiate on OBP', () => {
        const CollectionName = 'private'
        const Policy = `OR('founder.member', 'davidkhala-com.member')`
        const PeersRequired = 0;
        const MaxPeerCount = 4;
        const BlockToLive = 0;
    })

})
describe('Chaincode transaction', function () {
    this.timeout(30000)
    const {transactionProposal} = require('khala-fabric-sdk-node-builder/transaction')
    const {getPayloads} = require('khala-fabric-formatter/txProposal')
    const {invoke} = require('khala-fabric-sdk-node/chaincodeHelper')
    const Eventhub = require('khala-fabric-sdk-node-builder/eventHub')
    const ChannelManager = require('khala-fabric-sdk-node-builder/channel')
    const {FromOrdererSettings} = require('../orderer')
    const chaincodeId = 'diagnose'
    const channelName = 'default'
    it('query', async () => {
        const fcn = 'whoami'
        const client = getAdmin_davidkhala_Client();
        const peers_david = Nodes.FromExportedNodes(path.resolve('test/artifacts/davidkhala-exported-nodes.json'))
        const peers_founder = Nodes.FromExportedNodes(path.resolve('test/artifacts/founder-exported-nodes.json'))

        const peers = peers_david.map(({peer}) => peer).concat(peers_founder.map(({peer}) => peer))

        const rawResult = await transactionProposal(client, peers, channelName, {chaincodeId, fcn, args: []})
        const result = getPayloads(rawResult)
        console.info(result)
    })
    it('invoke', async () => {
        const client = getAdmin_davidkhala_Client();
        const peers_david = Nodes.FromExportedNodes(path.resolve('test/artifacts/davidkhala-exported-nodes.json'))
        const peers_founder = Nodes.FromExportedNodes(path.resolve('test/artifacts/founder-exported-nodes.json'))

        const peers = peers_david.map(({peer}) => peer).concat(peers_founder.map(({peer}) => peer))
        const fcn = 'putPrivate'
        const transientMap = {key: "value"}

        const {channel} = new ChannelManager({channelName, client})
        const eventHubs = peers.map(peer => new Eventhub(channel, peer));
        for (const eventHub of eventHubs) {
            await eventHub.connect();
        }

        const orderers = FromOrdererSettings(path.resolve('test/artifacts/founder-orderer-settings.json')).map(({orderer}) => orderer)
        const orderer = orderers[0]


        const rawResult = await invoke(client, channelName, peers, eventHubs, {chaincodeId, fcn, args: [], transientMap}, orderer)
        const result = getPayloads(rawResult)
        console.info(result)
    })
})