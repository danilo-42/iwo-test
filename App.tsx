import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Sprout, FileText } from 'lucide-react';
import { generateSimulationData, DEFAULT_CONFIG } from './simulation';
import { MetricsDisplay } from './components/MetricsDisplay';
import { EquityChart } from './components/EquityChart';
import { WeedEcosystem } from './components/WeedEcosystem';
import { ConvergenceChart } from './components/ConvergenceChart';
import { SimulationController } from './components/SimulationController';
import { OptimizationLandscape } from './components/OptimizationLandscape';
import { ProjectIntro } from './components/ProjectIntro';
import { SimulationConfig } from './types';

const App: React.FC = () => {
  // --- State ---
  const [simData, setSimData] = useState(() => generateSimulationData(DEFAULT_CONFIG));
  const [currentIteration, setCurrentIteration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<number | null>(null);

  // Derived state for the current frame
  const currentFrame = simData.history[currentIteration] || simData.history[0];
  const bestPlantSoFar = currentFrame.bestPlant;
  
  // Prepare history for convergence chart
  const costHistory = useMemo(() => simData.history.map(h => ({
    iteration: h.iteration,
    best_cost: -h.bestPlant.metrics.sharpe // Revert the negation we did in generation
  })), [simData]);

  // --- Handlers ---
  const handleRunSimulation = (config: SimulationConfig) => {
    setIsPlaying(false);
    const newData = generateSimulationData(config);
    setSimData(newData);
    setCurrentIteration(0);
    // Auto start
    setTimeout(() => setIsPlaying(true), 100);
  };

  // --- Animation Loop ---
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentIteration(prev => {
          if (prev >= simData.history.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 500 / speed); // Base 500ms divided by speed
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, simData.history.length]);

  const handlePlayPause = () => {
    if (currentIteration >= simData.history.length - 1) {
        setCurrentIteration(0); // Restart if at end
        setIsPlaying(true);
    } else {
        setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (val: number) => {
    setCurrentIteration(val);
    if (isPlaying) setIsPlaying(false); // Pause on seek
  };

  const handleSpeedChange = () => {
    setSpeed(prev => {
        if (prev === 1) return 2;
        if (prev === 2) return 5;
        if (prev === 5) return 10;
        return 1;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-32"> {/* Extra padding for footer */}
      
      {/* Navbar */}
      <header className="bg-slate-900/80 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg shadow-lg shadow-emerald-500/20">
                <Sprout className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">IWO Portfolio Evolution</h1>
              <p className="text-xs text-slate-400">Algorithmic Asset Allocation &bull; <span className="text-emerald-400 font-mono">v1.1 Academic Demo</span></p>
            </div>
          </div>
          <nav className="hidden md:flex gap-1">
             <div className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400">
                Iter: <span className="text-white">{currentIteration} / {simData.config.maxIterations}</span>
             </div>
             <div className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-slate-400 ml-2">
                Pop: <span className="text-white">{simData.config.populationSize}</span>
             </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Intro & Config */}
        <ProjectIntro onRunSimulation={handleRunSimulation} defaultConfig={DEFAULT_CONFIG} />

        {/* HERO SECTION: The Field & The Ecosystem */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OptimizationLandscape 
                currentData={currentFrame} 
                baselineMetrics={simData.baseline.metrics} 
            />
            <WeedEcosystem 
                assets={simData.assets} 
                weights={bestPlantSoFar.weights}
                title="Dominant Species (Weights)"
            />
        </section>

        {/* METRICS & ALLOCATION */}
        <section>
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FileText size={18} className="text-emerald-500" />
                Live Performance Metrics
             </h2>
          </div>
          <MetricsDisplay baseline={simData.baseline.metrics} iwo={bestPlantSoFar.metrics} />
        </section>

        {/* CHARTS ROW */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConvergenceChart history={costHistory} currentIteration={currentIteration} />
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg h-[350px] flex flex-col justify-center items-center text-slate-400">
                {/* Reusing EquityChart but wrapping slightly to fit data shape */}
                <EquityChart 
                    data={{
                        assets: simData.assets,
                        baseline: simData.baseline,
                        iwo_best: {
                            weights: bestPlantSoFar.weights,
                            metrics: bestPlantSoFar.metrics,
                            // In a real app we'd simulate a curve for every iteration, 
                            // here we mock it by perturbing the baseline based on current metrics
                            equity_curve: simData.baseline.equity_curve.map(pt => ({
                                date: pt.date,
                                value: pt.value * (1 + (bestPlantSoFar.metrics.annual_return - simData.baseline.metrics.annual_return) * (simData.baseline.equity_curve.indexOf(pt)/30))
                            }))
                        },
                        iwo_history: costHistory
                    }} 
                />
            </div>
        </section>
        
        <section className="h-24"></section> {/* Spacer for footer */}

      </main>

      {/* FOOTER CONTROLS */}
      <SimulationController 
        currentIteration={currentIteration} 
        maxIterations={simData.config.maxIterations} 
        isPlaying={isPlaying} 
        onPlayPause={handlePlayPause}
        onSeek={handleSeek}
        speed={speed}
        onSpeedChange={handleSpeedChange}
      />
    </div>
  );
};

export default App;