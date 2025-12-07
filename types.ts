export interface Asset {
  ticker: string;
  name: string;
  sector: string;
  color: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
}

export interface PortfolioMetrics {
  annual_return: number;
  volatility: number;
  sharpe: number;
  max_drawdown: number;
}

export interface Plant {
  id: string;
  weights: number[];
  metrics: PortfolioMetrics;
  fitness: number; // Cost function value
}

export interface IterationData {
  iteration: number;
  plants: Plant[]; // The entire population of weeds for this generation
  bestPlant: Plant; // The fittest weed
  sigma: number; // The current standard deviation (SD) used for dispersal
}

export interface SimulationConfig {
  maxIterations: number;
  populationSize: number;
  initialSigma: number;
}

export interface SimulationData {
  config: SimulationConfig;
  assets: Asset[];
  baseline: {
    weights: number[];
    metrics: PortfolioMetrics;
    equity_curve: TimeSeriesPoint[];
  };
  history: IterationData[]; // Full history of the optimization
}

export interface IWORunHistory {
  iteration: number;
  best_cost: number;
}

export interface SimulationResult {
  assets: Asset[];
  baseline: {
    weights: number[];
    metrics: PortfolioMetrics;
    equity_curve: TimeSeriesPoint[];
  };
  iwo_best: {
    weights: number[];
    metrics: PortfolioMetrics;
    equity_curve: TimeSeriesPoint[];
  };
  iwo_history: IWORunHistory[];
}