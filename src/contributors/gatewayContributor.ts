import * as k8s from 'vscode-kubernetes-tools-api';

/**
 * Gateway API CRDs to add under Networking
 */
interface CRDInfo {
    kind: string;
    pluralDisplayName: string;
    abbreviation: string;
    apiName: string;
}

const GATEWAY_API_CRDS: CRDInfo[] = [
    { kind: 'Gateway', pluralDisplayName: 'Gateways', abbreviation: 'gtw', apiName: 'gateways.gateway.networking.k8s.io' },
    { kind: 'GatewayClass', pluralDisplayName: 'Gateway Classes', abbreviation: 'gc', apiName: 'gatewayclasses.gateway.networking.k8s.io' },
    { kind: 'HTTPRoute', pluralDisplayName: 'HTTP Routes', abbreviation: 'httproute', apiName: 'httproutes.gateway.networking.k8s.io' },
    { kind: 'GRPCRoute', pluralDisplayName: 'GRPC Routes', abbreviation: 'grpcroute', apiName: 'grpcroutes.gateway.networking.k8s.io' },
    { kind: 'TLSRoute', pluralDisplayName: 'TLS Routes', abbreviation: 'tlsroute', apiName: 'tlsroutes.gateway.networking.k8s.io' },
    { kind: 'TCPRoute', pluralDisplayName: 'TCP Routes', abbreviation: 'tcproute', apiName: 'tcproutes.gateway.networking.k8s.io' },
    { kind: 'UDPRoute', pluralDisplayName: 'UDP Routes', abbreviation: 'udproute', apiName: 'udproutes.gateway.networking.k8s.io' },
    { kind: 'ReferenceGrant', pluralDisplayName: 'Reference Grants', abbreviation: 'refgrant', apiName: 'referencegrants.gateway.networking.k8s.io' }
];

export class GatewayNodeContributor implements k8s.ClusterExplorerV1_1.NodeContributor {
    private nodeSources: k8s.ClusterExplorerV1_1.NodeSources | undefined;

    constructor(nodeSources?: k8s.ClusterExplorerV1_1.NodeSources) {
        this.nodeSources = nodeSources;
    }

    /**
     * Determines if this contributor should add children to the given parent node
     */
    contributesChildren(parent: k8s.ClusterExplorerV1_1.ClusterExplorerNode | undefined): boolean {
        // Add Gateway API CRDs under the "Network" grouping folder
        if (parent && parent.nodeType === 'folder.grouping') {
            return true;
        }
        
        return false;
    }

    /**
     * Returns child nodes for the given parent
     */
    async getChildren(parent: k8s.ClusterExplorerV1_1.ClusterExplorerNode | undefined): Promise<k8s.ClusterExplorerV1_1.Node[]> {
        if (!parent || !this.nodeSources) {
            return [];
        }

        // Under Network folder, add all Gateway API CRD resource types
        if (parent.nodeType === 'folder.grouping') {
            // Create resource folder nodes for each Gateway API CRD type
            const gatewayFolders = GATEWAY_API_CRDS.map(crd =>
                this.nodeSources!.resourceFolder(
                    crd.kind,
                    crd.pluralDisplayName,
                    crd.kind,
                    crd.abbreviation,
                    crd.apiName
                )
            );

            // Return all Gateway API folders as children of the Network grouping folder
            const allNodes: k8s.ClusterExplorerV1_1.Node[] = [];
            for (const folder of gatewayFolders) {
                const nodes = await folder.nodes();
                allNodes.push(...nodes);
            }
            
            return allNodes;
        }

        return [];
    }
}
