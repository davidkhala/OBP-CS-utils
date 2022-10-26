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


    async associate(enrollmentId, userName) {
        // FIXME 400 for associate it to 'defaultuser'
        await this.http(`${enrollmentId}/users`, 'POST', {userName})
    }

    async list(enrollmentId) {
        if (enrollmentId) {
            if (typeof enrollmentId !== 'string') {
                enrollmentId = 'defaultuser'
            //     TODO 404 'defaultuser' has no prebuilt enrollments?
            }
            return await this.http(`${enrollmentId}/users`, 'GET')
        } else {
            return await this.http('', 'GET')
        }
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
