const {getContext} = require('./testUtil')
const Nodes = require('../nodes/index')
const path = require('path')
const fs = require('fs')
describe('nodes', function () {
    this.timeout(3000)
    const context = getContext()
    const nodes = new Nodes(context)
    it('list', async () => {
        const {peers, orderers, fabricCAs, RESTProxies} = await nodes.list()

        const result = {peers, orderers,fabricCAs,RESTProxies}
        const outputFile = path.resolve(__dirname, '../../nodejs/test/artifacts/founder-nodes.json')
        fs.writeFileSync(outputFile, JSON.stringify(result, null, 2))

    })

})