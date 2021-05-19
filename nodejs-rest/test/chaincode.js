const Chaincode = require('../chaincode')
const {getContext} = require('./testUtil')
describe('chaincode', function () {
    this.timeout(20000)

    it('list', async () => {
        const context = getContext()
        const chaincode = new Chaincode(context)
        const result = await chaincode.list()
        console.log(result)
    })

})
