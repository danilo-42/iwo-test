import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { IWORunHistory } from '../types';

interface Props {
  history: IWORunHistory[];
  currentIteration: number;
}

export const ConvergenceChart: React.FC<Props> = ({ history, currentIteration }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg h-[350px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-6 bg-purple-500 rounded-sm"></span>
            Fitness Convergence
        </h3>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            The <span className="text-purple-400 font-mono">Cost Function</span> represents the "unfitness" of the solution. 
            The algorithm minimizes this value (Negative Sharpe Ratio). 
            A steep drop indicates rapid learning; flattening indicates convergence to an optimum.
        </p>
      </div>
      
      <div className="flex-grow w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
                dataKey="iteration" 
                stroke="#64748b" 
                tick={{fontSize: 10}}
                label={{ value: 'Iteration (Generations)', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
            />
            <YAxis 
                stroke="#64748b" 
                tick={{fontSize: 10}}
                domain={['auto', 'auto']}
                width={30}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                labelStyle={{ color: '#94a3b8' }}
                formatter={(val: number) => [val.toFixed(4), 'Cost']}
            />
            <ReferenceLine x={currentIteration} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'NOW', fill: '#10b981', fontSize: 10, position: 'top' }} />
            <Line 
                type="monotone" 
                dataKey="best_cost" 
                stroke="#8b5cf6" 
                strokeWidth={2} 
                dot={false} 
                isAnimationActive={false} // Disable internal animation for smooth scrubbing
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};