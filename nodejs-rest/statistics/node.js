const {SupportedMethod: {GET}} = require('../constants')
const {Statistics} = require('./index')

class Node extends Statistics {

    async health() {
        return this._get('nodeHealth')
    }
}

module.exports = Node
