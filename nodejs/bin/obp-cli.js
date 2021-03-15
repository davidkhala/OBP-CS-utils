#!/usr/bin/env node
const CertificatesBundle = require("../certificatesBundle.js")
switch (process.argv[2]) {
    case "certificate":
        // <command> certificate organization <file.json>
        const {mspID, mspDir = process.cwd()} = process.env
        if(!mspID){
            console.warn("mspID not found in process.env")
        }
        const certificatesBundle = new CertificatesBundle(mspDir, mspID)
        certificatesBundle[process.argv[3]](process.argv[4])

        break;
    default:
        console.error("no instruction received")
}