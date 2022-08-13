const basePath = 'console/admin/api/v2/dashboard/statistics';
import {ConnectionContext} from '../index.js';

export default class Statistics extends ConnectionContext {
	async _get(token, params) {
		const resourcePath = `${basePath}/${token}`;
		const method = 'GET';
		return await this.http({resourcePath, method, params});
	}

	/**
	 * @typedef AuditLog
	 * @property {string} TimeStamp
	 * @property {string} UserIdentity
	 * @property {string} Component
	 * @property {string} ComponentID
	 * @property {string} Severity
	 * @property {string} Action
	 * @property {string} ActionStatus
	 * @property {string} Details
	 */

	/**
	 * @param params
	 * @return {Promise<{limit:number,offset:number,count:number, auditLogs:AuditLog[] }>}
	 */
	async audit(params = {}) {
		Object.assign(params, ConnectionContext.dateFormat({}));
		return await this._get('auditlog', params);
	}
}
