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
    /**
     * use as founder orgName in Url and use participant json in post body.
     * @param {...OrgInfo} orgInfo
     * @return {Promise<void>}
     */
    async certificates(...orgInfo) {

        let status;
        try {
            const result = await super.http('joinNewOrgs', {method: 'POST', body: orgInfo})
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
     * @param {...string} orgInfoFile
     * @return {Promise<void>}
     */
    async certificateFiles(...orgInfoFile) {
        const OrgInfoFromFile = (certificatesJson) => {
            return JSON.parse(fs.readFileSync(certificatesJson, 'utf-8'))
        }
        const orgInfos = orgInfoFile.map(OrgInfoFromFile)
        await this.certificates(...orgInfos)
    }

}

module.exports = Upload