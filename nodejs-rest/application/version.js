const assert = require('assert')
const Restproxy = require('./index')

class Version extends Restproxy {
    async version() {
        const {version, returnCode} = await this.http('version', 'GET')
        assert.strictEqual(returnCode, 'Success')
        return version
    }
}

module.exports = Version
