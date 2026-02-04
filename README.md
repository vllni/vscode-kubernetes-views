# vscode-kubernetes-views

Adds additional useful views to the Kubernetes extension's tree view. This extension extends the [vscode-kubernetes-tools](https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools) extension to provide additional Custom Resource Definitions (CRDs) in the Cluster Explorer.

## Features

This extension adds the following folders and resources to the Kubernetes Cluster Explorer:

### Cert Manager

A new "Cert Manager" folder that contains all CRDs relevant to cert-manager:

- **Certificates** - TLS certificate resources managed by cert-manager
- **Certificate Requests** - Certificate signing requests
- **Orders** - ACME order resources for certificate issuance
- **Challenges** - ACME challenge resources for domain validation
- **Issuers** - Certificate issuers scoped to a namespace
- **Cluster Issuers** - Certificate issuers scoped to the entire cluster

### Gateway API

A new "Gateway API" folder that contains all Gateway API CRDs for advanced traffic routing:

- **Gateways** - Gateway resources for ingress/egress traffic
- **Gateway Classes** - Gateway class definitions
- **HTTP Routes** - HTTP routing rules
- **gRPC Routes** - gRPC routing rules
- **TLS Routes** - TLS routing rules
- **TCP Routes** - TCP routing rules
- **UDP Routes** - UDP routing rules
- **Reference Grants** - Cross-namespace reference grants

## Requirements

- Visual Studio Code 1.60.0 or higher
- [Kubernetes extension](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools) must be installed

## Installation

1. Install the extension from the VS Code Marketplace (or install from VSIX)
2. Ensure you have the Kubernetes extension installed
3. Open VS Code with a workspace that has Kubernetes context configured
4. View the Kubernetes Cluster Explorer to see the new folders

## Usage

Once installed, this extension automatically adds the Cert Manager folder and Gateway API resources to your Kubernetes Cluster Explorer. Simply expand the folders to view and interact with these Custom Resources in your cluster.

## Development

### Building from source

```bash
npm install
npm run compile
```

### Packaging

```bash
npm install -g @vscode/vsce
vsce package
```

This will create a `.vsix` file that can be installed in VS Code.

## License

See LICENSE file for details.

