import Statistics from './index.js'

/**
 * @typedef {Object} ChannelInfo
 * @property {string} channelName
 * @property {number} peerNum
 * @property {string[]} peers
 */


export default class Channel extends Statistics {
	/**
	 * @returns {Promise<Array<ChannelInfo>>}
	 */
	async channelInfo() {
		const {data} = await this._get('channelInfo')
		return data
	}
}

