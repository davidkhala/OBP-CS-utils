const Nodes = require('./index')

const VerifyResult= {
    success:'success',
    failure: 'failure',
}
class Peers extends Nodes {

    /**
     * @typedef {Object} BlockAuditResult
     * @property {VerifyResult} verifyResult
     * @property {string} timeStamp
     * @property {string} timeElapse
     * @property {string[]} ledgerFiles
     * @property {number} ledgerHeight
     * @property {number} firstBlockNum
     * @property {number} lastBlockNum
     * @property {number} txCount
     * @property {number} lastConfigIndex
     * @property {string} lastBlockDataHash
     * @property {string} lastBlockPreHash
     */

    /**
     *
     * @param {string} peerId
     * @param {string} channelName
     * @return {Promise<VerifyResult>}
     */
    async blockAudit(peerId, channelName) {
        const token = `peers/${peerId}/blockaudit/${channelName}`

        return await this.http(token, "GET")
    }
}

module.exports = Peers