import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { Asset } from '../types';

interface Props {
  assets: Asset[];
  baseWeights: number[];
  iwoWeights: number[];
}

export const AllocationChart: React.FC<Props> = ({ assets, baseWeights, iwoWeights }) => {
  const data = assets.map((asset, i) => ({
    ticker: asset.ticker,
    Baseline: baseWeights[i],
    IWO: iwoWeights[i],
  })).sort((a, b) => b.IWO - a.IWO); // Sort by IWO importance

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg h-[300px]">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-orange-500 rounded-sm"></span>
        Weight Allocation Comparison
      </h3>
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
                dataKey="ticker" 
                stroke="#94a3b8" 
                tick={{fontSize: 10}}
            />
            <YAxis 
                stroke="#94a3b8" 
                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                tick={{fontSize: 10}}
            />
            <Tooltip 
                cursor={{fill: '#334155', opacity: 0.4}}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                formatter={(value: number) => [`${(value * 100).toFixed(2)}%`]}
            />
            <Legend />
            <Bar dataKey="Baseline" fill="#94a3b8" fillOpacity={0.3} radius={[4, 4, 0, 0]} />
            <Bar dataKey="IWO" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};