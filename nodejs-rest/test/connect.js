const {getContext} = require('./testUtil')
const assert = require('assert')
describe('test Context', function () {
    this.timeout(0)
    it('version', async () => {
        const App = require('../application')
        const context = getContext()
        await new App(context).version()

    })
})