
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface DreamInputProps {
  dreamDescription: string;
  setDreamDescription: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const DreamInput: React.FC<DreamInputProps> = ({ dreamDescription, setDreamDescription, onSubmit, isLoading }) => {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
      <textarea
        value={dreamDescription}
        onChange={(e) => setDreamDescription(e.target.value)}
        placeholder="Describe your dream... the colors, feelings, scenes, and characters."
        className="w-full h-48 p-4 bg-slate-800/50 border-2 border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 resize-none shadow-lg focus:shadow-purple-500/20"
        disabled={isLoading}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !dreamDescription.trim()}
        className="group relative inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-purple-500/40 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-75"
      >
        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white opacity-10 rounded-full group-hover:w-56 group-hover:h-56"></span>
        <SparklesIcon className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
        <span className="relative">
          {isLoading ? 'Weaving...' : 'Weave My Dream'}
        </span>
      </button>
    </div>
  );
};
