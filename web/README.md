# LogisRoute - Surabaya Logistics Routing Optimization

An interactive web dashboard built with Next.js and TypeScript to visualize and benchmark Shortest Path algorithms (Dijkstra vs. Bellman-Ford) using a realistic map of Surabaya. This project is created for the Design and Analysis of Algorithms (DAA) Final Exam.

## Core Features
- **Live Visualizer (Surabaya Map):** Simulates real-world package delivery routing across 12 strategic areas in Surabaya, starting from the Rungkut Central Warehouse.
- **Engine Benchmark:** Compares the execution runtime of Dijkstra and Bellman-Ford across 5 distinct scales (100, 500, 1000, 2500, and 5000 vertices) to observe real-world performance.
- **Dynamic Insight Box:** Automatically analyzes and explains performance anomalies directly on the user interface after running the benchmark.

## How to Run and Reproduce
Follow these simple steps to run the application locally on your machine:

1. Clone this repository and navigate into the project directory:
   ```bash
   cd Fp_PAA_LogisRoute/web

2. Install all the required dependencies:
   ```bash
   npm install

3. Start the local development server:
   ```bash
   npm run dev, lalu ke http://localhost:3000