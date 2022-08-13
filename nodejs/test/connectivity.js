import path from 'path';
import assert from 'assert';
import {getPeers_founder, getPeers_davidkhala, getAdmin_founder_user} from './testUtil.js';
import Orderers from '../orderer.js';
import QueryHub from 'khala-fabric-sdk-node/query.js';
describe('grpc ping', function () {
	this.timeout(0);

	it('local peer:davidkhala', async () => {

		const peers = getPeers_davidkhala();
		for (const peer of peers) {
			const result = await peer.ping();
			assert.ok(result);
		}
	});
	it('OBP peer:founder', async () => {
		const peers = getPeers_founder();
		for (const peer of peers) {
			const result = await peer.ping();
			assert.ok(result);
		}
	});
	it('OBP orderer:founder', async () => {

		const settingsJSON = path.resolve('test/artifacts/founder-orderer-settings.json');

		const orderers = Orderers.FromOrdererSettings(settingsJSON);

		for (const orderer of orderers) {
			const result = await orderer.ping();
			assert.ok(result);
		}

	});
});
describe('query OBP peer:founder', () => {


	it('chaincode installed', async () => {
		const peers_founder = getPeers_founder();
		const {peer} = peers_founder[0];

		const client_founder = getAdmin_founder_user();
		const query = new QueryHub([peer], client_founder)
		const result = await query.chaincodesInstalled(peer, client_founder);
		console.log(result.pretty);
	});
});
