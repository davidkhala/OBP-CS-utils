const path = require('path')
const fs = require('fs')
const {getContext} = require('../test/testUtil')
const davidkhalaCertificatesJson = path.resolve(__dirname, '../../nodejs/test/artifacts/davidkhala-certificates.json')
describe('upload', function () {
    this.timeout(10000)
    console.debug(davidkhalaCertificatesJson)
    console.debug(fs.readFileSync(davidkhalaCertificatesJson, 'utf-8'))
    const context = getContext()
    context.orgName = 'founder' // Note: this is not your desired new added orgNames, but the founder
    it('certificates', async () => {
        const Upload = require('../organizations/upload')
        const upload = new Upload(context)

        await upload.certificateFiles(davidkhalaCertificatesJson)


    })
})