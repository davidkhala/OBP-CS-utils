import assert from 'assert';
import Index from './index.js';
import {defaultEnrollmentID} from '../constants.js'
export class RestProxy extends Index {

	async http(token, method, body) {
		return super.http(`restproxies/${token}`, method, body);
	}
}

export function isRESTProxyId(RESTProxyId) {
	return RESTProxyId.match(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}-restproxy$/gm);
}


export const enrollmentIDRegx = /^[\w-]+$/gm;

export function isEnrollmentID(id) {
	return typeof id === 'string' && id.match(enrollmentIDRegx) && id !== defaultEnrollmentID;
}

export class Enrollment extends RestProxy {

	constructor(RESTProxyId, ...props) {
		super(...props);
		assert.ok(isRESTProxyId(RESTProxyId));
		this.RESTProxyId = RESTProxyId;
	}

	async http(token, method, body) {
		return super.http(`${this.RESTProxyId}/enrollments/${token}`, method, body);
	}


	async associate(enrollmentId, userName) {
		assert.ok(isEnrollmentID(enrollmentId), `invalid enrollmentId format. Expect matching with ${enrollmentIDRegx}`);
		await this.http(`${enrollmentId}/users`, 'POST', {userName});
	}

	async disassociate(enrollmentId, userName) {
		await this.http(`${enrollmentId}/users/${userName}`, 'DELETE');
	}

	async list(enrollmentId) {
		if (isEnrollmentID(enrollmentId)) {
			return await this.http(`${enrollmentId}/users`, 'GET');
		} else {
			const result = await this.http('', 'GET');
			assert.ok(result.includes(defaultEnrollmentID));
			return result;
		}
	}

	async create(enrollmentId, attributes = {}) {
		assert.ok(isEnrollmentID(enrollmentId), `invalid enrollmentId format. Expect matching with ${enrollmentIDRegx}`);
		return await this.http('', 'POST', {
			enrollmentId, attributes
		});
	}

	async delete(enrollmentId) {
		await this.http(enrollmentId, 'DELETE');
	}
}

