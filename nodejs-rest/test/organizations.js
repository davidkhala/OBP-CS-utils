const {getContext, getParticipantContext} = require('./testUtil')
const Download = require('../organizations/download')

const path = require('path')
const fs = require('fs')
describe('download founder', function () {
    this.timeout(0)
    const context = getContext()
    const orgName = 'founder'

    const download = new Download(context, orgName)
    it('connection profile', async () => {
        const filePath = 'abc.yaml'
        await download.connectionProfile(filePath)
        fs.unlinkSync(filePath)
    })
    it('certificates', async () => {
        const filePath = path.resolve(__dirname, '../../nodejs/test/artifacts/founder-certificates.json')
        await download.certificates(filePath)

    })
    it('adminCredentials', async () => {
        const adminKey = path.resolve(__dirname, '../../nodejs/test/artifacts/founder-admin-credential/founder-key')
        const adminCert = path.resolve(__dirname, '../../nodejs/test/artifacts/founder-admin-credential/founder-cert.pem')

        await download.adminCredentials({adminCert, adminKey})
    })
    it('orderer', async () => {
        const filePath = path.resolve(__dirname, '../../nodejs/test/artifacts/founder-orderer-settings.json')
        await download.orderingService(filePath)
    })
})
describe('download participant', function (){
    this.timeout(0)
    const context = getParticipantContext()
    const orgName = 'participant'
    const download = new Download(context, orgName)
    it('certificates', async () => {
        const filePath = path.resolve(__dirname, '../../nodejs/test/artifacts/participant-certificates.json')
        await download.certificates(filePath)
    })
    it('connection profile', async () => {
        const filePath = 'abc.yaml'
        await download.connectionProfile(filePath)
        fs.unlinkSync(filePath)
    })
})
describe('index', function () {
    this.timeout(0)
    const Organizations = require('../organizations/index')
    const context = getContext()
    it('list', async () => {
        const organizations = new Organizations(context)
        const result = await organizations.list()
        console.info(result)
    })

})
