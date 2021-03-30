const {channelInfo} = require('../statistics')
const {getContext} = require('./testUtil')
describe('statistics', function () {
    this.timeout(30000)

    it('channelInfo', async () => {
        const context = getContext()
        const result = await channelInfo(context)
        console.info(result)
    })
})