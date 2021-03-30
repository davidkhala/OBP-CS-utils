const Channel = require('../statistics/channel')
const Node = require('../statistics/node')

const {getContext} = require('./testUtil')
describe('statistics', function () {
    this.timeout(30000)
    const context = getContext()
    it('channelInfo', async () => {
        const channelStats = new Channel(context)
        const result = await channelStats.channelInfo()
        console.info(result)
    })
    it('node', async ()=>{
        const result = await new Node(context).health()
        console.info(result)
    })

})
describe('OCI metrics', function (){
    this.timeout(30000)
    const context = getContext()
    it('node resources', async ()=>{
        const result = await new Node(context).OCI()
        console.info(result)
    })
})