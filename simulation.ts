import { Asset, SimulationData, IterationData, Plant, PortfolioMetrics, TimeSeriesPoint, SimulationConfig } from './types';

const ASSETS: Asset[] = [
  { ticker: "AAPL", name: "Apple Inc.", sector: "Tech", color: "#60a5fa" },
  { ticker: "MSFT", name: "Microsoft Corp.", sector: "Tech", color: "#3b82f6" },
  { ticker: "GOOGL", name: "Alphabet Inc.", sector: "Tech", color: "#2563eb" },
  { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumer", color: "#f59e0b" },
  { ticker: "TSLA", name: "Tesla Inc.", sector: "Consumer", color: "#ef4444" },
  { ticker: "NVDA", name: "Nvidia Corp.", sector: "Tech", color: "#10b981" },
  { ticker: "JPM", name: "JPMorgan Chase", sector: "Finance", color: "#8b5cf6" },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Health", color: "#ec4899" },
  { ticker: "XOM", name: "Exxon Mobil", sector: "Energy", color: "#6366f1" },
  { ticker: "GLD", name: "SPDR Gold Shares", sector: "Commodity", color: "#fbbf24" },
];

const NUM_ASSETS = ASSETS.length;

export const DEFAULT_CONFIG: SimulationConfig = {
  maxIterations: 50,
  populationSize: 30,
  initialSigma: 0.5
};

// Helper to generate a random equity curve based on return/volatility
const generateEquityCurve = (annualReturn: number, volatility: number): TimeSeriesPoint[] => {
  let value = 1.0;
  const days = 100; // Small window for demo smoothness
  const dt = 1 / 252;
  const drift = (annualReturn - 0.5 * volatility * volatility) * dt;
  const vol = volatility * Math.sqrt(dt);
  
  return Array.from({ length: days }, (_, i) => {
    const shock = (Math.random() + Math.random() + Math.random() + Math.random() - 2); // approx normal
    value = value * Math.exp(drift + vol * shock);
    return {
      date: `Day ${i}`,
      value: value
    };
  });
};

// Helper to calculate metrics for a set of weights (simulation)
const calculateMetrics = (weights: number[]): PortfolioMetrics => {
  // We simulate "truth" by assigning arbitrary return/risk profiles to indices
  let expReturn = 0;
  let riskScore = 0;
  
  weights.forEach((w, i) => {
    if ([0, 1, 2, 5].includes(i)) { expReturn += w * 0.25; riskScore += w * 0.30; } // Tech
    else if ([3, 4].includes(i)) { expReturn += w * 0.15; riskScore += w * 0.20; } // Consumer
    else if ([8, 9].includes(i)) { expReturn += w * 0.05; riskScore += w * 0.10; } // Defensive
    else { expReturn += w * 0.10; riskScore += w * 0.15; }
  });

  const concentration = weights.reduce((acc, w) => acc + w * w, 0);
  const diversificationBonus = (1 - concentration) * 0.05; 
  const volatilityReduction = (1 - concentration) * 0.10;

  const finalReturn = expReturn + diversificationBonus;
  const finalVol = Math.max(0.05, riskScore - volatilityReduction);
  
  return {
    annual_return: finalReturn,
    volatility: finalVol,
    sharpe: (finalReturn - 0.02) / finalVol, // Risk free 2%
    max_drawdown: -1.5 * finalVol // Approximation
  };
};

const normalizeWeights = (weights: number[]) => {
  const sum = weights.reduce((a, b) => a + Math.abs(b), 0);
  return weights.map(w => Math.abs(w) / (sum || 1));
};

export const generateSimulationData = (config: SimulationConfig = DEFAULT_CONFIG): SimulationData => {
  const { maxIterations, populationSize, initialSigma } = config;
  
  // 1. Define a "Global Optimum" 
  const optimalWeights = [0.15, 0.15, 0.1, 0.05, 0.05, 0.20, 0.05, 0.05, 0.1, 0.1];
  
  const history: IterationData[] = [];

  for (let iter = 0; iter <= maxIterations; iter++) {
    // IWO Logic: Sigma decreases non-linearly
    // sigma(iter) = ((max - iter) / max)^n * (sigma_init - sigma_final) + sigma_final
    const progress = iter / maxIterations;
    const n = 3; // Modulation index from paper
    const sigma = Math.pow(((maxIterations - iter)/maxIterations), n) * (initialSigma - 0.001) + 0.001;

    const plants: Plant[] = [];

    for (let p = 0; p < populationSize; p++) {
      let weights: number[];

      if (iter === 0) {
        // Random initialization
        weights = normalizeWeights(Array.from({ length: NUM_ASSETS }, () => Math.random()));
      } else {
        // Disperse from previous generation's best (Simulated logic for demo)
        const prevBest = history[iter - 1].bestPlant.weights;
        const center = prevBest.map((w, i) => w + (optimalWeights[i] - w) * (0.05));
        
        // Add Gaussian noise based on Sigma
        weights = center.map(w => w + (Math.random() - 0.5) * sigma * 4);
        weights = normalizeWeights(weights.map(w => Math.max(0, w))); // Long only
      }

      const metrics = calculateMetrics(weights);
      const fitness = -metrics.sharpe; 

      plants.push({
        id: `gen${iter}-p${p}`,
        weights,
        metrics,
        fitness
      });
    }

    plants.sort((a, b) => a.fitness - b.fitness);
    
    history.push({
      iteration: iter,
      plants,
      bestPlant: plants[0],
      sigma
    });
  }

  const equalWeights = Array(NUM_ASSETS).fill(1/NUM_ASSETS);
  const baseMetrics = calculateMetrics(equalWeights);

  return {
    config,
    assets: ASSETS,
    baseline: {
      weights: equalWeights,
      metrics: baseMetrics,
      equity_curve: generateEquityCurve(baseMetrics.annual_return, baseMetrics.volatility)
    },
    history
  };
};