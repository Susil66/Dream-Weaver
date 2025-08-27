
import React from 'react';
import type { DreamRecord } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';
import { TrashIcon } from './icons/TrashIcon';

interface DreamHistoryProps {
  history: DreamRecord[];
  onSelectDream: (dream: DreamRecord) => void;
  onClear: () => void;
}

export const DreamHistory: React.FC<DreamHistoryProps> = ({ history, onSelectDream, onClear }) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 animate-fade-in">
      <div className="bg-slate-800/30 p-4 sm:p-6 rounded-xl border border-slate-700/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-3 text-xl font-semibold text-slate-200">
            <HistoryIcon className="w-6 h-6 text-purple-400" />
            Dream Archive
          </h3>
          <button 
            onClick={onClear} 
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors px-3 py-1 rounded-md hover:bg-red-500/10"
            aria-label="Clear dream history"
          >
            <TrashIcon className="w-4 h-4" />
            Clear
          </button>
        </div>
        <ul className="space-y-2 max-h-[22rem] overflow-y-auto pr-2 -mr-2">
          {history.map(dream => (
            <li key={dream.id}>
              <button 
                onClick={() => onSelectDream(dream)}
                className="w-full text-left p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800 hover:border-purple-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label={`View dream titled: ${dream.analysis.title}`}
              >
                <p className="font-semibold text-purple-300 truncate">{dream.analysis.title}</p>
                <p className="text-xs text-slate-400 mt-1 truncate">{dream.analysis.summary}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
