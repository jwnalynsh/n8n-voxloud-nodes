import { INode, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class VoxloudTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Voxloud Trigger',
		name: 'voxloudTrigger',
		icon: 'file:voxloud.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Starts the workflow when a Voxloud event occurs',
		defaults: {
			name: 'Voxloud Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'voxloudApi',
				required: true,
			},
		],
		webhooks: [
		],
		properties: [],
	}
}
