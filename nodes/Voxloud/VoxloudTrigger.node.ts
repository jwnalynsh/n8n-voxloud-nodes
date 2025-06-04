import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import { voxloudApiRequest } from './V1/GenericFunctions';

export class VoxloudTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Voxloud Trigger',
		name: 'voxloudTrigger',
		icon: 'file:voxloud.svg',
		group: ['trigger'],
		version: 1,
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
				displayOptions: {
					show: {
						authentication: ['apiKey'],
					},
				},
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
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
				displayName: 'Event',
				name: 'eventName',
				type: 'options',
				options: [
					{
						name: 'Call Answered',
						value: 'CALL_ANSWERED',
						description: 'Triggered when a call is answered',
					},
					{
						name: 'Call Hangup',
						value: 'CALL_HANGUP',
						description: 'Triggered when a call is hung up',
					},
					{
						name: 'Call Incoming',
						value: 'CALL_INCOMING',
						description: 'Triggered when an inbound call is received',
					},
					{
						name: 'Call Started',
						value: 'CALL_STARTED',
						description: 'Triggered when an outbound or internal call is started',
					},
					{
						name: 'Click to Call',
						value: 'CLICK_TO_CALL',
						description: 'Triggered after a click-to-call event finished',
					},
					{
						name: 'Fax Call',
						value: 'FAX_CALL',
						description: 'Triggered after a fax event finished',
					},
					{
						name: 'Phone Call',
						value: 'PHONE_CALL',
						description: 'Triggered after a phone call event finished',
					},
				],
				default: 'CALL_INCOMING',
				required: true,
			},
		],
	};
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const eventType = this.getNodeParameter('eventName') as string;
				let response;
				try {
					response = await voxloudApiRequest.call(this, 'GET', '/webhook-subscriptions', {});
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Voxloud webhook check error: ${error.message || error}`,
					);
				}
				const subscriptions = Array.isArray(response) ? response : (response?.results ?? []);
				if (this.logger) {
					this.logger.info(`checkExists subscriptions: ${JSON.stringify(subscriptions)}`);
					this.logger.info(
						subscriptions.some(
							(sub: IDataObject) => sub.callback_url === webhookUrl && sub.event_type === eventType,
						),
					);
				}
				return subscriptions.some(
					(sub: IDataObject) => sub.callback_url === webhookUrl && sub.event_type === eventType,
				);
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				let endpoint = '/webhook-subscriptions';
				let body: IDataObject = {
					callback_url: webhookUrl,
					event_type: this.getNodeParameter('eventName') as string,
				};
				try {
					await voxloudApiRequest.call(this, 'POST', endpoint, body);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Voxloud webhook create error: ${error.message || error}`,
					);
				}
				if (this.logger) {
					this.logger.info(`created webhook with: ${JSON.stringify(body)}`);
				}
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const eventType = this.getNodeParameter('eventName') as string;
				const response = await voxloudApiRequest.call(this, 'GET', '/webhook-subscriptions', {});
				const subscriptions = Array.isArray(response) ? response : (response?.results ?? []);
				for (const subscription of subscriptions as IDataObject[]) {
					if (subscription.callback_url === webhookUrl && subscription.event_type === eventType) {
						await voxloudApiRequest.call(
							this,
							'DELETE',
							`/webhook-subscriptions/${subscription.id}`,
							{},
						);
					}
				}
				if (this.logger) {
					this.logger.info(`deleted webhook with url: ${webhookUrl} and event type: ${eventType}`);
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
