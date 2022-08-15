import path from 'path';
import fs from 'fs';
import {loadFromLocal} from 'khala-fabric-sdk-node/user.js';
import Transaction from 'khala-fabric-sdk-node/transaction.js';
import {getResponses} from 'khala-fabric-formatter/proposalResponse.js';
import {transientMapTransform} from 'khala-fabric-formatter/txProposal.js';
import Eventhub from 'khala-fabric-admin/eventHub.js';
import Orderers from '../orderer.js';
import {getAdmin_davidkhala_user, getAdmin_founder_user, getPeers_founder, getPeers_davidkhala} from './testUtil.js';


import {consoleLogger} from '@davidkhala/logger/log4.js';
import QueryHub from 'khala-fabric-sdk-node/query.js';
import {emptyChannel} from 'khala-fabric-admin/channel.js';
import {ChannelConfig} from 'khala-fabric-sdk-node/channelConfig.js';

const channelName = process.env.channel || 'default';
const logger = consoleLogger('interoperation');

describe('join channel', function () {
	this.timeout(0);

	const settingsJSON = path.resolve('test/artifacts/founder-orderer-settings.json');


	const orderers = Orderers.FromOrdererSettings(settingsJSON);
	const {orderer} = orderers[0];
	it('', async () => {
		const peers = getPeers_davidkhala();

		const mspConfigPath = path.resolve('test/crypto-config/peerOrganizations/davidkhala.com/users/Admin@davidkhala.com/msp');
		const mspId = 'davidkhala-com';
		const user = loadFromLocal(mspConfigPath, 'Admin', mspId);

		const channel = emptyChannel(channelName);

		for (const {peer} of peers) {
			const query = new QueryHub([peer], user);
			await query.joinWithFetch(channel, orderer, user);
		}

	});

	it('channelJoined', async () => {
		const peers = getPeers_davidkhala();
		const {peer} = peers[0];


		const user = getAdmin_davidkhala_user();
		const query = new QueryHub([peer], user);
		const result = await query.channelJoined();
		logger.info(result);
	});
});

describe('Chaincode transaction', function () {
	this.timeout(0);

	const chaincodeId = 'diagnose';
	const query = async (fcn) => {
		const user = getAdmin_davidkhala_user();
		const peers_david = getPeers_davidkhala();
		const peers_founder = getPeers_founder();

		const peers = peers_david.map(({peer}) => peer).concat(peers_founder.map(({peer}) => peer));

		const channnel = emptyChannel(channelName);
		const transactionProposal = new Transaction(peers, user, channnel, chaincodeId);
		const rawResult = await transactionProposal.evaluate({fcn, args: []});
		const result = getResponses(rawResult);
		console.info(result);
		return result;
	};
	it('query:whoami', async () => {
		const fcn = 'whoami';
		await query(fcn);
	});
	it('query: external', async () => {
		const fcn = 'external';
		await query(fcn);
	});
	it('invoke private', async () => {
		const user = getAdmin_davidkhala_user();
		const peers_david = getPeers_davidkhala();
		const peers_founder = getPeers_founder();
		const peers = peers_david.map(({peer}) => peer).concat(peers_founder.map(({peer}) => peer));

		const fcn = 'putPrivate';
		const transientMap = transientMapTransform({key: 'value1'});

		const channel = emptyChannel(channelName);

		const eventHubs = peers.map(peer => new Eventhub(channel, peer.eventer));
		for (const eventHub of eventHubs) {
			await eventHub.connect();
		}

		const orderers = Orderers.FromOrdererSettings(path.resolve('test/artifacts/founder-orderer-settings.json')).map(({orderer}) => orderer);
		const orderer = orderers[0];

		const tx = new Transaction(peers, user, channel, chaincodeId);
		await tx.submit({fcn, args: [], transientMap}, orderer);

	});
	it('query private', async () => {
		const user = getAdmin_davidkhala_user();
		const peers_david = getPeers_davidkhala();
		const peers_founder = getPeers_founder();
		const peers = peers_david.map(({peer}) => peer).concat(peers_founder.map(({peer}) => peer));

		const fcn = 'getPrivate';
		const transientMap = {key: ''};

		const channel = emptyChannel(channelName);
		const transactionProposal = new Transaction(peers, user, channel, chaincodeId);
		const rawResult = await transactionProposal.evaluate({
			fcn,
			args: [],
			transientMap
		});
		const result = getResponses(rawResult);
		console.info(result);

	});

});
describe('fetch block', function () {
	this.timeout(0);
	process.env.binPath = path.resolve(__dirname, `bin-${process.platform}`);

	it('latest config from orderer', async () => {
		const user = getAdmin_founder_user();
		const orderers = Orderers.FromOrdererSettings(path.resolve('test/artifacts/founder-orderer-settings.json'));
		const {orderer} = orderers[0];
		const config = new ChannelConfig(channelName, user, orderer);
		const {json} = await config.getChannelConfigReadable();
		fs.writeFileSync(`${channelName}.json`, json);
	});
});
