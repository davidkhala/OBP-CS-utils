import path from 'path'
import fs from 'fs'
import {loadFrom} from 'khala-fabric-sdk-node/user'
import Client from 'khala-fabric-sdk-node-builder/client'
import {transactionProposal} from 'khala-fabric-sdk-node-builder/transaction'
import {getPayloads, transientMapTransform} from 'khala-fabric-formatter/txProposal'
import {invoke} from 'khala-fabric-sdk-node/chaincodeHelper'
import Eventhub from 'khala-fabric-sdk-node-builder/eventHub'
import {FromOrdererSettings} from '../orderer.js'
import {
	getAdmin_davidkhala_Client,
	getAdmin_founder_Client,
	getPeers_founder,
	getPeers_davidkhala
} from './testUtil.js'
import ChannelManager from 'khala-fabric-sdk-node-builder/channel'
import Orderers from '../orderer'

import {consoleLogger} from '@davidkhala/logger/log4.js'
import {join} from 'khala-fabric-sdk-node/channel'
import Channel from 'khala-fabric-sdk-node-builder/channel'
import {getChannelConfigReadable} from 'khala-fabric-sdk-node/channelConfig'

const channelName = process.env.channel || 'default'
const logger = consoleLogger('interoperation')

describe('join channel', function () {
	this.timeout(0);

	const settingsJSON = path.resolve('test/artifacts/founder-orderer-settings.json')


	const orderers = Orderers.FromOrdererSettings(settingsJSON)
	const {orderer} = orderers[0]
	it('', async () => {
		const peers = getPeers_davidkhala()

		const mspConfigPath = path.resolve('test/crypto-config/peerOrganizations/davidkhala.com/users/Admin@davidkhala.com/msp')
		const mspId = 'davidkhala-com'
		const client = new Client()
		const user = loadFrom(mspConfigPath, 'Admin', mspId)
		client.setUser(user)

		const {channel} = new Channel({channelName, client: client.client})
		for (const {peer} of peers) {
			await join(channel, peer, undefined, orderer)
		}

	})
	const {channelJoined} = require('khala-fabric-sdk-node/query')
	it('channelJoined', async () => {
		const peers = getPeers_davidkhala()
		const {peer} = peers[0]


		const client = getAdmin_davidkhala_Client()

		const result = await channelJoined(peer, client)
		logger.info(result)
	})
})

describe('Chaincode transaction', function () {
	this.timeout(0)

	const chaincodeId = 'diagnose'
	const query = async (fcn) => {
		const client = getAdmin_davidkhala_Client();
		const peers_david = getPeers_davidkhala()
		const peers_founder = getPeers_founder()

		const peers = peers_david.map(({peer}) => peer).concat(peers_founder.map(({peer}) => peer))

		const rawResult = await transactionProposal(client, peers, channelName, {chaincodeId, fcn, args: []})
		const result = getPayloads(rawResult)
		console.info(result)
		return result
	}
	it('query:whoami', async () => {
		const fcn = 'whoami'
		await query(fcn)
	})
	it('query: external', async () => {
		const fcn = 'external'
		await query(fcn)
	})
	it('invoke private', async () => {
		const client = getAdmin_davidkhala_Client();
		const peers_david = getPeers_davidkhala()
		const peers_founder = getPeers_founder()
		const peers = peers_david.map(({peer}) => peer).concat(peers_founder.map(({peer}) => peer))

		const fcn = 'putPrivate'
		const transientMap = transientMapTransform({key: "value1"})

		const {channel} = new ChannelManager({channelName, client})
		const eventHubs = peers.map(peer => new Eventhub(channel, peer));
		for (const eventHub of eventHubs) {
			await eventHub.connect();
		}

		const orderers = FromOrdererSettings(path.resolve('test/artifacts/founder-orderer-settings.json')).map(({orderer}) => orderer)
		const orderer = orderers[0]


		await invoke(client, channelName, peers, eventHubs, {chaincodeId, fcn, args: [], transientMap}, orderer)

	})
	it('query private', async () => {
		const client = getAdmin_davidkhala_Client();
		const peers_david = getPeers_davidkhala()
		const peers_founder = getPeers_founder()
		const peers = peers_david.map(({peer}) => peer).concat(peers_founder.map(({peer}) => peer))

		const fcn = 'getPrivate'
		const transientMap = {key: ""}

		const rawResult = await transactionProposal(client, peers, channelName, {
			chaincodeId,
			fcn,
			args: [],
			transientMap
		})
		const result = getPayloads(rawResult)
		console.info(result)

	})

})
describe('fetch block', function () {
	this.timeout(0)
	process.env.binPath = path.resolve(__dirname, `bin-${process.platform}`)


	it('latest config from peer', async () => {
		const client = getAdmin_davidkhala_Client();
		const {channel} = new ChannelManager({channelName, client})
		const peers_david = getPeers_davidkhala()
		const {peer} = peers_david[0]

		const {configJSON} = await getChannelConfigReadable(channel, {peer})
		fs.writeFileSync(`${channelName}.json`, configJSON)

	})
	it('latest config from orderer', async () => {
		const client = getAdmin_founder_Client();
		const {channel} = new ChannelManager({channelName, client})
		const orderers = Orderers.FromOrdererSettings(path.resolve('test/artifacts/founder-orderer-settings.json'))
		const {orderer} = orderers[0]
		const {configJSON} = await getChannelConfigReadable(channel, {orderer})
		fs.writeFileSync(`${channelName}.json`, configJSON)
	})
})
