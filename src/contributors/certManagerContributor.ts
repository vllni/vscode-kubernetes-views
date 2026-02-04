import * as k8s from 'vscode-kubernetes-tools-api';

/**
 * Cert Manager CRDs
 */
interface CRDInfo {
    kind: string;
    pluralDisplayName: string;
    abbreviation: string;
    apiName: string;
}

const CERT_MANAGER_CRDS: CRDInfo[] = [
    { kind: 'Certificate', pluralDisplayName: 'Certificates', abbreviation: 'cert', apiName: 'certificates.cert-manager.io' },
    { kind: 'CertificateRequest', pluralDisplayName: 'Certificate Requests', abbreviation: 'cr', apiName: 'certificaterequests.cert-manager.io' },
    { kind: 'Order', pluralDisplayName: 'Orders', abbreviation: 'order', apiName: 'orders.acme.cert-manager.io' },
    { kind: 'Challenge', pluralDisplayName: 'Challenges', abbreviation: 'challenge', apiName: 'challenges.acme.cert-manager.io' },
    { kind: 'Issuer', pluralDisplayName: 'Issuers', abbreviation: 'issuer', apiName: 'issuers.cert-manager.io' },
    { kind: 'ClusterIssuer', pluralDisplayName: 'Cluster Issuers', abbreviation: 'clusterissuer', apiName: 'clusterissuers.cert-manager.io' }
];

export class CertManagerNodeContributor implements k8s.ClusterExplorerV1_1.NodeContributor {
    private nodeSources: k8s.ClusterExplorerV1_1.NodeSources | undefined;

    constructor(nodeSources?: k8s.ClusterExplorerV1_1.NodeSources) {
        this.nodeSources = nodeSources;
    }

    /**
     * Determines if this contributor should add children to the given parent node
     */
    contributesChildren(parent: k8s.ClusterExplorerV1_1.ClusterExplorerNode | undefined): boolean {
        // Add Cert Manager folder at the cluster level (when parent is the cluster context)
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

        // At cluster level, add the Cert Manager folder
        if (parent.nodeType === 'context') {
            // Create resource folder nodes for each CRD type
            const crdFolders = CERT_MANAGER_CRDS.map(crd =>
                this.nodeSources!.resourceFolder(
                    crd.kind,
                    crd.pluralDisplayName,
                    crd.kind,
                    crd.abbreviation,
                    crd.apiName
                )
            );

            // Group all CRD folders under a "Cert Manager" grouping folder
            const certManagerFolder = this.nodeSources.groupingFolder(
                'Cert Manager',
                'vsKubernetes.certManager',
                ...crdFolders
            );

            return certManagerFolder.nodes();
        }

        return [];
    }
}
