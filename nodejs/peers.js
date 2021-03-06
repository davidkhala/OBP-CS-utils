const BaseClass = require('./common')
const PeerManager = require('khala-fabric-sdk-node-builder/peer')

class PeerNodes extends BaseClass {

    constructor(mspPath, mspID, logger) {
        super(mspPath, mspID, logger)
        this.result = {
            peers: [],
            tlscacert: this.searchCert('tlscacert'),
        }
    }

    /**
     * @deprecated OBP API `Export Nodes (Deprecated in 20.3.1)`
     * @param jsonFile
     * @return {PeerManager[]}
     */
    static FromExportedNodes(jsonFile) {
        const fs = require('fs')
        const {tlscacert, peers} = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'))

        return peers.map(({address}) => {
            const [host, peerPort] = address.split('//')[1].split(':')
            return new PeerManager({host, peerPort, pem: tlscacert})
        })

    }

    /**
     *
     * @return {PeerManager[]}
     */
    getPeers() {
        return this.result.peers.map(({address}) => {
            const [host, peerPort] = address.split('//')[1].split(':')
            return new PeerManager({host, peerPort, pem: this.result.tlscacert})
        })
    }

    addPeer({host, port, displayName = `${host}:${port}`}) {
        const {mspID} = this
        this.result.peers.push({
            nodeName: host,
            displayName,
            address: `grpcs://${host}:${port}`,
            type: "Peer",
            mspID,
        })
    }
}

module.exports = PeerNodes