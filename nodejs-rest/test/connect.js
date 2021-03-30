const {getContext} = require('./testUtil')
const assert = require('assert')
describe('test Context', function () {
    this.timeout(3000)
    it('version', async () => {
        const Version = require('../application/version')
        const context = getContext()
        const version = await new Version(context).version()
        assert.strictEqual(version, 'v1.0')
    })
})