const {getContext} = require('./testUtil')
const Download = require('../organizations/download')
describe('Download', function () {
    this.timeout(30000)
    const fs = require('fs')
    const context = getContext()
    const orgName = 'founder'
    Object.assign(context, {orgName})
    it('connection profile', async () => {
        const filePath = 'abc.yaml'
        await new Download(context).connectionProfile(filePath)
        fs.unlinkSync(filePath)
    })
    it('certificates', async ()=>{
        const filePath = 'abc.json'
        await new Download(context).certificates(filePath)
        const blob = await new Download(context).certificates()
        console.info(blob)
        fs.unlinkSync(filePath)
    })
})