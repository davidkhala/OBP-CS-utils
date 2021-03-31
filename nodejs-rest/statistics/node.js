const Statistics = require('./index')
const dateformat = require('dateformat')
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
     * TODO
     * This endpoint is used to get the node usage related metrics such as CPU, memory, and disk usage percentages, reflecting the health metrics you can see on the console.
     * @returns {Promise<Array<OCIMetric>>}
     */
    async OCI({nodeID, startTime, endTime} = {}) {
        const params = {nodeID}
        const mask = 'yyyymmddhhmmss'
        if (startTime) {
            params.startTime = dateformat(startTime, mask)
        }
        if (endTime) {
            params.endTime = dateformat(endTime, mask)
        }
        return this._get('nodeRes', params)
    }
}

module.exports = Node
