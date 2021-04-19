const path = require('path')
const fs = require('fs')
const {getContext} = require('../test/testUtil')

const Upload = require('../organizations/upload')
describe('upload', function () {
    this.timeout(10000)

    const context = getContext()
    context.orgName = 'founder' // Note: this is not your desired new added orgNames, but the founder
    const upload = new Upload(context)
    it('certificates: davidkhala', async () => {
        //TODO all field is required
        const davidkhalaCertificatesJson = path.resolve(__dirname, '../../nodejs/test/artifacts/davidkhala-certificates.json')
        console.debug(fs.readFileSync(davidkhalaCertificatesJson, 'utf-8'))
        await upload.certificateFiles(davidkhalaCertificatesJson)
    })
    it('certificates: participant', async () => {
        const orgInfoFile = path.resolve(__dirname, '../../nodejs/test/artifacts/participant-certificates.json')
        await upload.certificateFiles(orgInfoFile)
    })
})