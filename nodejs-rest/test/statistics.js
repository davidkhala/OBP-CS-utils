const Channel = require('../statistics/channel')
const Node = require('../statistics/node')
const assert = require('assert')
const {getContext} = require('./testUtil')
const channelName = process.env.channel || 'default'
const logger = require('khala-logger/log4js').consoleLogger('statistics')
describe('statistics', function () {
    this.timeout(0)
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
    this.timeout(0)
    const context = getContext()
    const node = new Node(context)
    it('node resources', async () => {
        const result = await node.OCI()
        assert.strictEqual(result.length, 8)
        logger.info(result)
    })
    it('node resources: ca', async () => {
        const result = await node.OCI({nodeID: 'ca'})
        logger.info(result)
    })
    it('node resources:console', async () => {
        const result = await node.OCI({nodeID: 'console'})
        logger.info(result)
    })
    it('node resources:restproxy', async () => {
        const result = await node.OCI({nodeID: 'restproxy'})
        logger.info(result)
    })
    it('node resources:orderer', async () => {
        const result = await node.OCI({nodeID: 'orderer0'})
        logger.info(result)
    })
    it('node resources:peer', async () => {
        const result = await node.OCI({nodeID: 'peer0'})
        logger.info(result)
    })
    it('endorsements', async () => {
        const result = await node.endorsements()
        logger.info(result)
    })
    it('endorsements: channel', async () => {
        const result = await node.endorsements({channel: channelName, nodeID: 'peer0'})
        console.info(result)
    })
    it('endorsements: time window', async () => {
        const startTime = new Date('Wed Mar 1 2021').getTime()
        const endTime = Date.now();

        const result = await node.endorsements({channel: channelName, startTime, endTime})
        logger.info(result)
        assert.strictEqual(result[0].startTime, 'Mon, 01 Mar 2021 00:00:00 GMT')

    })

})
describe("OCI metrics: commits", function () {
    this.timeout(0)
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