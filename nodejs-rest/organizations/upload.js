const Organizations = require('./index')
const assert = require('assert')
const fs = require('fs')
/**
 * @typedef {Object} OrgInfo FIXME: which is accepted API format
 * @property {string} mspId
 * @property {Certs} certs
 * @property {string} signature
 */


/**
 * @typedef {Object} Certs
 * @property {string} adminCert
 * @property {string} CACert
 * @property {string} tlsCACert
 * @property {string} [nodeouIdentifierCert]
 * @property {string} [rafttlsCACert]
 * @property {string} [intermediateCerts]
 */

/**
 *
 */
class Upload extends Organizations {
    constructor(context, orgName, logger) {
        super(context, logger);
        Object.assign(this, {orgName})
    }
    /**
     * use as founder orgName in Url and use participant json in post body.
     * @param {OrgInfo} orgInfo
     * @return {Promise<void|string>}
     */
    async certificates(orgInfo) {

        let status;
        try {
            const result = await super.http(`${this.orgName}/joinNewOrgs`, {method: 'POST', body: [orgInfo]})
            status = result.status
        } catch (e) {
            if (e.statusCode === 409 && e.statusMessage === 'Conflict') {
                const {response: {data: {respMesg}}} = e
                this.logger.warn(respMesg)
                return respMesg
            } else {
                throw e
            }

        }

        assert.strictEqual(status, 'SUCCESS') // FIXME: should be `Success`
    }

    /**
     *
     * @param {string} orgInfoFile
     * @return {Promise<void>}
     */
    async certificateFile(orgInfoFile) {

        const orgInfo = JSON.parse(fs.readFileSync(orgInfoFile, 'utf-8'))
        await this.certificates(orgInfo)
    }

}

module.exports = Upload