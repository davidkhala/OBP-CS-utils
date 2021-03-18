#!/usr/bin/env node
const Certificates = require("../certificates")
const Nodes = require("../nodes")
const {mspID, mspDir = process.cwd()} = process.env
if (!mspID) {
    console.warn("mspID not found in process.env")
}
switch (process.argv[2]) {
    case "certificate":
        // <command> certificate <file.json>
        const certificates = new Certificates(mspDir, mspID)
        certificates.build(process.argv[3])

        break;
    case 'peer':
        // peers=peer0:7051;peer1:7051 <command> peer <file.json>
        const nodes  = new Nodes(mspDir,mspID)
        const peers = process.env.peers.split(";")
        for (const peer of peers){
            const [host,port] = peer.split(':');
            nodes.addPeer({host,port})
        }
        nodes.build(process.argv[3])

        break;
    default:
        console.error("no instruction received")
}