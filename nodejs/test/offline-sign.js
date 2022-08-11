import path from 'path';
import ProposalManager from 'khala-fabric-admin/proposal.js';
import {emptyChannel} from 'khala-fabric-admin/channel.js';
import Peer from 'khala-fabric-admin/peer.js';
import {VaultIdentityContext} from '../fabric.js';
import fs from 'fs';
import {Key, Vault} from '@davidkhala/oci-key-vault';
import assert from 'assert';
import {FileAuthentication} from '@davidkhala/oci-common';
import {args_transfer, args_queryA} from './chaincode-balanceTransfer.js';
import Orderer from 'khala-fabric-admin/orderer.js';

import {isArrayEven} from '@davidkhala/light/syntax.js';

const enrollmentID = process.env.IDCS_ID;
if (!enrollmentID) {
	throw Error('process.env.IDCS_ID not found');
}
const auth = new FileAuthentication();
const signCert = path.resolve(`test/artifacts/founder-user-credential/${enrollmentID}-cert.pem`);
const tlsCert = path.resolve('test/artifacts/tls.pem');


const getQueryResults = (rawResults) => {
	const queryResults = [];
	rawResults.responses.forEach((response) => {
		if (response.endorsement && response.response && response.response.payload) {
			queryResults.push(response.response.payload.toString());
		}
	});
	assert.ok(isArrayEven(queryResults));
	return queryResults[0];
};
describe('offline-signing', function () {
	this.timeout(0);
	// grpcs://founder-2-hktwlab-sin.blockchain.ocp.oraclecloud.com:20009
	const peer0 = new Peer({
		peerPort: 20009,
		host: 'founder-2-hktwlab-sin.blockchain.ocp.oraclecloud.com',
		cert: tlsCert
	});

	// grpcs://founder-2-hktwlab-sin.blockchain.ocp.oraclecloud.com:20010
	const peer1 = new Peer({
		peerPort: 20010,
		host: 'founder-2-hktwlab-sin.blockchain.ocp.oraclecloud.com',
		cert: tlsCert
	});
	// grpcs://founder-2-hktwlab-sin.blockchain.ocp.oraclecloud.com:20003
	const orderer0 = new Orderer({
		ordererPort: 20003,
		host: 'founder-2-hktwlab-sin.blockchain.ocp.oraclecloud.com',
		cert: tlsCert
	});
	it('ping', async () => {

		assert.ok(await peer0.ping());
		assert.ok(await peer1.ping());
		assert.ok(await orderer0.ping());
	});
	it('propose', async () => {

		const vaultId = 'ocid1.vault.oc1.ap-singapore-1.enrhpwtoaabem.abzwsljrk57oclvejakgkh42rblwi7dmymmhnfrmt7nmloagt24mcrpl236q';
		const vault = new Vault(auth);
		const health = await auth.connect();
		assert.ok(health);
		const oneVault = await vault.get(vaultId);
		const keyID = 'ocid1.key.oc1.ap-singapore-1.enrhpwtoaabem.abzwsljrizggn5jlznyv7j64ccchehu6wc6vmfllyobilups4ahhp34pzyqq';
		const key = new Key(auth, oneVault, keyID);
		const certificate = fs.readFileSync(signCert).toString();
		console.debug(certificate);

		const mspid = 'founder';
		const identityContext = new VaultIdentityContext(certificate, key, mspid);
		const chaincodeId = 'obcs-example02';
		const channelName = 'default';


		await peer0.connect();
		await peer1.connect();
		const endorsers = [peer0.endorser, peer1.endorser];
		const proposal = new ProposalManager(identityContext, endorsers, chaincodeId, emptyChannel(channelName));
		proposal.asEndorsement();
		proposal.signingProcess = async (payload) => {
			fs.writeFileSync(path.resolve('payload' + Date.now()), Buffer.from(payload).toString('base64'));
			const signature_base64 = await key.sign(payload);
			return Buffer.from(signature_base64, 'base64');
		};


		const [fcn, ...args] = args_queryA;

		// TODO workaround by `peer/Propose` ACL = READERS with manual ACL applied to client certificate
		const rawResult = await proposal.send({fcn, args,});
		console.info(getQueryResults(rawResult));

		// commit
		const committers = [orderer0.committer];

		const commitResult = await proposal.commit(committers);
		console.debug({commitResult});

	});
});