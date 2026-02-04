import * as vscode from 'vscode';
import * as k8s from 'vscode-kubernetes-tools-api';
import { CertManagerNodeContributor } from './contributors/certManagerContributor';
import { GatewayNodeContributor } from './contributors/gatewayContributor';

export async function activate(context: vscode.ExtensionContext) {
    console.log('Activating Kubernetes Views extension');

    // Get the Cluster Explorer API
    const clusterExplorer = await k8s.extension.clusterExplorer.v1_1;
    
    if (!clusterExplorer.available) {
        vscode.window.showErrorMessage('Kubernetes Cluster Explorer API is not available');
        return;
    }

    // Get node sources for creating tree nodes
    const nodeSources = clusterExplorer.api.nodeSources;

    // Register Cert Manager node contributor
    const certManagerContributor = new CertManagerNodeContributor(nodeSources);
    clusterExplorer.api.registerNodeContributor(certManagerContributor);

    // Register Gateway API node contributor
    const gatewayContributor = new GatewayNodeContributor(nodeSources);
    clusterExplorer.api.registerNodeContributor(gatewayContributor);

    console.log('Kubernetes Views extension activated successfully');
}

export function deactivate() {
    console.log('Deactivating Kubernetes Views extension');
}
