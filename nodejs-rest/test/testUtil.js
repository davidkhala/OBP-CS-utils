const getContext = ()=>{
    const username = process.env.IDCS_ID
    const password = process.env.IDCS_PASSWORD
    const {ConnectionContext, buildRouteFromDomain} = require('../index')
    const Route = buildRouteFromDomain('founder-4-hktwlab-iad.blockchain.ocp.oraclecloud.com')
    return new ConnectionContext({username, password, Route})
}
module.exports = {
    getContext
}