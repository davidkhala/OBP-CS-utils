import {ConnectionContext} from '../index.js';
const basePath = 'console/admin/api/v2/nodes';

export default class Nodes extends ConnectionContext {
	async http(token, method, body) {
		const resourcePath = `${basePath}/${token}`;
		return super.http({resourcePath, method, body});
	}

	/**
     *
     * @return {Promise<{peers:Array,orderers:Array,fabricCAs:Array,RESTProxies:Array}>}
     */
	async list() {
		return this.http('', 'GET');
	}
}
