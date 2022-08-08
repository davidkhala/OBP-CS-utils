import CAService from 'khala-fabric-admin/ca.js'
import AffiliationService from 'khala-fabric-sdk-node/affiliationService.js';
import IdentityService from 'khala-fabric-sdk-node/identityService.js'
import {ECDSA_PrvKey} from 'khala-fabric-formatter/key.js'
import UserBuilder from 'khala-fabric-admin/user.js'
import {ping} from 'khala-fabric-sdk-node/ca.js'
import {Key, Vault} from '@davidkhala/oci-key-vault/index.js'
import {FileAuthentication} from '@davidkhala/oci-common/index.js'
import {ECDSAKey} from "@davidkhala/crypto/ECDSA.js";
import X500Name from "@davidkhala/crypto/X500Name.js";
import {Extension} from "@davidkhala/crypto/extension.js";
import {CSR} from '@davidkhala/crypto/pkcs10.js'
import fs from 'fs'
import path from 'path'
import assert from 'assert'

const auth = new FileAuthentication()
const enrollmentID = process.env.IDCS_ID
if (!enrollmentID) {
    throw Error('process.env.IDCS_ID not found')
}
const enrollmentSecret = process.env.IDCS_PASSWORD
if (!enrollmentSecret) {
    throw  Error('process.env.IDCS_PASSWORD not found')
}
const keystore = path.resolve(`test/artifacts/founder-user-credential/priv_sk`)
const signcert = path.resolve(`test/artifacts/founder-user-credential/${enrollmentID}-cert.pem`)
const getUser = () => {
    const userBuilder = new UserBuilder({name: enrollmentID})
    return userBuilder.build({
        key: fs.readFileSync(keystore),
        certificate: fs.readFileSync(signcert),
        mspId: 'founder'
    });
}
describe('ca', function () {
    this.timeout(0)
    const protocol = 'https'
    const hostname = 'founder-2-hktwlab-sin.blockchain.ocp.oraclecloud.com'
    const port = 7443
    const caUrl = `${protocol}://${hostname}:${port}/`
    const caService = new CAService({protocol, port, hostname, timeout: 10000})


    it('http ping', async () => {

        const result = await ping(caUrl)
        console.info(result)
        assert.strictEqual(result.Version, '1.4.4')

    })


    it('enroll: required Oracle IDCS credential', async () => {
        const {certificate, rootCertificate, key} = await caService.enroll({enrollmentID, enrollmentSecret});
        console.info({certificate})
        console.info({rootCertificate})
        const ecdsaKey = new ECDSA_PrvKey(key)

        ecdsaKey.toKeystore(path.dirname(keystore))

        fs.writeFileSync(signcert, certificate)
    })
    it('enroll: with CSR', async () => {
        const vaultId = 'ocid1.vault.oc1.ap-singapore-1.enrhpwtoaabem.abzwsljrk57oclvejakgkh42rblwi7dmymmhnfrmt7nmloagt24mcrpl236q'
        const vault = new Vault(auth)
        const health = await auth.connect()
        assert.ok(health)
        const oneVault = await vault.get(vaultId)

        const keyID = 'ocid1.key.oc1.ap-singapore-1.enrhpwtoaabem.abzwsljrizggn5jlznyv7j64ccchehu6wc6vmfllyobilups4ahhp34pzyqq'
        const key = new Key(auth, oneVault)
        const keyPEM = await key.publicKeyOf(keyID)

        const publicKey = ECDSAKey.FromPEM(keyPEM);
        const subject = new X500Name();
        subject.setCountryName('HK');
        subject.setOrganizationName('Oracle');
        subject.setOrgUnitName('Cloud Platform');
        subject.setCommonName(enrollmentID);
        const extensions = Extension.asSAN(['*.hyperledger.org']);

        const csr = new CSR({subject, pubKeyObj: publicKey.pubKeyObj, extensions});

        const unsignedHex = csr.getUnsignedHex();
        const message = Buffer.from(unsignedHex, 'hex')
        const signature_base64 = await key.sign(keyID, message)
        console.info(signature_base64);
        const sig_hex = Buffer.from(signature_base64, 'base64').toString('hex')
        const signatureAlgorithm = 'SHA256withECDSA'
        const pem = csr.toPemWithSignature(sig_hex, signatureAlgorithm)
        console.info(pem)

        const {certificate, rootCertificate} = await caService.enroll({enrollmentID, enrollmentSecret, csr:pem});
        console.info({certificate})
        console.info({rootCertificate})

        fs.writeFileSync(signcert, certificate)
    })


    it('list affiliation: Not supported', async () => {

        const user = getUser()
        const {affiliationService} = new AffiliationService(caService);
        try {
            await affiliationService.getAll(user)
        } catch (e) {
            // Failed to get affiliation: Not supported
            assert.strictEqual(`fabric-ca request affiliations failed with errors [[{"code":49,"message":"Failed to get affiliation: Not supported"}]]`, e.message)
        }


    })
    it('list id: Not supported', async () => {
        const user = getUser()
        const idService = new IdentityService(caService);
        try {
            await idService.getAll(user);
        } catch (e) {
            assert.strictEqual(`fabric-ca request identities?ca=founderca failed with errors [[{"code":49,"message":"Failed to get users by affiliation and type: Not supported"}]]`, e.message)
        }
    })
})

