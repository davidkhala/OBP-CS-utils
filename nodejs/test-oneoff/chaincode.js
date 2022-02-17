import {
	getAdmin_davidkhala_Client,
	getAdmin_founder_Client,
	getPeers_founder,
	getPeers_davidkhala
} from '../test/testUtil.js'
import assert from 'assert'
import {install} from 'khala-fabric-sdk-node/chaincode'
import {setGOPATH} from 'khala-fabric-sdk-node/golang'

describe('deploy chaincode', function () {
	this.timeout(0)
	const chaincodeId = 'diagnose'

	it('install to davidkhala.com', async () => {

		const chaincodePath = 'github.com/davidkhala/chaincode/golang/diagnose'
		const chaincodeVersion = 'v1'
		const peerManager = getPeers_davidkhala()[0]
		assert.ok(await peerManager.ping())


		const client_david = getAdmin_davidkhala_Client();
		await setGOPATH()

		const results0 = await install([peerManager.peer], {
			chaincodeId,
			chaincodePath,
			chaincodeVersion
		}, client_david)
		console.debug('install towards davidkhala.com', results0)

	})
	it('install to founder', async ()=> {

		const chaincodePath = 'github.com/davidkhala/chaincode/golang/diagnose'
		const chaincodeVersion = 'v2'

		await setGOPATH()

		const peers_founder = getPeers_founder()

		const client_founder = getAdmin_founder_Client()

		const results1 = await install([peers_founder[0].peer], {
			chaincodeId,
			chaincodePath,
			chaincodeVersion
		}, client_founder)
		console.debug('install towards founder', results1)


	})


})