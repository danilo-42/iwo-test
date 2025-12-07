import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ReferenceLine } from 'recharts';
import { IterationData, Plant } from '../types';

interface Props {
  currentData: IterationData;
  baselineMetrics: { volatility: number; annual_return: number };
}

export const OptimizationLandscape: React.FC<Props> = ({ currentData, baselineMetrics }) => {
  const data = currentData.plants.map(p => ({
    x: p.metrics.volatility,
    y: p.metrics.annual_return,
    z: p.metrics.sharpe, // For coloring
    isBest: p.id === currentData.bestPlant.id
  }));

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg h-[550px] flex flex-col">
      
      {/* Header Section (Non-overlapping) */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-4 border-b border-slate-700/50 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-6 bg-violet-500 rounded-sm shadow-[0_0_10px_rgba(139,92,246,0.5)]"></span>
              Search Landscape (Risk vs. Return)
          </h3>
          <p className="text-slate-400 text-xs mt-1 max-w-lg">
             Each dot is a "weed" (portfolio). The IWO algorithm disperses them to find the <span className="text-violet-400">Efficient Frontier</span> (Top Left).
          </p>
        </div>
        
        <div className="flex items-center gap-6 mt-4 md:mt-0">
             <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Dispersal (Sigma)</div>
                <div className="text-xl font-mono text-violet-300 font-bold">
                    {(currentData.sigma * 100).toFixed(2)}%
                </div>
             </div>
             <div className="text-right border-l border-slate-700 pl-4">
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Population</div>
                <div className="text-xl font-mono text-slate-200 font-bold">
                    {currentData.plants.length}
                </div>
             </div>
        </div>
      </div>

      <div className="flex-grow w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
                type="number" 
                dataKey="x" 
                name="Volatility" 
                unit="" 
                stroke="#64748b" 
                label={{ value: 'Risk (Volatility) → Lower is Better', position: 'insideBottom', offset: -20, fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                tickFormatter={(v) => `${(v*100).toFixed(0)}%`}
                domain={[0, 'auto']}
                tick={{fontSize: 11}}
            />
            <YAxis 
                type="number" 
                dataKey="y" 
                name="Return" 
                unit="" 
                stroke="#64748b" 
                label={{ value: 'Annual Return → Higher is Better', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                tickFormatter={(v) => `${(v*100).toFixed(0)}%`}
                domain={[0, 'auto']}
                tick={{fontSize: 11}}
            />
            <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px' }}
                formatter={(value: number, name: string) => [`${(value * 100).toFixed(2)}%`, name]}
            />
            
            {/* Baseline Reference */}
            <ReferenceLine x={baselineMetrics.volatility} stroke="#64748b" strokeDasharray="3 3" label={{ value: 'Baseline', position: 'top', fill: '#64748b', fontSize: 10}} />
            <ReferenceLine y={baselineMetrics.annual_return} stroke="#64748b" strokeDasharray="3 3" />

            {/* The Population */}
            <Scatter name="Weeds" data={data} animationDuration={300}>
              {data.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isBest ? '#10b981' : `rgba(139, 92, 246, ${0.4 + (entry.z * 0.3)})`} 
                    stroke={entry.isBest ? '#fff' : 'none'}
                    strokeWidth={entry.isBest ? 2 : 0}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Legend Overlay - Moved to bottom right corner, smaller */}
        <div className="absolute bottom-10 right-0 bg-slate-900/90 border border-slate-700 rounded p-2 text-[10px] shadow-xl pointer-events-none">
            <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white"></span>
                <span className="text-slate-200">Best Solution</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500/60"></span>
                <span className="text-slate-400">Colony</span>
            </div>
        </div>
      </div>
    </div>
  );
};