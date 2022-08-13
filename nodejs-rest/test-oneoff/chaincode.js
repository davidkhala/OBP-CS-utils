import {getContext} from '../test/testUtil.js';
import assert from 'assert';
import Tx from '../application/transactions.js';
import {ChaincodeSamples} from '../index.js';

const channelName = process.env.channel || 'default';
describe('transaction on samples', () => {

	const context = getContext();
	const tx = new Tx(context, channelName);

	const host = 'founder-5-hktwlab-iad.blockchain.ocp.oraclecloud.com';
	const peerPort = '20009';
	it('query a', async function () {
		this.timeout(0);

		const chaincodeName = ChaincodeSamples.balanceTransfer;

		const test1 = await tx.query(chaincodeName, {host, peerPort}, {args: ['query', 'a']});
		const test2 = await tx.query(chaincodeName, {host, peerPort}, {fcn: 'query', args: ['a']});
		assert.strictEqual(test1, test2);


	});
});