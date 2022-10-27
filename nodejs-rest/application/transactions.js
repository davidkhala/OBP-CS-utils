import {RestProxy} from './index.js';
import {defaultEnrollmentID} from '../constants.js';
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

// new from 22.2.1
export class AtomicTx extends RestProxy {

	async invoke(transactions, strictMode, enrollment = 'defaultuser') {
		const body = {
			isolationLevel: strictMode ? 'serializable' : 'readCommitted',
			prepareTimeout: 30000,
			role: defaultEnrollmentID,
			sync: !!strictMode,
			transactions: transactions.map(({args, chaincode, channel, endorsers, timeout, transientMap}) => ({
				args, chaincode, channel, endorsers, timeout, transientMap
			}))
		};
		const {globalStatus, globalTxid, txStartTime, transactions: txResult} = await this.http('atomicTransactions', 'POST', body);

	}
}
