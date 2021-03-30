const BasePath = 'console/admin/api/v1.1/dashboard/statistics'
const {ConnectionContext} = require('../index')

class Statistics extends ConnectionContext {
    async _get(token) {
        const resourcePath = `${BasePath}/${token}`
        const method = 'GET'
        return this.http({resourcePath, method})
    }
}

module.exports = Statistics


// TODO CPU Utilization
// TODO Nodes OCPU Consumption
// TODO Storage Utilization
// TODO Commits Processed by Ordering Service
// TODO Endorsements Processed by Peer
// TODO Commits Processed by Peer