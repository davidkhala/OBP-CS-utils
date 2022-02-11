import {axiosPromise} from 'khala-axios'
import dateformat from 'date-format'

export class ConnectionContext {
	constructor({username, password, route}, logger = console) {
		if (!username) {
			throw Error('Missing username')
		}
		if (!password) {
			throw Error('Missing password')
		}
		Object.assign(this, {username, password, route, logger})
	}

	async http({resourcePath, body, method, params}, otherOptions = {}) {
		const {username, password, route} = this
		Object.assign(otherOptions, {auth: {username, password}})
		const url = `${route}/${resourcePath}`
		return axiosPromise({url, body, method, params}, otherOptions)
	}

	/**
	 *
	 * @param {number} [startTime] Epoch millisecond
	 * @param {number} [endTime] Epoch millisecond
	 * @return {{startTime:string,endTime:string}}
	 */
	static dateFormat({startTime, endTime}) {
		const mask = 'yyyyMMddhhmmss'
		const result = {}
		if (startTime) {
			result.startTime = dateformat(mask, new Date(startTime))
		}
		if (endTime) {
			result.endTime = dateformat(mask, new Date(endTime))
		}
		return result
	}
}

export class Route {
	static From(instance, sequence, tenancy, RegionKey) {
		return `https://${instance}-${sequence}-${tenancy}-${RegionKey.toLowerCase()}.blockchain.ocp.oraclecloud.com:7443`
	}

	static FromDomain(domain) {
		return `https://${domain}:7443`
	}
}

/**
 * @enum {string}
 */
export const ChaincodeSamples = {
	balanceTransfer: 'obcs-example02',
	carDealer: 'obcs-cardealer',
	marbles: 'obcs-marbles',
}
