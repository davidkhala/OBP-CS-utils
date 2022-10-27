import {getContext} from './testUtil.js';
import {Version} from '../application/index.js';

describe('test Context', function () {
	this.timeout(0);
	it('version', async () => {

		const context = getContext();
		const version = new Version(context);
		version.debug = true;
		await version.ofRestAPI();

		await version.ofFabricComponents();
	});
	it('login with another user', async () => {
		process.env.IDCS_ID = 'david-khala@hotmail.com';
		const context = getContext();
		const version = new Version(context);
		await version.ofRestAPI();
	});
});
