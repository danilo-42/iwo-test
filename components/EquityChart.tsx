import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SimulationResult } from '../types';

interface Props {
  data: SimulationResult;
}

export const EquityChart: React.FC<Props> = ({ data }) => {
  // Merge data for Recharts
  const chartData = data.baseline.equity_curve.map((point, index) => ({
    date: point.date,
    Baseline: point.value,
    IWO: data.iwo_best.equity_curve[index]?.value || point.value,
  }));

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg h-[350px] flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-sm"></span>
            Wealth Generation
        </h3>
        <p className="text-slate-400 text-xs mt-1">
            Comparing the growth of $1 invested in the <span className="text-slate-300">Baseline (Equal Weight)</span> versus the <span className="text-emerald-400">IWO Optimized Strategy</span>. 
            The gap between lines represents the value added by the algorithm (Alpha).
        </p>
      </div>

      <div className="flex-grow w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                tick={{fontSize: 10}}
                tickFormatter={(val) => val.split(' ')[1] ? `D${val.split(' ')[1]}` : val}
            />
            <YAxis 
                stroke="#94a3b8" 
                domain={['auto', 'auto']} 
                tick={{fontSize: 10}}
                tickFormatter={(val) => `$${val.toFixed(2)}`}
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                itemStyle={{ color: '#f1f5f9' }}
                formatter={(val: number) => [`$${val.toFixed(3)}`, '']}
            />
            <Legend verticalAlign="top" height={36}/>
            <Line 
                name="Benchmark (Equal Weight)"
                type="monotone" 
                dataKey="Baseline" 
                stroke="#94a3b8" 
                strokeWidth={2} 
                dot={false}
                strokeDasharray="5 5"
            />
            <Line 
                name="IWO Optimized"
                type="monotone" 
                dataKey="IWO" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};