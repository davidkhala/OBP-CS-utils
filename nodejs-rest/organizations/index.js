const {ConnectionContext} = require('../index')

class Organizations extends ConnectionContext {
    constructor({username, password, route, orgName}, logger) {
        super({username, password, route}, logger);
        this.basePath = `console/admin/api/v1.1/organizations/${orgName}`
    }

    async http(token, {body, method, params}, otherOptions = {}) {
        return super.http({resourcePath: `${this.basePath}/${token}`, body, method, params}, otherOptions);
    }

    /**
     * return the names of all organizations in a network. This is only available on the founder.
     * @returns {Promise<void>}
     */
    async list(){
        return super.http({resourcePath:'console/admin/api/v1.1/organizations', method:'GET'})
    }

}

module.exports = Organizations