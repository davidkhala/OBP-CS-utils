const {axiosPromise} = require('khala-axios')

class ConnectionContext {
    constructor({username, password, route}) {
        if (!username) {
            throw Error('Missing username')
        }
        if (!password) {
            throw Error('Missing password')
        }
        Object.assign(this, {username, password, route})
    }

    async http({resourcePath, body, method, formData, params}, otherOptions = {}) {
        const {username, password, route} = this
        Object.assign(otherOptions, {auth: {username, password}})
        const url = `${route}/${resourcePath}`
        return axiosPromise({url, body, method, formData, params}, otherOptions)
    }
}

class Route {
    static From(instance, sequence, tenancy, RegionKey) {
        return `https://${instance}-${sequence}-${tenancy}-${RegionKey.toLowerCase()}.blockchain.ocp.oraclecloud.com:7443`
    }

    static FromDomain(domain) {
        return `https://${domain}:7443`
    }
}


module.exports = {
    ConnectionContext,
    Route,
}