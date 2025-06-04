import { INodeProperties } from 'n8n-workflow';

export const clickToCallOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['clickToCall'],
			},
		},
		options: [
			{
				name: 'Connect',
				value: 'connect',
				description: 'Connect a click to call resource',
				action: 'Connect a click to call resource',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a click to call resource',
				action: 'Create a click to call resource',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a click to call resource',
				action: 'Delete a click to call resource',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a click to call resource',
				action: 'Get a click to call resource',
			},
			{
				name: 'Get Many',
				value: 'getmany',
				description: 'Get Many click to call resources',
				action: 'Get many click to call resources',
			},
		],
		default: 'get',
	},
];

export const clickToCallFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                 clickToCall:get                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Click to Call ID',
		name: 'clickToCallId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['clickToCall'],
				operation: ['get'],
			},
		},
		default: '',
	},
	/* -------------------------------------------------------------------------- */
	/*                               clickToCall:create                        		*/
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['clickToCall'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'Extension',
		name: 'extension',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['clickToCall'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'Outbound Number',
		name: 'outboundNumber',
		placeholder: 'e.g. +1234567890',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['clickToCall'],
				operation: ['create'],
			},
		},
		default: '',
	},
	{
		displayName: 'Dial First',
		name: 'dialFirst',
		type: 'options',
		options: [
			{
				name: 'Contact',
				value: 'contact',
			},
			{
				name: 'Extension',
				value: 'extension',
			},
		],
		displayOptions: {
			show: {
				resource: ['clickToCall'],
				operation: ['create'],
			},
		},
		default: 'extension',
	},

	/* -------------------------------------------------------------------------- */
	/*                              clickToCall:delete                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Click to Call ID',
		name: 'clickToCallId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['clickToCall'],
				operation: ['delete'],
			},
		},
		default: '',
	},
	/* -------------------------------------------------------------------------- */
	/*                              clickToCall:connect                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Click to Call ID',
		name: 'clickToCallId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['clickToCall'],
				operation: ['connect'],
			},
		},
		default: '',
	},
	{
		displayName: 'Contact Number',
		name: 'contact',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['clickToCall'],
				operation: ['connect'],
			},
		},
		default: '',
	},
];
