import React from 'react';
import { Play, Pause, SkipBack, SkipForward, FastForward, Rewind } from 'lucide-react';

interface Props {
  currentIteration: number;
  maxIterations: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (val: number) => void;
  speed: number;
  onSpeedChange: () => void;
}

export const SimulationController: React.FC<Props> = ({ 
  currentIteration, 
  maxIterations, 
  isPlaying, 
  onPlayPause, 
  onSeek,
  speed,
  onSpeedChange
}) => {
  return (
    <div className="bg-slate-900 border-t border-slate-800 p-4 fixed bottom-0 left-0 right-0 z-50 backdrop-blur-lg bg-opacity-90 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
        
        {/* Playback Controls */}
        <div className="flex items-center gap-4">
            <button 
                onClick={() => onSeek(0)}
                className="text-slate-400 hover:text-white transition-colors"
                title="Reset"
            >
                <SkipBack size={20} />
            </button>
            <button 
                onClick={onPlayPause}
                className={`w-12 h-12 flex items-center justify-center rounded-full transition-all ${isPlaying ? 'bg-amber-500 hover:bg-amber-400 text-slate-900' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'} shadow-[0_0_15px_rgba(16,185,129,0.4)]`}
            >
                {isPlaying ? <Pause fill="currentColor" size={20} /> : <Play fill="currentColor" className="ml-1" size={20} />}
            </button>
            <button 
                onClick={onSpeedChange}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 min-w-[60px] font-mono text-xs border border-slate-700 rounded px-2 py-1"
                title="Playback Speed"
            >
                <FastForward size={14} /> {speed}x
            </button>
        </div>

        {/* Scrubber */}
        <div className="flex-grow w-full flex flex-col gap-2">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
                <span>Initialization (High Entropy)</span>
                <span className={`${currentIteration > 10 ? 'text-blue-400' : ''}`}>Reproduction</span>
                <span className={`${currentIteration > 30 ? 'text-emerald-400' : ''}`}>Competitive Exclusion</span>
                <span className={`${currentIteration === maxIterations ? 'text-emerald-400' : ''}`}>Convergence</span>
            </div>
            <input 
                type="range" 
                min="0" 
                max={maxIterations} 
                value={currentIteration} 
                onChange={(e) => onSeek(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
            />
            <div className="flex justify-between text-xs font-mono text-slate-500">
                <span>Iter: {currentIteration}</span>
                <span>Max: {maxIterations}</span>
            </div>
        </div>

        {/* Stats Badge */}
        <div className="hidden md:block min-w-[200px]">
             <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Status</div>
             <div className={`text-sm font-semibold flex items-center gap-2 ${currentIteration === maxIterations ? 'text-emerald-400' : 'text-blue-400'}`}>
                <span className={`w-2 h-2 rounded-full ${isPlaying ? 'animate-ping bg-emerald-500' : 'bg-slate-500'}`}></span>
                {currentIteration === 0 ? 'Seeding Population' : 
                 currentIteration === maxIterations ? 'Optimization Complete' : 'Evolving...'}
             </div>
        </div>

      </div>
    </div>
  );
};