const BaseClass = require('./common')

class ExportedNodes extends BaseClass {
    constructor(mspPath, mspID, logger) {
        super(mspPath, mspID, logger)
        this.result = {
            peers: [],
            tlscacert: this.searchCert('tlscacert'),
        }
    }

    static FromExportedNodes(jsonFile) {
        const fs = require('fs')
        const Peer = require('khala-fabric-sdk-node-builder/peer')
        const {tlscacert, peers} = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'))

        return peers.map(({address})=>{
            const [host,peerPort] = address.split('//')[1].split(':')
            return new Peer({host, peerPort, pem: tlscacert})
        })

    }

    addPeer({host, port, displayName = `${host}:${port}`}) {
        const {mspID} = this
        this.result.peers.push({
            nodeName:host,
            displayName,
            address: `grpcs://${host}:${port}`,
            type: "Peer",
            mspID,
        })
    }
}

module.exports = ExportedNodes