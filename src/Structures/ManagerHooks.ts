import type { Cluster } from '../Core/Cluster.ts';

export class ClusterManagerHooks {
    constructor() {}

    constructClusterArgs(cluster: Cluster, args: string[]) {
        return args;
    }
}
