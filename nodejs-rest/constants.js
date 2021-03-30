/**
 * @enum {string}
 */
const SupportedMethod = {
    GET: "GET",
    POST: "POST",
    PATCH: "PATCH",
    DELETE: "DELETE"
}
/**
 * @enum {string}
 */
const ReturnCode = {
    SUCCESS: 'Success'
}
/**
 * @enum {string}
 */
const NodeType = {
    CA: 'ca',
    proxyAPI: 'restproxy',
    consoleAPI: 'console',
    Orderer: 'orderer',
    Peer: 'peer'
}
/**
 *
 * @enum {string}
 */
const NodeStatus = {
    up: 'up'
}

module.exports = {
    SupportedMethod,
    ReturnCode,
    NodeType,
    NodeStatus,
}


