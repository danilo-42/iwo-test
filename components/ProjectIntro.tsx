import React, { useState } from 'react';
import { Sprout, BarChart, Settings, PlayCircle, BookOpen, GitBranch, Target } from 'lucide-react';
import { SimulationConfig } from '../types';

interface Props {
  onRunSimulation: (config: SimulationConfig) => void;
  defaultConfig: SimulationConfig;
}

export const ProjectIntro: React.FC<Props> = ({ onRunSimulation, defaultConfig }) => {
  const [config, setConfig] = useState<SimulationConfig>(defaultConfig);

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-2xl mb-8 relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none overflow-hidden"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Academic Description */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3 flex items-center gap-3">
              <Sprout className="text-emerald-500" size={32} />
              Invasive Weed Optimization (IWO)
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-emerald-500 to-emerald-800 rounded-full"></div>
            <p className="text-slate-400 mt-2 font-mono text-sm">
              Bio-inspired Metaheuristic for Portfolio Optimization
            </p>
          </div>
          
          <div className="prose prose-invert prose-sm max-w-none text-slate-300 space-y-4">
            <p className="leading-relaxed">
              This simulation applies the <strong className="text-white">Invasive Weed Optimization (IWO)</strong> algorithm to the financial problem of 
              <span className="text-blue-300"> Portfolio Selection</span>. Originally proposed by Mehrabian and Lucas (2006), IWO mimics the ecological behavior 
              of colonizing weeds to perform a powerful numerical search in high-dimensional spaces.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-base">
                  <Target size={18} className="text-blue-400" />
                  The Optimization Problem
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  We seek the optimal vector of weights <code className="bg-slate-900 px-1 py-0.5 rounded text-blue-300">w = [w1, ..., wn]</code> for a set of assets.
                  The goal is to maximize the <strong>Sharpe Ratio</strong> (Risk-Adjusted Return) while satisfying constraints:
                </p>
                <ul className="list-disc list-inside mt-2 text-xs text-slate-500 space-y-1 ml-1">
                  <li>Sum of weights = 1.0 (Fully Invested)</li>
                  <li>Weights &ge; 0 (Long-only, no shorts)</li>
                  <li>Weights &le; Limit (Diversification constraint)</li>
                </ul>
              </div>
              
              <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 transition-colors">
                <h3 className="font-bold text-white mb-3 flex items-center gap-2 text-base">
                  <GitBranch size={18} className="text-emerald-400" />
                  Algorithm Mechanics
                </h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-xs">
                    <span className="bg-emerald-900/50 text-emerald-400 px-1.5 py-0.5 rounded font-mono h-fit">1</span>
                    <span>
                      <strong className="text-slate-200">Initialization:</strong> A population of random seeds (portfolios) is dispersed over the search space.
                    </span>
                  </li>
                  <li className="flex gap-3 text-xs">
                    <span className="bg-emerald-900/50 text-emerald-400 px-1.5 py-0.5 rounded font-mono h-fit">2</span>
                    <span>
                      <strong className="text-slate-200">Reproduction:</strong> Plants grow and produce seeds based on fitness. Higher Sharpe Ratio = More Seeds.
                    </span>
                  </li>
                  <li className="flex gap-3 text-xs">
                    <span className="bg-emerald-900/50 text-emerald-400 px-1.5 py-0.5 rounded font-mono h-fit">3</span>
                    <span>
                      <strong className="text-slate-200">Spatial Dispersal:</strong> Seeds land near the parent. The standard deviation (<span className="font-serif italic">σ</span>) 
                      shrinks over time (Non-linear Modulation), shifting the colony from <em>Global Exploration</em> to <em>Local Exploitation</em>.
                    </span>
                  </li>
                  <li className="flex gap-3 text-xs">
                    <span className="bg-emerald-900/50 text-emerald-400 px-1.5 py-0.5 rounded font-mono h-fit">4</span>
                    <span>
                      <strong className="text-slate-200">Competitive Exclusion:</strong> If population exceeds the maximum, only the fittest plants survive to the next generation.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col h-full shadow-inner">
          <div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-700">
              <Settings size={20} className="text-slate-400" />
              Experiment Config
            </h3>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Max Iterations
                  </label>
                  <span className="text-emerald-400 font-mono text-sm">{config.maxIterations}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="10"
                  value={config.maxIterations}
                  onChange={(e) => setConfig({...config, maxIterations: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>10</span>
                  <span>1000</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  Higher iterations allow the colony to converge more precisely on the global optimum (the "Efficient Frontier").
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Population Size (P_max)
                  </label>
                  <span className="text-blue-400 font-mono text-sm">{config.populationSize}</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  step="5"
                  value={config.populationSize}
                  onChange={(e) => setConfig({...config, populationSize: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                 <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>10</span>
                  <span>200</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  The maximum number of plants allowed in the colony. Larger populations maintain diversity but increase computation time.
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onRunSimulation(config)}
            className="mt-auto pt-6 w-full group"
          >
            <div className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
              <PlayCircle size={24} className="group-hover:animate-pulse" />
              <span>Initialize Simulation</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};