describe('json generator', () => {
    const fs = require('fs')

    const path = require('path')
    it('orderer org certificates', () => {
        const CertGen = require('../certificates')
        const mspPath = path.resolve(__dirname, 'crypto-config', 'ordererOrganizations', 'hyperledger', 'msp')
        const mspID = 'hyperledgerMSP'
        const certGen = new CertGen(mspPath, mspID)

        console.log(certGen.result)
        certGen.build('abc.json')
        fs.unlinkSync('abc.json')
    })
    it('exported peers', () => {
        const ExportedPeers = require('../nodes')
        const mspPath = path.resolve(__dirname, 'crypto-config', 'peerOrganizations', 'davidkhala.com', 'msp')
        const mspID = 'davidkhala-com'
        const exportedPeers = new ExportedPeers(mspPath, mspID)
        exportedPeers.addPeer({
            host: 'peer0.davidkhala.com',
            port: 7779,

        })

        exportedPeers.build('exportedPeers.json')
        fs.unlinkSync('exportedPeers.json')
    })
})