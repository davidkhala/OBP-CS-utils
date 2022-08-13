import RestProxy from '../application/index.js';
import Chaincode from '../chaincode/index.js';
import {getContext} from './testUtil.js';
import path from 'path';

describe('chaincode', function () {
	this.timeout(0);

	it('auth', async () => {
		const context = getContext();
		const rest = new RestProxy(context);
		await rest.version();
	});
	it('list', async () => {
		const context = getContext();
		const chaincode = new Chaincode(context);
		const result = await chaincode.list();
		console.log(result);
		const peerID = 'b7523ef1-352c-4911-9a76-3c8e41be1561-peer0';
		const queryResult = await chaincode.list(peerID);
		console.log(queryResult);
	});
	it('install', async () => {
		const context = getContext();
		const chaincode = new Chaincode(context);
		const peers = [
			'grpcs://founder-2-hktwlab-sin.blockchain.ocp.oraclecloud.com:20009',
			'grpcs://founder-2-hktwlab-sin.blockchain.ocp.oraclecloud.com:20010\t'
		];
		const archiveFile = path.resolve('test', 'diagnose.ccPack.tar');
		const result = await chaincode.install(archiveFile, peers);
		console.log(result);
	});
	it('get', async () => {
		const packageId = 'diagnose:b1d9baae2baf9d95e1b39f081be199852759464dc67658833920d114d5dcea27';

		const context = getContext();
		const chaincode = new Chaincode(context);

		const fileContent = await chaincode.get(packageId);
	});

});
