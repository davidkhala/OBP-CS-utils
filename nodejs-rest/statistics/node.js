const Statistics = require('./index')
/**
 * @typedef {Object} _nodeBaseInfo
 * @property {string} nodeId
 * @property {NodeType} nodeType
 */

/**
 * @typedef {_nodeBaseInfo} NodeHealthStatus
 * @property {{time:string,status:string}} health
 */

/**
 * @typedef {_nodeBaseInfo} OCIMetric
 * @property {{cpu:number, memory: string, disk: string }} resUsage
 * @property {Map<number>} blockNums
 */

/**
 *
 */
class Node extends Statistics {
    /**
     * Get the node health status (up or down).
     * @returns {Promise<Array<NodeHealthStatus>>}
     */
    async health() {
        return this._get('nodeHealth')
    }

    /**
     * Get the node usage related metrics (CPU, memory, disk usage).
     * @param {string} [nodeID]
     * @returns {Promise<Array<OCIMetric>>}
     */
    async OCI({nodeID} = {}) {
        const params = {nodeID}
        return this._get('nodeRes', params)
    }
}

module.exports = Node
