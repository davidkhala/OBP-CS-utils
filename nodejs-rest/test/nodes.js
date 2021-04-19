const {getContext, getParticipantContext} = require('./testUtil')
const Nodes = require('../nodes/index')
describe('nodes', function () {
    this.timeout(3000)
    const context = getContext()
    const nodes = new Nodes(context)
    it('list', async () => {
        const {peers, orderers, fabricCAs, RESTProxies} = await nodes.list()
    })

})