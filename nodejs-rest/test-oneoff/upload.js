import path from 'path'
import fs from 'fs'
import {getContext} from '../test/testUtil.js'

import Upload from '../organizations/upload.js'
describe('upload', function () {
    this.timeout(0)

    const context = getContext()

    it('certificates: davidkhala', async () => {
        const upload = new Upload(context, 'davidkhala-com')
        //TODO all field is required
        const davidkhalaCertificatesJson = path.resolve(__dirname, '../../nodejs/test/artifacts/davidkhala-certificates.json')
        console.debug(fs.readFileSync(davidkhalaCertificatesJson, 'utf-8'))
        await upload.certificateFile(davidkhalaCertificatesJson)
    })
    it('certificates: participant', async () => {

        const upload = new Upload(context, 'participant')
        const orgInfoFile = path.resolve(__dirname, '../../nodejs/test/artifacts/participant-certificates.json')
        await upload.certificateFile(orgInfoFile)
    })
})