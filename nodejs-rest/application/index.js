const {ConnectionContext} = require('../index')
const basePath = 'restproxy/bcsgw/rest'

class RestProxy extends ConnectionContext {

    async http(token, method) {
        const resourcePath = `${basePath}/${token}`
        return super.http({resourcePath, method})
    }
}

module.exports = RestProxy