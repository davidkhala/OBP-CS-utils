const Chaincode = require('./index')

/**
 * @typedef {Object} UpgradeChaincodeHTTPBody
 * @property {string} channelName
 * @property {string} chaincodeVersion
 * @property {Object} [transientMap]
 * @property {{identities:Array,policy:Object}} [endorsementPolicy]
 * @property {string[]} [args]
 * @property {{name:string,policy:string,requiredPeerCount:number,maxPeerCount:number,blockToLive:number}} [dataCollectionConfig]
 * @property {string} [chaincodeType]
 * @property {Array<{url:string}>} peers
 * @property {boolean} [upgrade]
 */
/**
 *
 */
class Init extends Chaincode {

    // TODO WIP
    async upgrade({channelName, chaincodeVersion, peers}, {
        transientMap = {},
        endorsementPolicy = {
            "identities": [],
            "policy": {
                "0-of": []
            }
        },
        dataCollectionConfig = [],
        args = [],
        chaincodeType = "golang",
    } = {}, isInit) {
        // const body = {
        //     channelName,
        //     chaincodeVersion,
        //     peers, // peers TODO what should be a correct format
        //     args,
        //     transientMap,
        //     chaincodeType,
        //     upgrade: !isInit,
        //     dataCollectionConfig,
        // }
        const body ={
            "channelName":"default",
            "chaincodeVersion":"v1",
            "transientMap":{
            },
            "endorsementPolicy":{
                "identities":[
                ],
                "policy":{
                    "0-of":[
                    ]
                }
            },
            "args":[
                "a",
                "100",
                "b",
                "200"
            ],
            "dataCollectionConfig":[],
            "chaincodeType":"golang",
            "peers":[
                {
                    "url":"grpcs://founder-5-hktwlab-iad.blockchain.ocp.oraclecloud.com:20009"
                }
            ]
        }
        await this.http('instantiate', "POST", body)

    }
}

module.exports = Init