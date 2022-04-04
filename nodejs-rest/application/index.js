import {ConnectionContext} from '../index.js'
const basePath = 'restproxy/api/v2'
import assert from 'assert'

export default class RestProxy extends ConnectionContext {

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