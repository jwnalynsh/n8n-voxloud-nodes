import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class GetAContact implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Get A Contact',
		name: 'getAContact',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get a contact from Voxloud',
		defaults: {
			name: 'Get a Voxloud Contact',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'VoxloudApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://developer.voxloud.com/api/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get a Contact',
						value: 'getContactResource',
					},
				],
				default: 'getContactResource',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['getContactResource'],
					},
				},
				options: [
					{
						name: 'Get Contact',
						value: 'getContactOperation',
						action: 'Get a contact by ID',
						description: 'Retrieve a contact by its ID',
						routing: {
							request: {
								method: 'GET',
								url: '/contacts/{contactId}',
							},
						},
					},
				],
				default: 'getContactOperation',
			},
		],
	};
}
