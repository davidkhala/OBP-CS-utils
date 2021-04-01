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
    it('node resources', async () => {
        const result = await new Node(context).OCI()
        assert.strictEqual(result.length, 8)
    })
    it('node resources: ca', async () => {
        const result = await new Node(context).OCI({nodeID: 'ca'})
        console.info(result)
    })
    it('node resources:console', async () => {
        const result = await new Node(context).OCI({nodeID: 'console'})
        console.info(result)
    })
    it('node resources:restproxy', async () => {
        const result = await new Node(context).OCI({nodeID: 'restproxy'})
        console.info(result)
    })
    it('node resources:orderer', async () => {
        const result = await new Node(context).OCI({nodeID: 'orderer0'})
        console.info(result)
    })
    it('node resources:peer', async () => {
        const result = await new Node(context).OCI({nodeID: 'peer0'})
        console.info(result)
    })
})