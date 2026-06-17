export interface Node {
  id: number;
  x: number;
  y: number;
}

export interface Edge {
  u: number;
  v: number;
  weight: number;
}

export class Graph {
  V: number;
  nodes: Node[];
  edges: Edge[];
  adj: { target: number; weight: number }[][];

  constructor(V: number) {
    this.V = V;
    this.nodes = [];
    this.edges = [];
    this.adj = Array.from({ length: V }, () => []);
  }

  addNode(id: number, x: number, y: number) {
    this.nodes.push({ id, x, y });
  }

  addEdge(u: number, v: number, weight: number) {
    this.edges.push({ u, v, weight });
    this.adj[u].push({ target: v, weight });
    this.adj[v].push({ target: u, weight });
  }
}

const INF = Number.MAX_SAFE_INTEGER;

// ==========================================
// 1. DIJKSTRA ALGORITHM
// ==========================================
export function runDijkstra(G: Graph, source: number) {
  const dist = new Array(G.V).fill(INF);
  const parent = new Array(G.V).fill(-1);
  dist[source] = 0;

  // PENJELASAN ANOMALI PERFORMA:
  // Di C++, kita bisa menggunakan std::priority_queue (Min-Heap) yang beroperasi dalam O(log V).
  // Namun, JavaScript/TypeScript tidak memiliki struktur data Priority Queue bawaan.
  // Sebagai gantinya, kita menggunakan Array biasa yang di-sort setiap kali ada iterasi.
  // Proses pq.sort() ini memakan waktu O(N log N) di setiap putaran loop.
  // Inilah alasan utama mengapa Dijkstra terlihat sangat lambat (bottleneck) di ekosistem Web (V8 Engine)
  // saat menangani ribuan Vertex, menggeser performanya jauh dari batas teoritis O((V+E) log V).
  const pq: { d: number; u: number }[] = [{ d: 0, u: source }];

  while (pq.length > 0) {
    pq.sort((a, b) => a.d - b.d); 
    const { d, u } = pq.shift()!;

    if (d > dist[u]) continue;

    for (const edge of G.adj[u]) {
      const v = edge.target;
      if (dist[u] + edge.weight < dist[v]) {
        dist[v] = dist[u] + edge.weight;
        parent[v] = u;
        pq.push({ d: dist[v], u: v });
      }
    }
  }
  return { dist, parent };
}

// ==========================================
// 2. BELLMAN-FORD ALGORITHM
// ==========================================
export function runBellmanFord(G: Graph, source: number) {
  const dist = new Array(G.V).fill(INF);
  dist[source] = 0;

  for (let i = 0; i < G.V - 1; i++) {
    let relaxed = false;
    for (let u = 0; u < G.V; u++) {
      if (dist[u] === INF) continue;
      for (const edge of G.adj[u]) {
        const v = edge.target;
        if (dist[u] + edge.weight < dist[v]) {
          dist[v] = dist[u] + edge.weight;
          relaxed = true;
        }
      }
    }
    // Optimasi mutlak yang membuat algoritma ini mengalahkan Dijkstra di data acak
    if (!relaxed) break;
  }
  return { dist };
}

// ==========================================
// FUNGSI GENERATOR GRAF
// ==========================================
export function generateVisualGraph(numNodes: number): Graph {
  const G = new Graph(numNodes);
  for (let i = 0; i < numNodes; i++) {
    G.addNode(i, Math.floor(Math.random() * 80) + 10, Math.floor(Math.random() * 80) + 10);
  }
  for (let i = 0; i < numNodes; i++) {
    const target = (i + 1) % numNodes;
    const weight = Math.floor(Math.random() * 50) + 10;
    G.addEdge(i, target, weight);
    if (Math.random() > 0.5) {
      const randomTarget = Math.floor(Math.random() * numNodes);
      if (randomTarget !== i && randomTarget !== target) {
        G.addEdge(i, randomTarget, Math.floor(Math.random() * 50) + 10);
      }
    }
  }
  return G;
}

export function generateBenchmarkGraph(V: number, E: number): Graph {
  const G = new Graph(V);
  for (let i = 0; i < E; i++) {
    const u = Math.floor(Math.random() * V);
    const v = Math.floor(Math.random() * V);
    if (u !== v) {
      G.addEdge(u, v, Math.floor(Math.random() * 100) + 1);
    }
  }
  return G;
}