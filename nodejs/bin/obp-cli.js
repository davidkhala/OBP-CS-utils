#!/usr/bin/env node
const Certificates = require("../certificates")
const {execSync} = require('child_process')

switch (process.argv[2]) {

    case "export":
        const {mspID, mspDir = process.cwd()} = process.env
        if (!mspID) {
            console.warn("mspID not found in process.env")
        }
        switch (process.argv[3]) {
            case "certificate":
                // <command> export certificate <file.json>
                const certificates = new Certificates(mspDir, mspID)
                certificates.build(process.argv[4])

                break;
            default:
                console.error("no export type received")
        }
        break;
    case 'view':
        switch (process.argv[3]) {
            case 'serial':
                // <command> view serial cert.pem
                const cert = process.argv[4];
                const result = execSync(`openssl x509 -noout -serial -in ${cert}`)
                const serial = result.toString('utf8').split("=")[1].trim()
                console.info(serial)
                break;
            default:
                console.error("no view target received")
        }

        break;


    default:
        console.error("no instruction received")
}