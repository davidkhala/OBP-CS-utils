const {Channel} = require('../statistics/channel')
const {getContext} = require('./testUtil')
describe('statistics', function () {
    this.timeout(30000)

    it('channelInfo', async () => {
        const context = getContext()
        const channelStats = new Channel(context)
        const result = await channelStats.channelInfo()
        console.info(result)
    })
})