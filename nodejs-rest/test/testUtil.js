import {ConnectionContext, Route} from '../index.js'

const {FromDomain} = Route
export const getContext = () => {
	const username = process.env.IDCS_ID
	const password = process.env.IDCS_PASSWORD

	const route = FromDomain('founder2-hktwlab-icn.blockchain.ocp.oraclecloud.com')
	return new ConnectionContext({username, password, route})
}
export const getParticipantContext = () => {
	const username = process.env.IDCS_ID
	const password = process.env.IDCS_PASSWORD
	const route = FromDomain('participant-2-hktwlab-icn.blockchain.ocp.oraclecloud.com')
	return new ConnectionContext({username, password, route})
}