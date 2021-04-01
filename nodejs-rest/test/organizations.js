const {getContext} = require('./testUtil')
const Download = require('../organizations/download')
const context = getContext()
describe('Download', function () {
    this.timeout(30000)
    const fs = require('fs')

    const orgName = 'founder'
    Object.assign(context, {orgName})
    it('connection profile', async () => {
        const filePath = 'abc.yaml'
        await new Download(context).connectionProfile(filePath)
        fs.unlinkSync(filePath)
    })
    it('certificates', async () => {
        const filePath = 'abc.json'
        await new Download(context).certificates(filePath)
        const blob = await new Download(context).certificates()
        console.info(blob)
        fs.unlinkSync(filePath)
    })
    it('orderer', async () => {
        const filePath = 'abc.json'
        const download = new Download(context)
        await download.orderingService(filePath)
        fs.unlinkSync(filePath)
    })
})
describe('index', function () {
    this.timeout(30000)
    const Organizations = require('../organizations/index')
    it('list', async () => {
        const organizations = new Organizations(context)
        const result = await organizations.list()
        console.info(result)
    })

})