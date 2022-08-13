import path from 'path';
import CertGen from '../certificates.js';
describe('json generator', () => {

	it('peer org certificates', () => {

		const mspPath = path.resolve(__dirname, 'crypto-config', 'peerOrganizations', 'davidkhala.com', 'msp');
		const mspID = 'davidkhala-com';
		const certGen = new CertGen(mspPath, mspID);

		console.log(certGen.result);
		const outputPath = path.resolve(__dirname, 'artifacts/davidkhala-certificates.json');
		certGen.build(outputPath);
	});
});
