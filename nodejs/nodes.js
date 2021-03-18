const BaseClass = require('./common')

class ExportedNodes extends BaseClass {
    constructor(mspPath, mspID, logger) {
        super(mspPath, mspID, logger)
        this.result = {
            peers: [],
            tlscacert: this.searchCert('tlscacert'),
        }
    }

    addPeer({host, port, displayName = `${host}:${port}`}) {
        const {mspID} = this
        this.result.peers.push({
            displayName,
            address: `grpcs://${host}:${port}`,
            type: "Peer",
            mspID,
        })
    }
}

module.exports = ExportedNodes