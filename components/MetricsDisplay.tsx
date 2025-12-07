import React from 'react';
import { PortfolioMetrics } from '../types';
import { TrendingUp, Activity, ShieldAlert, BarChart2, Info } from 'lucide-react';

interface Props {
  baseline: PortfolioMetrics;
  iwo: PortfolioMetrics;
}

const MetricCard: React.FC<{
  title: string;
  description: string;
  baseValue: number;
  iwoValue: number;
  icon: React.ReactNode;
  format?: 'percent' | 'number';
  inverse?: boolean; // If true, lower is better (e.g. Drawdown, Volatility)
}> = ({ title, description, baseValue, iwoValue, icon, format = 'percent', inverse = false }) => {
  const diff = iwoValue - baseValue;
  const isImprovement = inverse ? diff < 0 : diff > 0;
  
  const fmt = (v: number) => 
    format === 'percent' 
      ? `${(v * 100).toFixed(2)}%` 
      : v.toFixed(2);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg relative group hover:border-slate-600 transition-colors">
      <div className="absolute top-0 right-0 p-4 opacity-10 text-slate-100 group-hover:opacity-20 transition-opacity pointer-events-none">
        {icon}
      </div>
      
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-slate-300 text-sm font-bold uppercase tracking-wider">{title}</h3>
        <div className="group/info relative">
            <Info size={12} className="text-slate-600 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 w-56 bg-slate-900 border border-slate-600 p-3 rounded-lg text-xs text-slate-200 shadow-2xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-50 pointer-events-none transform -translate-x-4">
                {description}
            </div>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 mb-3 h-8 leading-tight">{description}</p>
      
      <div className="flex items-end justify-between">
        <div>
            <div className="text-2xl font-bold text-white mb-1 flex items-baseline gap-2">
                {fmt(iwoValue)}
                {isImprovement && <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">Optimized</span>}
            </div>
            <div className="text-xs font-mono text-slate-500">
                vs Baseline: {fmt(baseValue)}
            </div>
        </div>
        
        <div className={`text-xs font-bold font-mono px-2 py-1 rounded-md border ${isImprovement ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
           {diff > 0 ? '+' : ''}{fmt(diff)}
        </div>
      </div>
    </div>
  );
};

export const MetricsDisplay: React.FC<Props> = ({ baseline, iwo }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard 
        title="Annual Return" 
        description="The expected compound annual growth rate (CAGR) of the portfolio based on historical data."
        baseValue={baseline.annual_return} 
        iwoValue={iwo.annual_return} 
        icon={<TrendingUp size={48} />} 
      />
      <MetricCard 
        title="Sharpe Ratio" 
        description="Return per unit of risk. Higher is better. A Sharpe > 1.0 is considered good."
        baseValue={baseline.sharpe} 
        iwoValue={iwo.sharpe} 
        format="number"
        icon={<BarChart2 size={48} />} 
      />
      <MetricCard 
        title="Volatility" 
        description="Standard deviation of returns. Measures the risk or price stability of the portfolio."
        baseValue={baseline.volatility} 
        iwoValue={iwo.volatility} 
        inverse
        icon={<Activity size={48} />} 
      />
      <MetricCard 
        title="Max Drawdown" 
        description="The maximum observed loss from a peak to a trough. Measures worst-case downside."
        baseValue={baseline.max_drawdown} 
        iwoValue={iwo.max_drawdown} 
        inverse
        icon={<ShieldAlert size={48} />} 
      />
    </div>
  );
};