const {getContext} = require('../test/testUtil')
const Init = require('../chaincode/init')
const assert = require('assert')
const channelName = process.env.channel || 'default'
describe('chaincode operation', function () {
    this.timeout(20000)
    const chaincodeName = 'diagnose'

    it('init', async () => {
        const context = getContext()
        Object.assign(context, {chaincodeName})
        const chaincode = new Init(context)
        const chaincodeVersion = 'v1'
        const peers = []
        await chaincode.upgrade({channelName, chaincodeVersion, peers})
    })
})
const Tx = require('../application/transactions')
const {ChaincodeSamples} = require('../index')
describe('transaction on samples', () => {

    const context = getContext()
    const tx = new Tx(context, channelName)

    const host = 'founder-5-hktwlab-iad.blockchain.ocp.oraclecloud.com'
    const peerPort = '20009'
    it('query a', async function () {
        this.timeout(60000)

        const chaincodeName = ChaincodeSamples.balanceTransfer

        const test1 = await tx.query(chaincodeName, {host, peerPort}, {args: ['query', 'a']})
        const test2 = await tx.query(chaincodeName, {host, peerPort}, {fcn: 'query', args: ['a']})
        assert.strictEqual(test1, test2)


    })
})