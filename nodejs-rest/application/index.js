const {ConnectionContext} = require('../index')
const basePath = 'restproxy/api/v2'
const assert = require('assert')

class RestProxy extends ConnectionContext {

    async http(token, method, body) {
        const resourcePath = `${basePath}/${token}`
        return super.http({resourcePath, method, body})
    }

    async version() {

        const rawResult = await super.http({resourcePath:'/restproxy/api/version', method:'GET'})
        const {result, returnCode, error} = rawResult

        assert.strictEqual(returnCode, 'Success')
        assert.strictEqual(error, '')
        assert.strictEqual(result, 'v2.0.0')
        return result
    }
}

module.exports = RestProxy