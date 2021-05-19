const Index = require('./index')
const assert = require('assert')
class Transactions extends Index {

    constructor(context, channel = 'default', logger) {
        super(context, logger);
        Object.assign(this, {channel})
    }

    // for CouchDB array operators, range query and pagination aren't supported.
    async query(chaincode, {host, peerPort}, {fcn, args = [], timeout}) {

        const token = `channels/${this.channel}/chaincode-queries`
        if (fcn) {
            args = [fcn, ...args]
        }
        const body = {
            chaincode,
            args,
            timeout: timeout || 30000,
            peer: `${host}:${peerPort}`
        }

        const {returnCode,error,result} =await this.http(token, 'POST', body)
        assert.strictEqual(error,'')
        assert.strictEqual(returnCode, 'Success')
        const {payload, encode} = result
        assert.strictEqual(encode,'JSON')
        return payload
    }
}

module.exports = Transactions