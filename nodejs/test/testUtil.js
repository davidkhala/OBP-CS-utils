const UserBuilder = require('khala-fabric-sdk-node-builder/user')
const path = require('path')
const fs = require('fs')
const {loadFrom} = require('khala-fabric-sdk-node/user')
const Client = require('khala-fabric-sdk-node-builder/client')
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
module.exports = {
    getAdmin_founder_Client,
    getAdmin_davidkhala_Client,
}