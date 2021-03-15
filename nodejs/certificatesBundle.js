const fs = require('fs');
const path = require('path')
const PathUtil = require('khala-fabric-formatter/path')

/**
 * @class CertificateBundleGenerator certificate file Generator
 */
class CertificateBundleGenerator {

    constructor(mspPath, mspID, logger = console) {
        Object.assign(this, {mspPath, mspID, logger})
    }

    organization(outputFile) {
        const {mspPath, mspID} = this;

        const result = {
            mspID,
            type: "Participant",
            certs: {}
        }
        const smartInput = (type) => {
            const certs = PathUtil.findCertFiles(path.resolve(mspPath, `${type}s`))
            if (certs.length > 1) {
                this.logger.warn(`ambiguous ${type}: confused by`, certs)
            }
            if (certs.length === 0) {
                throw Error(`${type} not found under ${mspPath}`)
            }
            result.certs[type] = fs.readFileSync(certs[0], 'utf-8')
        }
        smartInput('admincert')
        smartInput('cacert')
        smartInput('tlscacert')
        if (outputFile) {
            fs.writeFileSync(outputFile, JSON.stringify(result, null, 2))
            return
        }
        return result
    }
}


module.exports = CertificateBundleGenerator