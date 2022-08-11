import fs from 'fs';

import OrdererManager from 'khala-fabric-sdk-node-builder/orderer.js';

export default class Orderers {

	static FromOrdererSettings(jsonFile) {
		const {certs: {tlscacert}, orderingServiceNodes} = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
		return orderingServiceNodes.map(({address}) => {
			const noprotocol = address.split('//')[1];
			const [host, ordererPort] = noprotocol.split(':');
			return new OrdererManager({host, ordererPort, pem: tlscacert});
		});
	}

}
