import {getContext} from './testUtil.js'
import App from '../application/index.js'
describe('test Context', function () {
    this.timeout(0)
    it('version', async () => {

        const context = getContext()
        await new App(context).version()

    })
})