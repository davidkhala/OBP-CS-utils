const UserBuilder = require('khala-fabric-sdk-node-builder/user')
const path = require('path')
const fs = require('fs')
const {loadFrom} = require('khala-fabric-sdk-node/user')
const Client = require('khala-fabric-sdk-node-builder/client')
const ExportedPeers = require('../nodes')
const getAdmin_davidkhala_Client = () => {
    const mspConfigPath = path.resolve('test/crypto-config/peerOrganizations/davidkhala.com/users/Admin@davidkhala.com/msp')
    const mspId = 'davidkhala-com'
    const client = new Client()
    const user = loadFrom(mspConfigPath, 'Admin', mspId)
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

    const mspPath = path.resolve(__dirname, 'crypto-config', 'peerOrganizations', 'davidkhala.com', 'msp')
    const mspID = 'davidkhala-com'
    const exportedPeers = new ExportedPeers(mspPath, mspID)
    exportedPeers.addPeer({
        host: 'peer0.davidkhala.com',
        port: 7779,
    })
    return exportedPeers.getPeers()
}
const getPeers_founder = () => {
    const PeerManager = require('khala-fabric-sdk-node-builder/peer')
    const {certs: {tlscacert}} = require('../../nodejs/test/artifacts/founder-certificates.json')
    const {peers: _peers} = require('../../nodejs/test/artifacts/founder-nodes.json')

    return _peers.map(({url}) => {
        const [host, peerPort] = url.split('//')[1].split(':')
        return new PeerManager({host, peerPort, pem: tlscacert})
    })

}
module.exports = {
    getAdmin_founder_Client,
    getAdmin_davidkhala_Client,
    getPeers_davidkhala,
    getPeers_founder,
}