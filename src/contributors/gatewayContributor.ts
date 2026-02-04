import * as k8s from 'vscode-kubernetes-tools-api';

/**
 * Gateway API CRDs
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
        // Add Gateway API folder at the cluster level (when parent is the cluster context)
        if (parent && parent.nodeType === 'context') {
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

        // At cluster level, add the Gateway API folder
        if (parent.nodeType === 'context') {
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

            // Group all Gateway API folders under a "Gateway API" grouping folder
            const gatewayApiFolder = this.nodeSources.groupingFolder(
                'Gateway API',
                'vsKubernetes.gatewayApi',
                ...gatewayFolders
            );

            return gatewayApiFolder.nodes();
        }

        return [];
    }
}
