import { SimulationResult } from './types';

// This simulates the JSON output from the Python `run_iwo_portfolio.py` script
export const MOCK_DATA: SimulationResult = {
  assets: [
    { ticker: "AAPL", name: "Apple Inc.", sector: "Tech", color: "#60a5fa" },
    { ticker: "MSFT", name: "Microsoft", sector: "Tech", color: "#3b82f6" },
    { ticker: "AMZN", name: "Amazon", sector: "Cons. Disc.", color: "#f59e0b" },
    { ticker: "GOOGL", name: "Alphabet", sector: "Tech", color: "#2563eb" },
    { ticker: "JPM", name: "JPMorgan", sector: "Financials", color: "#8b5cf6" },
    { ticker: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", color: "#ec4899" },
    { ticker: "PG", name: "Procter & Gamble", sector: "Cons. Staples", color: "#f472b6" },
    { ticker: "XOM", name: "Exxon Mobil", sector: "Energy", color: "#6366f1" },
    { ticker: "NVDA", name: "Nvidia", sector: "Tech", color: "#10b981" },
    { ticker: "TSLA", name: "Tesla", sector: "Cons. Disc.", color: "#ef4444" },
  ],
  baseline: {
    weights: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], // Equal weight
    equity_curve: Array.from({ length: 30 }, (_, i) => ({
      date: `2023-01-${i + 1}`,
      value: 1 + (i * 0.002) + (Math.random() * 0.02 - 0.01),
    })),
    metrics: {
      annual_return: 0.08,
      volatility: 0.15,
      sharpe: 0.53,
      max_drawdown: -0.12,
    },
  },
  iwo_best: {
    weights: [0.25, 0.15, 0.05, 0.05, 0.12, 0.08, 0.02, 0.03, 0.20, 0.05], // Optimized
    equity_curve: Array.from({ length: 30 }, (_, i) => ({
      date: `2023-01-${i + 1}`,
      value: 1 + (i * 0.005) + (Math.random() * 0.015 - 0.005),
    })),
    metrics: {
      annual_return: 0.18,
      volatility: 0.11,
      sharpe: 1.63,
      max_drawdown: -0.05,
    },
  },
  iwo_history: Array.from({ length: 50 }, (_, i) => ({
    iteration: i + 1,
    best_cost: 2.0 * Math.exp(-0.1 * i) + 0.5 + (Math.random() * 0.05),
  })),
};