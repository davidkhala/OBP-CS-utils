import {ConnectionContext} from '../index.js'
const basePath = `console/admin/api/v1.1/organizations`
export default class Organizations extends ConnectionContext {

    async http(token, {body, method, params}, otherOptions = {}) {
        return super.http({resourcePath: `${basePath}/${token}`, body, method, params}, otherOptions);
    }

    /**
     * return the names of all organizations in a network. This is only available on the founder.
     * @returns {Promise<void>}
     */
    async list() {
        return super.http({resourcePath: basePath, method: 'GET'})
    }

}
