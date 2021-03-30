const {axiosPromise} = require('khala-axios')
const assert = require('assert')

class ConnectionContext {
    constructor({username, password, Route}) {
        if (!username) {
            throw Error('Missing username')
        }
        if (!password) {
            throw Error('Missing password')
        }
        Object.assign(this, {username, password, Route})
    }

    async http({resourcePath, body, method, formData, params}, otherOptions = {}) {
        const {username, password, Route} = this
        Object.assign(otherOptions, {auth: {username, password}})
        const url = `${Route}/${resourcePath}`
        return axiosPromise({url, body, method, formData, params}, otherOptions)
    }

    async version() {
        const resourcePath = '/restproxy/bcsgw/rest/version'
        const {version, returnCode} = await this.http({resourcePath, method: 'GET'})
        assert.strictEqual(returnCode, 'Success')
        return version
    }
}

const buildRoute = (instance, sequence, tenancy, RegionKey) => {
    return `https://${instance}-${sequence}-${tenancy}-${RegionKey.toLowerCase()}.blockchain.ocp.oraclecloud.com:7443`
}
const buildRouteFromDomain = (domain) => {
    return `https://${domain}:7443`
}
/**
 * @enum {string}
 */
const SupportedMethod = {
    GET: "GET",
    POST: "POST",
    PATCH: "PATCH",
    DELETE: "DELETE"
}
/**
 * @enum {string}
 */
const ReturnCode = {
    SUCCESS: 'Success'
}
module.exports = {
    ConnectionContext,
    buildRouteFromDomain,
    SupportedMethod,
    ReturnCode
}