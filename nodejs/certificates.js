const fs = require('fs');
const BaseClass = require('./common')

/**
 * @class Certificates certificate file Generator
 */
class Certificates extends BaseClass {

    constructor(mspPath, mspID, logger) {
        super(mspPath, mspID, logger);
        this.result = {
            mspID,
            type: "Participant",
            certs: {}
        }

        this.result.certs['admincert'] = this.searchCert('admincert')
        this.result.certs['cacert'] = this.searchCert('cacert')
        this.result.certs['tlscacert'] = this.searchCert('tlscacert')

    }
    
}


module.exports = Certificates