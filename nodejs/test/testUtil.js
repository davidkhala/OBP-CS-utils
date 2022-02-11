import UserBuilder from 'khala-fabric-sdk-node-builder/user'
import path from 'path'
import fs from 'fs'
import Client from 'khala-fabric-sdk-node-builder/client'
import {findKeyFiles} from 'khala-fabric-formatter/path'
import ExportedPeers from '../peers.js'
import PeerManager from 'khala-fabric-sdk-node-builder/peer'
import {certs as founderCerts} from '../../nodejs/test/artifacts/founder-certificates.json'
import {certs as davidCerts} from '../../nodejs/test/artifacts/davidkhala-certificates.json'
import {peers as _peers} from '../../nodejs/test/artifacts/founder-nodes.json'

const {tlscacert: davidTLSCert, admincert: davidAdminCerts} = davidCerts
const {tlsCACert: founderTlsCACert} = founderCerts

export const getAdmin_davidkhala_Client = () => {

    const mspId = 'davidkhala-com'
    const client = new Client()
    const builder = new UserBuilder({name: 'Admin'});
    const keystore = findKeyFiles(path.resolve('test/crypto-config/peerOrganizations/davidkhala.com/users/Admin@davidkhala.com/msp/keystore'))[0];


    const user = builder.build({
        key: fs.readFileSync(keystore),
        certificate: davidAdminCerts,
        mspId
    })
    client.setUser(user)
    return client.client
}
export const getAdmin_founder_Client = () => {
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
export const getPeers_davidkhala = () => {

    const mspID = 'davidkhala-com'
    const exportedPeers = new ExportedPeers({tlscacert: davidTLSCert}, mspID)
    exportedPeers.addPeer({
        host: 'peer0.davidkhala.com',
        port: 7779,
    })
    return exportedPeers.getPeers()
}
export const getPeers_founder = () => {

    return _peers.map(({url}) => {
        const [host, peerPort] = url.split('//')[1].split(':')
        return new PeerManager({host, peerPort, pem: founderTlsCACert})
    })

}
