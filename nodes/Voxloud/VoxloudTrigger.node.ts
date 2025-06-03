import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeConnectionType,
} from 'n8n-workflow';
import { voxloudApiRequest } from './V1/GenericFunctions';

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
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
			{
				// This webhook is used to set up the initial webhook URL
				name: 'setup',
				httpMethod: 'GET',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'eventName',
				type: 'options',
				options: [
					{
						name: 'After Fax Click to Call',
						value: 'telephony.clickToCall',
						description: 'Triggered AFTER a click-to-call event finished',
					},
					{
						name: 'After Fax Received',
						value: 'telephony.fax',
						description: 'Triggered AFTER a fax event finished',
					},
					{
						name: 'After Phone Call',
						value: 'telephony.hangup',
						description: 'Triggered AFTER a call event finished',
					},
					{
						name: 'Call Hung Up',
						value: 'call.hungup',
						description: 'Triggered when a call is hung up',
					},
					{
						name: 'Phone Call Answered',
						value: 'call.answered',
						description: 'Triggered when a call is answered',
					},
					{
						name: 'Phone Call Inbound Received',
						value: 'call.inbound',
						description: 'Triggered when an inbound call is received',
					},
					{
						name: 'Phone Call Started',
						value: 'call.start',
						description: 'Triggered when an outbound or internal call is started',
					},
				],
				default: 'call.inbound',
				required: true,
			},
		],
	};
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const response = await voxloudApiRequest.call(
					this,
					'GET',
					'/webhook-subscriptions',
					{},
				);
				const subscriptions = Array.isArray(response) ? response : (response?.results ?? []);

				for (const subscription of subscriptions) {
					await voxloudApiRequest.call(
						this,
						'DELETE',
						`/webhook-subscriptions/${subscription.id}`,
						{},
					);
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				let endpoint = '/webhook-subscriptions';
				let body: IDataObject = {
					callback_url: webhookUrl,
					event_type: this.getNodeParameter('eventName') as string,
				};
				await voxloudApiRequest.call(this, 'POST', endpoint, body);
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const currentWebhookUrl = this.getNodeWebhookUrl('default') as string;
				const response = await voxloudApiRequest.call(this, 'GET', '/webhook-subscriptions', {});
				const subscriptions = response?.results ?? [];

				for (const subscription of subscriptions) {
					if (subscription.callback_url === currentWebhookUrl) {
						await voxloudApiRequest.call(
							this,
							'DELETE',
							`/webhook-subscriptions/${subscription.id}`,
							{},
						);
					}
				}
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		return {
			workflowData: [
				[
					{
						json: body,
					},
				],
			],
		};
	}
}
