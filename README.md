# 𝗛 𝗬 𝗕 𝗥 𝗜 𝗗 - 𝗦 𝗛 𝗔 𝗥 𝗗 𝗜 𝗡 𝗚

<p align="left">
<a href="https://github.com/sponsors/LuigiColantuono">
<img src="https://img.shields.io/github/sponsors/LuigiColantuono?style=social"></a> 
<a href="https://paypal.me/l0g4n7"><img src="https://img.shields.io/badge/💖-Support-ff69b4"></a> 
<img src="https://img.shields.io/npm/v/@ovencord/hybrid-sharding"> 
<img src="https://img.shields.io/npm/dm/@ovencord/hybrid-sharding?label=downloads"> 
<img src="https://img.shields.io/npm/l/@ovencord/hybrid-sharding"> 
<img src="https://img.shields.io/github/repo-size/ovencord/hybrid-sharding"> 
<a href="https://github.com/ovencord/hybrid-sharding">
<img src="https://img.shields.io/badge/Bun-Networking-black?logo=bun"></a>
</p>

<p align="center">
<img width="400" height="211" alt="ovencord hybrid sharding logo" src="https://github.com/user-attachments/assets/12a46f1a-3901-4682-b9a9-b5f75768c607" />
</p>

## Ovencord Hybrid Sharding

The ultimate **Enterprise Bun-native** sharding manager for Discord bots. Built for performance, reliability, and scale.

`@ovencord/hybrid-sharding` is a ground-up refactor of the hybrid sharding concept, optimized specifically for the Bun runtime. It eliminates all Node.js dependencies, leveraging `Bun.spawn` and native Bun IPC for ultra-fast, low-overhead clustering.

##  Key Features

- **Bun-Native Core**: Zero Node.js dependencies. Uses `Bun.spawn` and native IPC for maximum performance.
- **Zero-Downtime Rolling Restarts**: Built-in `ReClusterManager` for updating your bot with zero service interruption.
- **Redis-Backed Heartbeats**: Distributed health monitoring using Redis. If a cluster hangs, it's detected and restarted automatically via TTL.
- **Integrated Dashboard API**: Built-in monitoring server (port 3001) using `Bun.serve` to track cluster health and trigger administrative actions.
- **QueueManager Plugin**: Advanced control over cluster spawning to respect Discord's rate limits precisely.
- **Resource Efficiency**: Hybrid sharding (multiple shards per process) reduces memory overhead by 40-60%.

---

### 📊 Comparison: `discord-hybrid-sharding` vs `@ovencord/hybrid-sharding`

| Feature | `discord-hybrid-sharding` | `@ovencord/hybrid-sharding` | Result / Benefit |
| :--- | :--- | :--- | :--- |
| **Runtime** | Node.js (Legacy) | **Bun (Native)** | Native execution without emulation |
| **Unpacked Size** | 681 kB | **115 kB** | **~83% smaller** |
| **Total Files** | 88 | **26** | Distilled, "crap-free" code |
| **Process Manager** | `child_process` / `cluster` | **`Bun.spawn`** | Kernel-level process management |
| **Inter-Process (IPC)** | Node.js IPC (Slow) | **Native Bun IPC** | Near-zero communication latency |
| **Events System** | `node:events` (Sync) | **`AsyncEventEmitter`** | Does not block Bun's event loop |
| **CPU Detection** | `node:os` | **`navigator.hardwareConcurrency`** | Zero imports, Web Standard API |
| **Path Resolution** | `node:path` (JS logic) | **`Bun.resolveSync`** | File resolution written in Zig |
| **Build Artifacts** | `dist/` (compiled) | **Source-Only (.ts)** | **0ms Build Time** - Runs pure TS |
| **Node.js Imports** | Present Everywhere | **ZERO (Grep Zero)** | Total independence from the past |

## 📦 Installation

```bash
bun add @ovencord/hybrid-sharding
```

## 🛠️ Quick Start

### 1. The Manager (`cluster.js`)

```js
import { ClusterManager, ReClusterManager, HeartbeatManager, DashboardServer } from '@ovencord/hybrid-sharding';

const manager = new ClusterManager(`./bot.js`, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    mode: 'process', // Native Bun processes
    token: 'YOUR_BOT_TOKEN',
});

// Extend with Enterprise features
manager.extend(
    new ReClusterManager(),
    new HeartbeatManager({
        redis: { host: 'localhost', port: 6379 },
        interval: 10000,
    }),
    new DashboardServer({ port: 3001 })
);

manager.on('clusterCreate', (cluster) => console.log(`🚀 Launched Cluster ${cluster.id}`));
manager.spawn();
```

### 2. The Client (`bot.js`)

```js
import { ClusterClient, getInfo } from '@ovencord/hybrid-sharding';
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
    shards: getInfo().SHARD_LIST,
    shardCount: getInfo().TOTAL_SHARDS,
    intents: [GatewayIntentBits.Guilds],
});

client.cluster = new ClusterClient(client);

client.on('ready', () => {
    client.cluster.triggerReady();
    console.log(`✅ Cluster ${client.cluster.id} is ready!`);
});

client.login('YOUR_BOT_TOKEN');
```

---

## 📈 Monitoring API

The built-in `DashboardServer` provides a JSON API for monitoring and management:

- `GET /stats`: Unified metrics across all clusters.
- `POST /restart`: Trigger a rolling restart.
- `POST /maintenance`: Toggle maintenance mode.

---

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](file:///LICENSE) file for details.
Portions of this code are based on `discord.js` and `discord-hybrid-sharding`, copyright of their respective authors.

Developed with ❤️ by [Luigi Colantuono](https://github.com/LuigiColantuono).
