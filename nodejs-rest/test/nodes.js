import {getContext} from './testUtil.js'
import Nodes from '../nodes/index.js'
import Peers from '../nodes/peers.js'
import path from 'path'
import fs from 'fs'

describe('nodes', function () {
	this.timeout(0)
	const context = getContext()
	const nodes = new Nodes(context)
	it('list', async () => {
		const {peers, orderers, fabricCAs, RESTProxies} = await nodes.list()

		const result = {peers, orderers, fabricCAs, RESTProxies}
		const outputFile = path.resolve(__dirname, '../../nodejs/test/artifacts/founder-nodes.json')
		fs.writeFileSync(outputFile, JSON.stringify(result, null, 2))

	})
	const peers = new Peers(context)
	it('peers', async () => {
		const peerId = 'peer0'
		const channelName = 'default'
		const result = await peers.blockAudit(peerId, channelName)
		console.log(result)
	})
})