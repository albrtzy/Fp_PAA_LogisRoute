export interface Node {
  id: number;
  x: number;
  y: number;
  name?: string; // Tambahan properti untuk menyimpan nama daerah
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

  addNode(id: number, x: number, y: number, name: string = "") {
    this.nodes.push({ id, x, y, name });
  }

  addEdge(u: number, v: number, weight: number) {
    this.edges.push({ u, v, weight });
    this.adj[u].push({ target: v, weight });
    this.adj[v].push({ target: u, weight });
  }
}

const INF = Number.MAX_SAFE_INTEGER;

export function runDijkstra(G: Graph, source: number) {
  const dist = new Array(G.V).fill(INF);
  const parent = new Array(G.V).fill(-1);
  dist[source] = 0;

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
    if (!relaxed) break;
  }
  return { dist };
}

// GENERATOR PETA SURABAYA
export function generateVisualGraph(): Graph {
  const surabayaAreas = [
    "Gudang Pusat Rungkut", // Index 0 (Titik Mulai)
    "Kampus ITS Sukolilo",
    "Keputih",
    "Gubeng",
    "Pakuwon City",
    "Kertajaya",
    "Tunjungan",
    "Kenjeran",
    "Tanjung Perak",
    "Wonokromo",
    "Jambangan",
    "Darmo"
  ];
  
  const numNodes = surabayaAreas.length;
  const G = new Graph(numNodes);
  
  for (let i = 0; i < numNodes; i++) {
    G.addNode(i, Math.floor(Math.random() * 80) + 10, Math.floor(Math.random() * 70) + 10, surabayaAreas[i]);
  }
  
  for (let i = 0; i < numNodes; i++) {
    const target = (i + 1) % numNodes;
    const weight = Math.floor(Math.random() * 15) + 2; // Simulasi jarak 2km - 17km
    G.addEdge(i, target, weight);
    if (Math.random() > 0.4) {
      const randomTarget = Math.floor(Math.random() * numNodes);
      if (randomTarget !== i && randomTarget !== target) {
        G.addEdge(i, randomTarget, Math.floor(Math.random() * 15) + 2);
      }
    }
  }
  return G;
}

// Generator Benchmark Tetap Menggunakan Titik Acak agar bisa ribuan data
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