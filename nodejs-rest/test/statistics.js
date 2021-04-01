const Channel = require('../statistics/channel')
const Node = require('../statistics/node')
const assert = require('assert')
const {getContext} = require('./testUtil')
describe('statistics', function () {
    this.timeout(30000)
    const context = getContext()
    it('channelInfo', async () => {
        const channelStats = new Channel(context)
        const result = await channelStats.channelInfo()
        console.info(result)
    })
    it('node', async () => {
        const result = await new Node(context).health()
        console.info(result)
    })

})
describe('OCI metrics', function () {
    this.timeout(30000)
    const context = getContext()
    const node = new Node(context)
    it('node resources', async () => {
        const result = await node.OCI()
        assert.strictEqual(result.length, 8)
    })
    it('node resources: ca', async () => {
        const result = await node.OCI({nodeID: 'ca'})
        console.info(result)
    })
    it('node resources:console', async () => {
        const result = await node.OCI({nodeID: 'console'})
        console.info(result)
    })
    it('node resources:restproxy', async () => {
        const result = await node.OCI({nodeID: 'restproxy'})
        console.info(result)
    })
    it('node resources:orderer', async () => {
        const result = await node.OCI({nodeID: 'orderer0'})
        console.info(result)
    })
    it('node resources:peer', async () => {
        const result = await node.OCI({nodeID: 'peer0'})
        console.info(result)
    })
    it('endorsements', async () => {
        const result = await node.endorsements()
        console.info(result)
    })
    it('endorsements: channel default', async () => {
        const result = await node.endorsements({channel: 'default', nodeID: 'peer0'})
        console.info(result)
    })
    it('endorsements: time window', async () => {
        const startTime = new Date('Wed Mar 1 2021').getTime()
        const endTime = Date.now();

        const result = await node.endorsements({channel: 'default', startTime, endTime})
        console.info(result)
        assert.strictEqual(result[0].startTime, 'Mon, 01 Mar 2021 00:00:00 GMT')

    })

})
describe("OCI metrics: commits", function () {
    this.timeout(30000)
    const context = getContext()
    const node = new Node(context)
    it('commit towards peers', async () => {
        const result = await node.commits()
        console.info(result)
    })
    it('commit on orderer (entire network)', async () => {
        const startTime = new Date('Wed Mar 1 2021').getTime()
        const result = await node.userTx({startTime})
        console.info(result)
    })

})