import BaseClass from './common.js';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

/**
 * @class Certificates certificate file Generator
 */
export default class Certificates extends BaseClass {

	constructor(mspPath, mspID, logger) {
		super(mspPath, mspID, logger);
		this.result = {
			mspID,
			type: 'Participant',
			certs: {}
		};

		this.result.certs.admincert = this.searchCert('admincert');
		this.result.certs.cacert = this.searchCert('cacert');
		this.result.certs.tlscacert = this.searchCert('tlscacert');
		const configYaml = path.resolve(mspPath, 'config.yaml');
		if (fs.existsSync(configYaml)) {
			const readBuf = yaml.safeLoad(fs.readFileSync(configYaml));
			const {NodeOUs: {PeerOUIdentifier}} = readBuf;
			const certPath = path.resolve(mspPath, PeerOUIdentifier.Certificate);
			this.result.certs.nodeouIdentifierCert = fs.readFileSync(certPath, 'utf-8');
		}
	}

}
