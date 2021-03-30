const BasePath = 'console/admin/api/v1.1/dashboard/statistics'
/**
 *
 * @param {ConnectionContext} context
 * @returns {Promise<*>}
 */
const channelInfo = async (context) => {
    const resourcePath = `${BasePath}/channelInfo`
    const method = 'GET'
    const {data} = await context.http({resourcePath, method})
    return data
}
module.exports = {
    channelInfo
}