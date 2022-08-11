import SigningIdentity from 'fabric-common/lib/SigningIdentity.js';
import Signer from 'fabric-common/lib/Signer.js';
import Key from 'fabric-common/lib/Key.js';
import CryptoSuite from 'fabric-common/lib/CryptoSuite.js';
import IdentityContext from 'fabric-common/lib/IdentityContext.js';
import {ECDSAKey} from '@davidkhala/crypto/ECDSA.js';

export class VaultIdentityContext extends IdentityContext {
	/**
	 *
	 * @param {string} certificate
	 * @param {KeyOperator} key
	 * @param mspId
	 */
	constructor(certificate, key, mspId) {
		const vaultKey = new VaultKey(key);
		const identity = new VaultSigningIdentity(certificate, vaultKey, mspId);
		const user = new VaultFakeUser({
			name: key.keyId,
			mspid: mspId,
			identity,
		});
		const client = null;
		super(user, client);
	}
}

class VaultFakeUser {
	constructor({name, mspid, identity}) {
		Object.assign(this, {name, mspid, identity});
	}

	getName() {
		return this.name;
	}

	getMspid() {
		return this.mspid;
	}

	getIdentity() {
		return this.getSigningIdentity();
	}

	getSigningIdentity() {
		return this.identity;
	}
}


export class VaultSigningIdentity extends SigningIdentity {
	/**
	 * @param {string} certificate string for the PEM encoded certificate
	 * @param {VaultKey} key oci KMS, instead of raw publicKey
	 * @param {string} mspId The associated MSP's ID that manages this identity
	 */
	constructor(certificate, key, mspId) {
		const cryptoSuite = new VaultCryptoSuite();
		const signer = new VaultSigner(key);
		super(certificate, key, mspId, cryptoSuite, signer);

	}

	async sign(msg, opts) {
		return await this._signer.sign(msg, opts);
	}

}

export class VaultSigner extends Signer {
	/**
	 *
	 * @param {VaultKey} key
	 */
	constructor(key) {
		const cryptoSuite = new VaultCryptoSuite();
		super(cryptoSuite, key);
	}

	async sign(message, opts) {
		return await super.sign(message, opts);
	}

}

export class VaultCryptoSuite extends CryptoSuite {

	/**
	 *
	 * @param {KeyOperator} key
	 * @param message
	 * @param [opts]
	 * @returns {Promise<string>} base64 format signature
	 */
	async sign(key, message, opts = {}) {
		const {signingAlgorithm, keyVersionId} = opts;
		const signature_base64 = await key.sign(message, signingAlgorithm, keyVersionId);
		return signature_base64;
	}

	hash(msg, opts) {
		// hash done inside vault
		return msg;
	}

	async verify(key, signature, msg, opts = {}) {
		const {signingAlgorithm, keyVersionId} = opts;
		return await key.verify(signature, msg, signingAlgorithm, keyVersionId);
	}

}

export class VaultKey extends Key {
	/**
	 *
	 * @param {KeyOperator} key
	 */
	constructor(key) {
		super();
		this.key = key;

	}

	async getPublicKey() {
		const keyPEM = await this.key.publicKey();
		return ECDSAKey.FromPEM(keyPEM);
	}

}