import assert from 'assert'
import {DefaultAzureCredential} from '@azure/identity';
import {Key as AzureKey, Cryptography} from '@davidkhala/azure-key-vault';

describe('azure', function () {
	this.timeout(0);
	it('Signed by Azure Vault', async () => {
		const vaultName = 'davidkhala-vault';
		const keyName = 'EC';

		const configFileCredential = new DefaultAzureCredential();
		const keyOpt = new AzureKey(vaultName, configFileCredential);
		console.warn(new Date());
		//2022-08-17T07:26:52.921Z
		const x = Buffer.from([38, 23, 80, 0xf2, 0xf9, 0xc6, 89, 0x8d, 0xe0, 23, 0xf3, 46, 83, 97, 0xb6, 0xc4, 94, 22, 0xfd, 43, 0x04, 0xe1, 0xd4, 29, 0xb8, 0xe4, 0xd7, 0xb7, 88, 0xeb, 0xae, 0x4b]);
		const y = Buffer.from([0xd3, 58, 0xb7, 0x1c, 0xc3, 0xdf, 0x06, 0xa9, 31, 99, 81, 0x0c, 0xb4, 0xf4, 60, 28, 59, 85, 0xb2, 0xfc, 0xb9, 88, 0x5e, 74, 43, 0xed, 0x6b, 57, 0x5d, 64, 70, 75]);
		const keyInfo = {
			key: {
				kid: 'https://davidkhala-vault.vault.azure.net/keys/EC/a4e55ebe5b3f4cd293a7f096bbe70ddd',
				kty: 'EC',
				keyOps: ['sign', 'verify'],
				crv: 'P-256',
				x,
				y,
			},
			id: 'https://davidkhala-vault.vault.azure.net/keys/EC/a4e55ebe5b3f4cd293a7f096bbe70ddd',
			name: 'EC',
			keyOperations: ['sign', 'verify'],
			keyType: 'EC',
			properties: {
				tags: undefined,
				enabled: true,
				notBefore: undefined,
				expiresOn: undefined,
				createdOn: '2022-08-16T10:29:41.000Z',
				updatedOn: '2022-08-16T10:29:41.000Z',
				recoverableDays: 7,
				recoveryLevel: 'CustomizedRecoverable+Purgeable',
				exportable: false,
				releasePolicy: undefined,
				vaultUrl: 'https://davidkhala-vault.vault.azure.net',
				version: 'a4e55ebe5b3f4cd293a7f096bbe70ddd',
				name: 'EC',
				managed: undefined,
				id: 'https://davidkhala-vault.vault.azure.net/keys/EC/a4e55ebe5b3f4cd293a7f096bbe70ddd'
			}
		};
		const keyCrypto = new Cryptography(keyInfo, configFileCredential)


		const message = 'My data';
		const signature = await keyCrypto.sign(message);
		const isValid = await keyCrypto.verify(message, signature);
		assert.ok(isValid);
	});
});
