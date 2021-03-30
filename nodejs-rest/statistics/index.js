const BasePath = 'console/admin/api/v1.1/dashboard/statistics'
const {ConnectionContext} = require('../index')

class Statistics extends ConnectionContext {
    async _get(token) {
        const resourcePath = `${BasePath}/${token}`
        const method = 'GET'
        const {data} = await this.http({resourcePath, method})
        return data
    }
}

module.exports = Statistics
