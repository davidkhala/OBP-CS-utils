import Organizations from './index.js'
import fs from 'fs'

export default class Download extends Organizations {
    constructor(context, orgName, logger) {
        super(context, logger);
        Object.assign(this, {orgName})
    }

    /**
     * Download the Fabric connection profile of the specified organization
     * @param {string} [filePath]
     * @returns {Promise<string|undefined>}
     */
    async connectionProfile(filePath) {
        const blob = await this.http(`${this.orgName}/connectionProfile/`, {method: 'GET'})
        if (!filePath) return blob
        fs.writeFileSync(filePath, blob)
    }

    /**
     * return the admin, CA, and TLS certificates for an organization.
     * @param {string} [filePath]
     * @returns {Promise<string|undefined>}
     */
    async certificates(filePath) {
        const blob = await this.http(`${this.orgName}/certificates`, {method: 'GET'}, {responseType: 'arraybuffer'})
        if (!filePath) return blob.toString()
        fs.writeFileSync(filePath, blob)

    }

    /**
     * returns the orderer service settings for a founder organization, including the MSP ID, certificates, and ordering service node addresses. This API is only available on the founder.
     * @param {string} [filePath]
     * @returns {Promise<string|undefined>}
     */
    async orderingService(filePath) {
        const blob = await this.http(`${this.orgName}/orderingService`, {method: 'GET'}, {responseType: 'arraybuffer'})
        if (!filePath) return blob.toString()
        fs.writeFileSync(filePath, blob)
    }


    /**
     * This endpoint returns the admin certificate and key for an organization.
     */
    async adminCredentials({adminCert: certPath, adminKey: keyPath} = {}) {
        const {adminKey, adminCert} = await this.http(`${this.orgName}/adminCredentials`, {method: 'GET'})
        if (certPath) {
            fs.writeFileSync(certPath, adminCert)
        }
        if (keyPath) {
            fs.writeFileSync(keyPath, adminKey)
        }
        return {adminKey, adminCert}
    }
}
