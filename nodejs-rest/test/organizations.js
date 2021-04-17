const {getContext} = require('./testUtil')
const Download = require('../organizations/download')
const context = getContext()
const path = require('path')
describe('Download', function () {
    this.timeout(30000)
    const fs = require('fs')

    const orgName = 'founder'
    Object.assign(context, {orgName})
    const download = new Download(context)
    it('connection profile', async () => {
        const filePath = 'abc.yaml'
        await download.connectionProfile(filePath)
        fs.unlinkSync(filePath)
    })
    it('certificates', async () => {
        const filePath = 'abc.json'
        await download.certificates(filePath)
        const blob = await download.certificates()
        console.info(blob)
        fs.unlinkSync(filePath)
    })
    it('adminCredentials', async () => {
        const adminKey = path.resolve(__dirname, '../../nodejs/test/artifacts/founder-admin-credential/founder-key')
        const adminCert =  path.resolve(__dirname, '../../nodejs/test/artifacts/founder-admin-credential/founder-cert.pem')

        await download.adminCredentials({adminCert, adminKey})
    })
    it('orderer', async () => {
        const filePath = path.resolve(__dirname, '../../nodejs/test/artifacts/founder-orderer-settings.json')
        await download.orderingService(filePath)
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