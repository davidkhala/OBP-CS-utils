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
     *
     * @returns {Promise<Array<NodeHealthStatus>>}
     */
    async health() {
        return this._get('nodeHealth')
    }

    /**
     * This endpoint is used to get the node usage related metrics such as CPU, memory, and disk usage percentages, reflecting the health metrics you can see on the console.
     * @returns {Promise<Array<OCIMetric>>}
     */
    async OCI() {
        return this._get('nodeRes')
    }
}

module.exports = Node
