import assert from 'assert'
import {filedirname} from '@davidkhala/light/es6.mjs'
import {getContext} from './testUtil.js';
import Nodes from '../nodes/index.js';
import Peers from '../nodes/peers.js';
import {Enrollment, isRESTProxyId} from '../nodes/restProxy.js'

filedirname(import.meta)
describe('nodes', function () {
    this.timeout(0);
    const context = getContext();
    const nodes = new Nodes(context);
    it('list', async () => {
        const {peers, orderers, fabricCAs, RESTProxies} = await nodes.list();

        const result = {peers, orderers, fabricCAs, RESTProxies};
        console.debug(result)

    });

    const peers = new Peers(context);
    it('peers', async () => {
        const peerId = 'peer0';
        const channelName = 'default';
        const result = await peers.blockAudit(peerId, channelName);
        console.log(result);
    });
});
describe('restProxy', function () {
    this.timeout(0)
    const restProxyId = 'fbe5d273-4245-4b16-82f8-3c1adc56482c-restproxy'
    it('RESTProxyId sancheck', () => {
        assert.ok(isRESTProxyId(restProxyId))
        assert.ok(!isRESTProxyId('restproxy'))
    })
    const context = getContext();
    const enrollment = new Enrollment(restProxyId, context)
    enrollment.debug = true
    it('list enrollment', async () => {
        const r1 = await enrollment.list()
        console.info(r1)
        assert.ok(r1.includes('defaultuser'))
        const r2 = await enrollment.list(true)// TODO 404 status
        console.debug(r2)
    })
    it('link new user to to default enrollment', async () => {
        await enrollment.associate('defaultuser', 'davidkhala')
    })
    it('create enrollment', async () => {
        const enrollmentID = 'test'
        await enrollment.create(enrollmentID)

    })
    it('delete enrollment', async () => {
        const enrollmentID = 'test'
        await enrollment.delete(enrollmentID)
    })
})
