import Chaincode from '../chaincode/index.js'
import {getContext} from './testUtil.js'
import path from 'path';

describe('chaincode', function () {
	this.timeout(0)

	it('list', async () => {
		const context = getContext()
		const chaincode = new Chaincode(context)
		const result = await chaincode.list()
		console.log(result)
	})
	it('install', async () => {
		const context = getContext()
		const chaincode = new Chaincode(context)
		const peers = [
			'grpcs://founder2-hktwlab-icn.blockchain.ocp.oraclecloud.com:20009',
			'grpcs://founder2-hktwlab-icn.blockchain.ocp.oraclecloud.com:20010'
		]
		const archiveFile = path.resolve('test','diagnose.ccPack.tar')
		const result = await chaincode.install(archiveFile, peers)
		console.log(result)
	})
	it('get', async ()=>{
		const packageId = 'diagnose:b1d9baae2baf9d95e1b39f081be199852759464dc67658833920d114d5dcea27'

		const context = getContext()
		const chaincode = new Chaincode(context)

		const fileContent = await chaincode.get(packageId)
	})

})
