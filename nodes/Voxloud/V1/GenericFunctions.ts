import {
	type IHookFunctions,
	type IExecuteFunctions,
	type ILoadOptionsFunctions,
	type IHttpRequestMethods,
	type IDataObject,
	type IRequestOptions,
	NodeApiError,
	JsonObject,
} from 'n8n-workflow';

export async function voxloudApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,

	body: any = {},
	query: IDataObject = {},
	uri?: string,
): Promise<any> {
	let authenticationMethod = this.getNodeParameter('authentication', 0);
	const options = {
		method,
		qs: query,
		headers: {},
		uri: uri || `https://developer.voxloud.com/api/v1${endpoint}`,
		body,
		json: true,
		useQuerystring: true,
	} satisfies IRequestOptions;

	try {
		if (this.logger) {
			this.logger.info(`voxloudAPICALL with: ${JSON.stringify(options)}`);
			this.logger.info(`voxloudAPICALL authenticationMethod: ${authenticationMethod}`);
		}
		if (authenticationMethod === 'apiKey') {
			const credentialType = 'voxloudApi';
			return await this.helpers.requestWithAuthentication.call(this, credentialType, options);
		}
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
