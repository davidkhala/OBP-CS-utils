const {ConnectionContext} = require('../index')
const basePath = 'console/admin/api/v1.1/nodes'

class Nodes extends ConnectionContext {
    async http(token, method) {
        const resourcePath = `${basePath}/${token}`
        return super.http({resourcePath, method})
    }

    /**
     *
     * @return {Promise<{peers:Array,orderers:Array,fabricCAs:Array,RESTProxies:Array}>}
     */
    async list() {
        return this.http('', 'GET')
    }
}

module.exports = Nodes
