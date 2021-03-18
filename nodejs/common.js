const path = require('path')
const PathUtil = require('khala-fabric-formatter/path')
const fs = require('fs')

class _baseClass {
    constructor(mspPath, mspID, logger = console) {
        Object.assign(this, {mspPath, mspID, logger})
        this.result = {}
    }

    searchCert(type) {
        const {mspPath} = this;
        const certs = PathUtil.findCertFiles(path.resolve(mspPath, `${type}s`))
        if (certs.length > 1) {
            this.logger.warn(`ambiguous ${type}: confused by`, certs)
        }
        if (certs.length === 0) {
            throw Error(`${type} not found under ${mspPath}`)
        }
        return fs.readFileSync(certs[0], 'utf-8')
    }

    build(outputFile) {
        fs.writeFileSync(outputFile, JSON.stringify(this.result, null, 2))
    }
}

module.exports = _baseClass