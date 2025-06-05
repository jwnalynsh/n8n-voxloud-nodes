import {
	INodeTypeDescription,
	INodeType,
	INodeTypeBaseDescription,
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import { contactOperations, contactFields } from './ContactDescription';
import { voxloudApiRequest } from './GenericFunctions';
import { userFields, userOperations } from './UserDescription';
export class VoxloudV1 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			group: ['output'],
			version: 1,
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			defaults: {
				name: 'Voxloud',
			},
			inputs: [NodeConnectionType.Main],
			outputs: [NodeConnectionType.Main],
			credentials: [
				{
					name: 'voxloudApi',
					required: true,
					displayOptions: {
						show: {
							authentication: ['apiKey'],
						},
					},
				},
			],
			properties: [
				{
					displayName: 'Authentication',
					name: 'authentication',
					type: 'options',
					options: [
						{
							name: 'API Key',
							value: 'apiKey',
						},
					],
					default: 'apiKey',
				},
				{
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					noDataExpression: true,
					options: [
						{
							name: 'Contact',
							value: 'contact',
						},
						{
							name: 'User',
							value: 'user',
						},
					],
					default: 'contact',
				},
				// CONTACT ACTIONS
				...contactOperations,
				...contactFields,
				// USER ACTIONS
				...userOperations,
				...userFields,
			],
		};
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		// const length = items.length;

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			let responseData;

			if (resource === 'contact') {
				if (operation === 'get') {
					const contactId = this.getNodeParameter('contactId', i) as string;
					const endpoint = `/contacts/${contactId}`;
					responseData = await voxloudApiRequest.call(this, 'GET', endpoint, {});
				} else if (operation === 'search') {
					const qs: Record<string, string> = {};
					qs.first_name = this.getNodeParameter('firstName', i, '') as string;
					qs.last_name = this.getNodeParameter('lastName', i, '') as string;
					qs.phone = this.getNodeParameter('phoneNumber', i, '') as string;
					qs.email = this.getNodeParameter('email', i, '') as string;
					qs.offset = this.getNodeParameter('offset', i, '') as string;
					qs.limit = this.getNodeParameter('limit', i, '') as string;
					const endpoint = '/contacts';
					responseData = await voxloudApiRequest.call(this, 'GET', endpoint, {}, qs);
				} else if (operation === 'create') {
					const body: Record<string, any> = {};
					body.first_name = this.getNodeParameter('firstName', i) as string;
					body.last_name = this.getNodeParameter('lastName', i) as string;
					body.primary_phone = this.getNodeParameter('primaryPhoneNumber', i) as string;
					body.phones = this.getNodeParameter('otherPhones', i, []) as string[];
					body.primary_email = this.getNodeParameter('primaryEmail', i) as string;
					body.emails = this.getNodeParameter('otherEmails', i, []) as string[];
					body.company_name = this.getNodeParameter('companyName', i, '') as string;
					body.job_title = this.getNodeParameter('jobTitle', i, '') as string;
					body.website = this.getNodeParameter('website', i, '') as string;
					body.crm_name = this.getNodeParameter('crmName', i, '') as string;
					body.crm_contact_url = this.getNodeParameter('crmContactUrl', i, '') as string;
					const endpoint = '/contacts';
					responseData = await voxloudApiRequest.call(this, 'POST', endpoint, body);
				} else if (operation === 'update') {
					const body: Record<string, any> = {};
					const contactId = this.getNodeParameter('contactId', i) as string;
					body.first_name = this.getNodeParameter('firstName', i) as string;
					body.last_name = this.getNodeParameter('lastName', i) as string;
					body.primary_phone = this.getNodeParameter('primaryPhoneNumber', i) as string;
					body.phones = this.getNodeParameter('otherPhones', i, []) as string[];
					body.primary_email = this.getNodeParameter('primaryEmail', i) as string;
					body.emails = this.getNodeParameter('otherEmails', i, []) as string[];
					body.company_name = this.getNodeParameter('companyName', i, '') as string;
					body.job_title = this.getNodeParameter('jobTitle', i, '') as string;
					body.website = this.getNodeParameter('website', i, '') as string;
					body.crm_name = this.getNodeParameter('crmName', i, '') as string;
					body.crm_contact_url = this.getNodeParameter('crmContactUrl', i, '') as string;
					const endpoint = `/contacts/${contactId}`;
					responseData = await voxloudApiRequest.call(this, 'PUT', endpoint, body);
				} else if (operation === 'delete') {
					const contactId = this.getNodeParameter('contactId', i) as string;
					const endpoint = `/contacts/${contactId}`;
					responseData = await voxloudApiRequest.call(this, 'DELETE', endpoint, {});
				}
			} else if (resource === 'user') {
				if (operation === 'getMany') {
					const uri = 'https://developer.voxloud.com/api/v2/users'; // API Version 2 endpoint for users
					const getManyResp = await voxloudApiRequest.call(this, 'GET', '', {}, {}, uri);
					const items = Array.isArray(getManyResp) ? getManyResp : (getManyResp?.results ?? []);
					for (const item of items) {
						returnData.push({ json: item });
					}
					continue; // skip push because already done
				}
			}

			returnData.push({ json: responseData });
		}

		return this.prepareOutputData(returnData);
	}
}
