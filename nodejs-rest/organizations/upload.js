const Organizations = require('./index')
const {ReturnCode: {SUCCESS}} = require('../constants')
const assert = require('assert')
const fs = require('fs')
/**
 * @typedef {Object} OrgInfo
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
     * TODO how about https://founder-4-hktwlab-iad.blockchain.ocp.oraclecloud.com:7443/console/api/v1/networks/addOrgs
     * This API is only available on the founder.
     * @param {...OrgInfo} orgInfo
     * @return {Promise<void>}
     */
    async certificates(...orgInfo) {

        const {status} = await super.http('joinNewOrgs', {method: 'POST', body: {orgInfo}})

        assert.strictEqual(status, SUCCESS)
    }

    /**
     *
     * @param {...string} orgInfoFile
     * @return {Promise<void>}
     */
    async certificateFiles(...orgInfoFile) {
        const orgInfos = orgInfoFile.map(Upload.OrgInfoFromFile)
        await this.certificates(...orgInfos)
    }

    static OrgInfoFromFile(certificatesJson) {
        const {mspID, certs, signature} = JSON.parse(fs.readFileSync(certificatesJson, 'utf-8'))


        const {
            nodeouidentifiercert,
            rafttlscacert,
            admincert,
            cacert,
            tlscacert
        } = certs
        return {
            mspId: mspID,
            certs: {
                adminCert: admincert,
                CACert: cacert,
                tlsCACert: tlscacert,
                nodeouIdentifierCert: nodeouidentifiercert || '',
                rafttlsCACert: rafttlscacert || '',
                intermediateCerts: '', //FIXME not found in exported json
            },
            signature: signature || ''
        }
    }
}

module.exports = Upload