import path from "path";
import ProposalManager from 'khala-fabric-admin/proposal.js'
import {emptyChannel} from 'khala-fabric-admin/channel.js'
import {VaultIdentityContext} from '../fabric.js'

const enrollmentID = process.env.IDCS_ID
if (!enrollmentID) {
    throw Error('process.env.IDCS_ID not found')
}

const signCert = path.resolve(`test/artifacts/founder-user-credential/${enrollmentID}-cert.pem`)
describe('offline-signing', async () => {
    it('propose', () => {
        const certificate = 'TODO' // TODO
        const key = 'TODO' // TODO
        const mspid = 'founder'
        const identityContext = new VaultIdentityContext(certificate, key, mspid)
        const chaincodeId = 'TODO' // TODO
        const channelName = 'default'
        const peers = []
        const proposal = new ProposalManager(identityContext, peers, chaincodeId, emptyChannel(channelName))

    })
})