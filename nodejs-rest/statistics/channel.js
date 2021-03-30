const Statistics = require('./index')

/**
 * @typedef {Object} ChannelInfoItem
 * @property {string} channelName
 * @property {number} peerNum
 * @property {string[]} peers
 */


class Channel extends Statistics {
    /**
     * @returns {Promise<Array<ChannelInfoItem>>}
     */
    async channelInfo() {
        const {data} = await this._get('channelInfo')
        return data
    }
}

module.exports = Channel
