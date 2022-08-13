import {ConnectionContext} from '../index.js';
const basePath = 'console/admin/api/v1.1/nodes';

export default class Nodes extends ConnectionContext {
	async http(token, method) {
		const resourcePath = `${basePath}/${token}`;
		return super.http({resourcePath, method});
	}

	/**
     *
     * @return {Promise<{peers:Array,orderers:Array,fabricCAs:Array,RESTProxies:Array}>}
     */
	async list() {
		return this.http('', 'GET');
	}
}
