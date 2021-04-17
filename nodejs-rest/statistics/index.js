const basePath = 'console/admin/api/v1.1/dashboard/statistics'
const {ConnectionContext} = require('../index')

class Statistics extends ConnectionContext {
    async _get(token, params) {
        const resourcePath = `${basePath}/${token}`
        const method = 'GET'
        const {data} = await this.http({resourcePath, method, params})
        return data
    }
}

module.exports = Statistics
