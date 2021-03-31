const {ConnectionContext} = require('../index')


class Organizations extends ConnectionContext {
    constructor({username, password, route, orgName}, logger) {
        super({username, password, route}, logger);
        this.BasePath = `console/admin/api/v1.1/organizations/${orgName}`
    }

    async http(token, {body, method, params}, otherOptions = {}) {
        return super.http({resourcePath: `${this.BasePath}/${token}`, body, method, params}, otherOptions);
    }

}

module.exports = Organizations