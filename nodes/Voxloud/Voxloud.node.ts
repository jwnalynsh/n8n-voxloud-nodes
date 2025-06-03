import { INodeTypeBaseDescription, IVersionedNodeType, VersionedNodeType } from 'n8n-workflow';
import { VoxloudV1 } from './V1/VoxloudV1.node';

export class Voxloud extends VersionedNodeType {

	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Voxloud',
			name: 'voxloud',
			icon: 'file:voxloud.svg',
			group: ['output'],
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'Consume Voxloud API',
			defaultVersion: 1,
		};
		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new VoxloudV1(baseDescription),
		}

		super(nodeVersions, baseDescription);
	}
}
