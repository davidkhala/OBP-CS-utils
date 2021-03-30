const {ConnectionContext} = require('../index')
const BasePath = 'restproxy/bcsgw/rest'

class Restproxy extends ConnectionContext {

    async http(token, method) {
        const resourcePath = `${BasePath}/${token}`
        return super.http({resourcePath, method})
    }
}

module.exports = Restproxy