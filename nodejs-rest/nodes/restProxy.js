import assert from 'assert'
import Index from './index.js'

export class RestProxy extends Index {

    async http(token, method, body) {
        return super.http(`restproxies/${token}`, method, body);
    }
}

export function isRESTProxyId(RESTProxyId) {
    return RESTProxyId.match(/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}-restproxy$/gm)
}

export class Enrollment extends RestProxy {

    constructor(RESTProxyId, ...props) {
        super(...props);
        assert.ok(isRESTProxyId(RESTProxyId))
        this.RESTProxyId = RESTProxyId
    }

    async http(token, method, body) {
        return super.http(`${this.RESTProxyId}/enrollments/${token}`, method, body);
    }

    async list() {
        return await this.http('', 'GET')
    }

    async create(enrollmentId, attributes = {}) {
        return await this.http('', 'POST', {
            enrollmentId, attributes
        })
    }

    async delete(enrollmentId) {
        await this.http(enrollmentId, 'DELETE')
    }
}
