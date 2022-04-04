import {ConnectionContext} from '../index.js'
import path from "path";
import fs from "fs";
import assert from 'assert'
const basePath = 'console/admin/api/v2/chaincodes'

export default class Chaincode extends ConnectionContext {


	/**
	 * Get Installed Chaincode List
	 * @param {string} [peerId] ID of the peer where the chaincode is installed
	 */
	async list(peerId) {
		const params = {peerId}
		const rawResult = await super.http({resourcePath: basePath, method: 'GET', params})
		const result = {}
		for (const {peerId, chaincodes} of rawResult) {
			result[peerId] = chaincodes
		}

		return result
	}

	async get(packageID) {

		const resourcePath = `${basePath}/${packageID}`
		return super.http({resourcePath, method: 'GET'})
	}

	/**
	 *
	 * @param archiveFile
	 * @param peers
	 * @param label
	 * @param type
	 * @return {string} package_id
	 */
	async install(archiveFile, peers, {label, type = "golang"} = {}) {
		// BASE64 encoded zip file.
		const fileName = path.basename(archiveFile)

		const content = fs.readFileSync(archiveFile).toString('base64')
		const body = {
			source: {
				fileName,
				content,
			},

			peers: peers.map(peer => ({url: peer}))
		}
		if (label) {
			Object.assign(body, {label, type})
		} else {
			body.source.isPackaged = true
		}
		const {respMesg, package_id} = await super.http({resourcePath: basePath, method: 'POST', body})
		assert.strictEqual(respMesg, 'SUCCESS')
		return package_id

	}

}
