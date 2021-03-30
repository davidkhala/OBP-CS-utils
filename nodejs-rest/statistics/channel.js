const Statistics = require('./index')

/**
 * @typedef {Object} ChannelInfo
 * @property {string} channelName
 * @property {number} peerNum
 * @property {string[]} peers
 */


class Channel extends Statistics {
    /**
     * @returns {Promise<Array<ChannelInfo>>}
     */
    async channelInfo() {
        return this._get('channelInfo')
    }
}

module.exports = Channel
