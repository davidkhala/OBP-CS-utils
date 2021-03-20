const fs = require('fs')

const OrdererManager = require('khala-fabric-sdk-node-builder/orderer')

class Orderer {

    constructor() {
        this.orderers = [];
    }

    fromOrdererSettings(jsonFile) {
        const {certs: {tlscacert}, orderingServiceNodes} = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'))
        this.orderers = orderingServiceNodes.map(({address}) => {
            const noprotocol = address.split('//')[1]
            const [host, ordererPort] = noprotocol.split(':')
            return new OrdererManager({host, ordererPort, pem: tlscacert})
        })
        return this;
    }

}
module.exports = Orderer
