const Organizations = require('./index')
const fs = require('fs')

class Download extends Organizations {
    // Download Connection Profile
    async connectionProfile(filePath) {
        const blob = await this.http('connectionProfile', {method: 'GET'})
        if (!filePath) return blob
        fs.writeFileSync(filePath, blob)
    }

    // return the admin, CA, and TLS certificates for an organization.
    async certificates(filePath) {
        const blob = await this.http('certificates', {method: 'GET'}, {responseType:'arraybuffer'})
        if (!filePath) return blob.toString('utf8')
        fs.writeFileSync(filePath, blob)

    }

}

module.exports = Download