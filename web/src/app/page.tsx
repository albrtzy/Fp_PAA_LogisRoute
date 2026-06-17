"use client";

import { useState, useEffect } from "react";
import { Graph, generateVisualGraph, generateBenchmarkGraph, runDijkstra, runBellmanFord } from "@/lib/algorithms";

export default function LogisRouteDashboard() {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [pathEdges, setPathEdges] = useState<Set<string>>(new Set());
  const [isRunning, setIsRunning] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState<any[]>([]);

  useEffect(() => {
    setGraph(generateVisualGraph(15));
  }, []);

  const handleRunVisualizer = () => {
    if (!graph) return;
    const { parent } = runDijkstra(graph, 0);
    const target = graph.V - 1;
    let curr = target;
    const newPath = new Set<string>();
    
    while (curr !== -1 && parent[curr] !== -1) {
      const p = parent[curr];
      newPath.add(`${p}-${curr}`);
      newPath.add(`${curr}-${p}`);
      curr = p;
    }
    setPathEdges(newPath);
  };

  const handleRunBenchmark = () => {
    setIsRunning(true);
    setBenchmarkData([]);

    setTimeout(() => {
      const sizes = [100, 500, 1000, 2500, 5000]; // 5 ukuran sesuai syarat tugas
      const results = [];

      for (const V of sizes) {
        const E = V * 10;
        const G = generateBenchmarkGraph(V, E);

        const startD = performance.now();
        runDijkstra(G, 0);
        const timeD = performance.now() - startD;

        const startB = performance.now();
        runBellmanFord(G, 0);
        const timeB = performance.now() - startB;

        results.push({ V, E, timeD: timeD.toFixed(2), timeB: timeB.toFixed(2) });
      }
      setBenchmarkData(results);
      setIsRunning(false);
    }, 100);
  };

  // Logika Cerdas Pembuat Kesimpulan Dinamis (Versi Simpel)
  const renderInsight = () => {
    if (benchmarkData.length === 0) return null;

    // Ambil data dari pengujian skala terbesar (elemen terakhir di array)
    const lastResult = benchmarkData[benchmarkData.length - 1];
    const timeD = parseFloat(lastResult.timeD);
    const timeB = parseFloat(lastResult.timeB);
    const V = lastResult.V;

    if (timeB < timeD) {
      // Kondisi: Bellman-Ford Menang
      return (
        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
          <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center">
            <span className="mr-2">💡</span> Kesimpulan: Bellman-Ford Lebih Cepat
          </h3>
          <p className="text-xs text-indigo-800 leading-relaxed">
            Pada pengujian peta terbesar ({V} titik), <strong>Bellman-Ford ({timeB} ms)</strong> lebih cepat daripada <strong>Dijkstra ({timeD} ms)</strong>. Secara teori kelas, Dijkstra seharusnya menang. Namun, ini terjadi karena alasan simpel berikut:
            <br /><br />
            <strong>1. Keterbatasan Browser:</strong> Javascript di browser tidak memiliki alat bawaan yang pas untuk menjalankan Dijkstra secara maksimal. Akibatnya, komputer harus mengurutkan data antrean secara manual terus-menerus yang membuat kinerjanya melambat.<br />
            <strong>2. Fitur Berhenti Pintar:</strong> Algoritma Bellman-Ford di program ini sudah kita buat agar langsung berhenti bekerja begitu rute terbaik sudah ditemukan, sehingga tidak membuang waktu mengecek jalan yang tidak perlu.
          </p>
        </div>
      );
    } else {
      // Kondisi: Dijkstra Menang
      return (
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
          <h3 className="text-sm font-bold text-emerald-900 mb-2 flex items-center">
            <span className="mr-2">✅</span> Kesimpulan: Dijkstra Lebih Cepat
          </h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            Pada pengujian peta terbesar ({V} titik), <strong>Dijkstra ({timeD} ms)</strong> lebih cepat daripada <strong>Bellman-Ford ({timeB} ms)</strong>. Hasil ini sangat sesuai dengan teori dasar algoritma!
            <br /><br />
            Algoritma Dijkstra terbukti lebih efisien karena ia pintar memilih rute. Ia hanya mengecek jalan yang jaraknya paling masuk akal. Di sisi lain, Bellman-Ford menjadi sangat lambat karena algoritma ini memaksakan diri untuk mengecek dan menghitung ulang seluruh jalan yang ada berkali-kali.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h1 className="text-3xl font-bold text-slate-900">LogisRoute Dashboard</h1>
          <p className="text-slate-500 mt-2">Sistem Optimasi Rute Pengiriman (Dijkstra vs Bellman-Ford)</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Live Visualizer (Simulasi Peta)</h2>
            <div className="relative bg-slate-900 flex-grow rounded-lg overflow-hidden min-h-[400px]">
              {graph && (
                <svg className="absolute inset-0 w-full h-full">
                  {graph.edges.map((edge, idx) => {
                    const uNode = graph.nodes.find((n) => n.id === edge.u)!;
                    const vNode = graph.nodes.find((n) => n.id === edge.v)!;
                    const isHighlighted = pathEdges.has(`${edge.u}-${edge.v}`);
                    
                    return (
                      <g key={idx}>
                        <line
                          x1={`${uNode.x}%`} y1={`${uNode.y}%`}
                          x2={`${vNode.x}%`} y2={`${vNode.y}%`}
                          stroke={isHighlighted ? "#10b981" : "#334155"}
                          strokeWidth={isHighlighted ? 4 : 1}
                          className="transition-all duration-500"
                        />
                        <text
                          x={`${(uNode.x + vNode.x) / 2}%`}
                          y={`${(uNode.y + vNode.y) / 2}%`}
                          fill={isHighlighted ? "#10b981" : "#64748b"}
                          fontSize="12"
                        >
                          {edge.weight}
                        </text>
                      </g>
                    );
                  })}
                  {graph.nodes.map((node) => (
                    <circle
                      key={node.id}
                      cx={`${node.x}%`} cy={`${node.y}%`}
                      r="12"
                      fill={node.id === 0 ? "#3b82f6" : "#1e293b"}
                      stroke="#cbd5e1"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
              )}
            </div>
            <div className="mt-4 flex gap-4">
              <button 
                onClick={() => { setGraph(generateVisualGraph(15)); setPathEdges(new Set()); }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition"
              >
                Acak Peta
              </button>
              <button 
                onClick={handleRunVisualizer}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Cari Rute Terpendek
              </button>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Engine Benchmark</h2>
            <p className="text-slate-600 mb-6 text-sm">
              Uji performa perbandingan *runtime* Dijkstra dan Bellman-Ford pada ukuran dataset besar.
            </p>
            
            <button 
              onClick={handleRunBenchmark}
              disabled={isRunning}
              className={`px-4 py-3 rounded-lg font-medium text-white transition mb-6 ${
                isRunning ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isRunning ? 'Sedang Memproses Titik...' : 'Mulai Benchmark'}
            </button>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-600">
                    <th className="p-3">Vertices (V)</th>
                    <th className="p-3">Edges (E)</th>
                    <th className="p-3">Dijkstra (ms)</th>
                    <th className="p-3">Bellman-Ford (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {benchmarkData.length > 0 ? (
                    benchmarkData.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-medium">{row.V}</td>
                        <td className="p-3">{row.E}</td>
                        <td className="p-3 text-blue-600 font-semibold">{row.timeD}</td>
                        <td className="p-3 text-red-500 font-semibold">{row.timeB}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-400 italic">
                        Data benchmark belum tersedia. Silakan jalankan simulasi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Panggil fungsi render insight pintar di sini */}
            {renderInsight()}

          </section>

        </div>
      </div>
    </div>
  );
}