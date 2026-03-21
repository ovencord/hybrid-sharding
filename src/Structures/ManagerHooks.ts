import type { Cluster } from '../Core/Cluster.ts';

export class ClusterManagerHooks {
    constructClusterArgs(_cluster: Cluster, args: string[]) {
        return args;
    }
}
