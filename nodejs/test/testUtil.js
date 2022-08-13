import UserBuilder from 'khala-fabric-admin/user.js';
import path from 'path';
import fs from 'fs';
import {importFrom} from '@davidkhala/light/es6.mjs';
import {findKeyFiles} from 'khala-fabric-formatter/path.js';
import ExportedPeers from '../peers.js';
import PeerManager from 'khala-fabric-admin/peer.js';

const {certs: founderCerts} = importFrom('../../nodejs/test/artifacts/founder-certificates.json', import.meta);
const {certs: davidCerts} = importFrom('../../nodejs/test/artifacts/davidkhala-certificates.json', import.meta);
const {peers: _peers} = importFrom('../../nodejs/test/artifacts/founder-nodes.json', import.meta);

const {tlscacert: davidTLSCert, admincert: davidAdminCerts} = davidCerts;
const {tlsCACert: founderTlsCACert} = founderCerts;

export const getAdmin_davidkhala_user = () => {

	const mspId = 'davidkhala-com';
	const builder = new UserBuilder({name: 'Admin'});
	const keystore = findKeyFiles(path.resolve('test/crypto-config/peerOrganizations/davidkhala.com/users/Admin@davidkhala.com/msp/keystore'))[0];


	return builder.build({
		key: fs.readFileSync(keystore),
		certificate: davidAdminCerts,
		mspId
	});
};
export const getAdmin_founder_user = () => {
	const builder = new UserBuilder({name: 'Admin'});
	const mspId = 'founder';
	const keystore = path.resolve('test/artifacts/founder-admin-credential/founder-key');
	const signcert = path.resolve('test/artifacts/founder-admin-credential/founder-cert.pem');
	return builder.build({
		key: fs.readFileSync(keystore),
		certificate: fs.readFileSync(signcert),
		mspId
	});
};
export const getPeers_davidkhala = () => {

	const mspID = 'davidkhala-com';
	const exportedPeers = new ExportedPeers({tlscacert: davidTLSCert}, mspID);
	exportedPeers.addPeer({
		host: 'peer0.davidkhala.com',
		port: 7779,
	});
	return exportedPeers.getPeers();
};
export const getPeers_founder = () => {

	return _peers.map(({url}) => {
		const [host, peerPort] = url.split('//')[1].split(':');
		return new PeerManager({host, peerPort, pem: founderTlsCACert});
	});

};
