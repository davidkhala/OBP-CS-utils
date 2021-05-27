const {
    getAdmin_davidkhala_Client,
    getAdmin_founder_Client,
    getPeers_founder,
    getPeers_davidkhala
} = require('../test/testUtil')

describe('deploy chaincode', () => {

    const chaincodeId = 'diagnose'
    const {install} = require('khala-fabric-sdk-node/chaincode')
    const {setGOPATH} = require('khala-fabric-sdk-node/golang')
    it('install to davidkhala.com', async function () {

        const chaincodePath = 'github.com/davidkhala/chaincode/golang/diagnose'
        const chaincodeVersion = 'v1'
        const peers_david = getPeers_davidkhala()
        this.timeout(60000 * peers_david.length)
        const client_david = getAdmin_davidkhala_Client();
        await setGOPATH()

        const results0 = await install([peers_david[0].peer], {
            chaincodeId,
            chaincodePath,
            chaincodeVersion
        }, client_david)
        console.debug('install towards davidkhala.com', results0)

    })
    it('install to founder', async function () {

        const chaincodePath = 'github.com/davidkhala/chaincode/golang/diagnose'
        const chaincodeVersion = 'v2'

        await setGOPATH()

        const peers_founder = getPeers_founder()
        this.timeout(120000 * peers_founder.length)
        const client_founder = getAdmin_founder_Client()

        const results1 = await install([peers_founder[0].peer], {
            chaincodeId,
            chaincodePath,
            chaincodeVersion
        }, client_founder)
        console.debug('install towards founder', results1)


    })


})