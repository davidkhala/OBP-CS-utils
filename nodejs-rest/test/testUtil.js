
const getContext = () => {
    const username = process.env.IDCS_ID
    const password = process.env.IDCS_PASSWORD
    const {ConnectionContext, Route: {FromDomain}} = require('../index')
    const route = FromDomain('founder-5-hktwlab-iad.blockchain.ocp.oraclecloud.com')
    return new ConnectionContext({username, password, route})
}
const getParticipantContext = () => {
    const username = process.env.IDCS_ID
    const password = process.env.IDCS_PASSWORD
    const {ConnectionContext, Route: {FromDomain}} = require('../index')
    const route = FromDomain('participant-2-hktwlab-icn.blockchain.ocp.oraclecloud.com')
    return new ConnectionContext({username, password, route})
}
module.exports = {
    getContext,
    getParticipantContext
}