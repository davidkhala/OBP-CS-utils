const {ConnectionContext} = require('../index')

const basePath = 'console/admin/api/v1.1/chaincodes'

class Chaincode extends ConnectionContext {

    constructor({username, password, route, chaincodeName}, logger) {
        super({username, password, route}, logger);
        Object.assign(this, {chaincodeName})
    }

    async http(token, method, body) {
        const resourcePath = `${basePath}/${this.chaincodeName}/${token}`
        return super.http({resourcePath, method, body})
    }

    /**
     * Get Installed Chaincode List
     */
    async list() {
        const rawResult = await super.http({resourcePath: basePath, method: 'GET'})
        const result = {}
        for (const {name, versions, paths} of rawResult) {
            result[name] = {versions, paths}
        }

        return result
    }
}

module.exports = Chaincode