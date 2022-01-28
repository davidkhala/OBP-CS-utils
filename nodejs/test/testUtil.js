const UserBuilder = require('khala-fabric-sdk-node-builder/user')
const path = require('path')
const fs = require('fs')
const Client = require('khala-fabric-sdk-node-builder/client')
const {findKeyFiles} = require('khala-fabric-formatter/path')
const ExportedPeers = require('../peers')
const getAdmin_davidkhala_Client = () => {

    const mspId = 'davidkhala-com'
    const client = new Client()
    const builder = new UserBuilder({name: 'Admin'});
    const keystore = findKeyFiles(path.resolve('test/crypto-config/peerOrganizations/davidkhala.com/users/Admin@davidkhala.com/msp/keystore'))[0];
    const {certs: {admincert}} = require('../../nodejs/test/artifacts/davidkhala-certificates.json')

    const user = builder.build({
        key: fs.readFileSync(keystore),
        certificate: admincert,
        mspId
    })
    client.setUser(user)
    return client.client
}
const getAdmin_founder_Client = () => {
    const builder = new UserBuilder({name: 'Admin'});
    const mspId = 'founder'
    const keystore = path.resolve('test/artifacts/founder-admin-credential/founder-key');
    const signcert = path.resolve('test/artifacts/founder-admin-credential/founder-cert.pem')
    const user = builder.build({
        key: fs.readFileSync(keystore),
        certificate: fs.readFileSync(signcert),
        mspId
    });

    const client = new Client()
    client.setUser(user)
    return client.client
}
const getPeers_davidkhala = () => {

    const {certs: {tlscacert}} = require('../../nodejs/test/artifacts/davidkhala-certificates.json')

    const mspID = 'davidkhala-com'
    const exportedPeers = new ExportedPeers({tlscacert}, mspID)
    exportedPeers.addPeer({
        host: 'peer0.davidkhala.com',
        port: 7779,
    })
    return exportedPeers.getPeers()
}
const getPeers_founder = () => {
    const PeerManager = require('khala-fabric-sdk-node-builder/peer')
    const {certs: {tlsCACert}} = require('../../nodejs/test/artifacts/founder-certificates.json')
    const {peers: _peers} = require('../../nodejs/test/artifacts/founder-nodes.json')

    return _peers.map(({url}) => {
        const [host, peerPort] = url.split('//')[1].split(':')
        return new PeerManager({host, peerPort, pem: tlsCACert})
    })

}
module.exports = {
    getAdmin_founder_Client,
    getAdmin_davidkhala_Client,
    getPeers_davidkhala,
    getPeers_founder,
}