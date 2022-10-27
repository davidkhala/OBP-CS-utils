import {RestProxy} from './index.js';
import assert from 'assert';

export default class Transactions extends RestProxy {

	constructor(context, channel = 'default', logger) {
		super(context, logger);
		this.channel = channel;
	}

	// for CouchDB array operators, range query and pagination aren't supported.
	async query(chaincode, {host, peerPort}, {fcn, args = [], timeout = 30000}) {

		const token = `channels/${this.channel}/chaincode-queries`;
		if (fcn) {
			args = [fcn, ...args];
		}
		const body = {
			chaincode,
			args,
			timeout,
			peer: `${host}:${peerPort}`
		};

		const {returnCode, error, result} = await this.http(token, 'POST', body);
		assert.strictEqual(error, '');
		assert.strictEqual(returnCode, 'Success');
		const {payload, encode} = result;
		assert.strictEqual(encode, 'JSON');
		return payload;
	}
}
