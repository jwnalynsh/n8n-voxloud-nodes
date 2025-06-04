# n8n-nodes-voxloud

This is an n8n community node. It lets you use Voxloud APIs in your n8n workflows.

Voxloud is a cloud-based business phone system that provides APIs for managing contacts, users, calls, and real-time call events.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations
- Contacts
  - Create, update, get, and delete contacts in your Voxloud account.
- Users
  - List all users.
- Click to Call
  - Create, update, get, and delete click-to-call objects in your Voxloud account.
- Triggers
  - Start workflows on Voxloud events (e.g., outbound call started, incoming call, call answered, etc.).

## Credentials

To use this node, you need a Voxloud API key.

1. Sign up for a Voxloud account and generate an API key from your Voxloud dashboard.
2. In n8n, add new credentials for "Voxloud API" and enter your API key.
3. N8N will automatically test connection.

## Compatibility

- Tested with n8n 1.94.1
- No known incompatibilities.

## Usage

- Add the "Voxloud Trigger" node to your workflow to start flows on real-time call events (e.g., outbound call started, incoming call).
- Use the resource nodes to manage contacts, users, or initiate click-to-call actions.
- For webhook triggers, ensure your n8n instance is accessible from the internet (use a service like ngrok for local development).

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Voxloud API documentation](https://developers.voxloud.com/)

## Version history

- 1.0.0: Initial release with support for contacts, users, click-to-call, and webhook triggers.
