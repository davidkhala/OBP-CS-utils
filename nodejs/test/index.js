describe('certificate json', () => {
    const fs = require('fs')
    const CertGen = require('../certificatesBundle')
    const path = require('path')
    it('green case', () => {
        const mspPath = path.resolve(__dirname, 'crypto-config', 'ordererOrganizations', 'hyperledger', 'msp')
        const mspID = 'hyperledgerMSP'
        const certGen = new CertGen(mspPath, mspID)
        const inlineResult = certGen.organization()
        console.log(inlineResult)
        certGen.organization('abc.json')
        fs.unlinkSync('abc.json')
    })

})