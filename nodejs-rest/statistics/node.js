import Statistics from './index.js'

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
 * @typedef {Object} TxItem
 * @property {string} channelName
 * @property {string} startTime
 * @property {string} endTime
 * @property {number} trans
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

    /**
     * Get the number of endorsements.
     * @param {string} [channel]
     * @param {string} [nodeID]
     * @param {number} [startTime] Epoch millisecond
     * @param {number} [endTime] Epoch millisecond
     * @returns {Promise<Array<TxItem>>}
     */
    async endorsements({channel, nodeID, startTime, endTime} = {}) {
        const params = {
            channel, nodeID
        }
        Object.assign(params, Node.dateFormat({startTime, endTime}))

        const {endorsements} = await this._get('endorsements', params)
        return endorsements
    }

    /**
     * Get the number of commits completed on peers
     * @param {string} [channel]
     * @param {string} [nodeID]
     * @param {number} [startTime]
     * @param {number} [endTime]
     * @return {Promise<Array<TxItem>>}
     */
    async commits({channel, nodeID, startTime, endTime} = {}) {
        const params = {
            channel, nodeID
        }
        Object.assign(params, Node.dateFormat({startTime, endTime}))

        const {commits} = await this._get('commits', params)
        return commits
    }

    /**
     * Get the number of user transactions for a peer or channel or the entire network.
     * @param [channel]
     * @param [nodeID]
     * @param [startTime]
     * @param [endTime]
     * @param {boolean} [orderer] Is targeting application transaction commits processed by Ordering Service
     * @return {Promise<Array<TxItem>>}
     */
    async userTx({channel, nodeID, startTime, endTime, orderer} = {}) {
        const params = {
            channel, nodeID
        }
        if (orderer) {
            params.orderer = 'Y'
            delete params.nodeID
        }
        Object.assign(params, Node.dateFormat({startTime, endTime}))
        const {userTrans} = await this._get('userTrans', params)
        return userTrans
    }
}

module.exports = Node
