
import React from 'react';
import type { DreamAnalysis as DreamAnalysisType, DreamSymbol } from '../types';

interface DreamAnalysisProps {
  analysis: DreamAnalysisType;
}

const SymbolCard: React.FC<{ item: DreamSymbol }> = ({ item }) => (
  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 transition-all duration-300 hover:border-purple-500 hover:scale-105">
    <h4 className="text-lg font-semibold text-purple-300">{item.symbol}</h4>
    <p className="text-slate-300 text-sm mt-1">{item.meaning}</p>
  </div>
);

const ThemeTag: React.FC<{ theme: string }> = ({ theme }) => (
  <span className="inline-block bg-indigo-500/20 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full border border-indigo-500">
    {theme}
  </span>
);

export const DreamAnalysis: React.FC<DreamAnalysisProps> = ({ analysis }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/40 p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-800 backdrop-blur-sm animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-4">
        {analysis.title}
      </h2>
      <p className="text-slate-300 text-center mb-8 italic">{analysis.summary}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold text-slate-100 mb-4 border-b-2 border-purple-500/50 pb-2">Key Symbols</h3>
          <div className="flex flex-col gap-4">
            {analysis.symbols.map((item, index) => (
              <SymbolCard key={index} item={item} />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-semibold text-slate-100 mb-4 border-b-2 border-indigo-500/50 pb-2">Underlying Themes</h3>
          <div className="flex flex-wrap gap-2 items-start">
            {analysis.themes.map((theme, index) => (
              <ThemeTag key={index} theme={theme} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
