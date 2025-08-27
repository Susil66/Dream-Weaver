
import React from 'react';
import type { LoadingState } from '../types';

interface LoaderProps {
  loadingState: LoadingState;
}

const messages: Record<LoadingState, string> = {
  analyzing: 'Interpreting the echoes of your mind...',
  visualizing: 'Weaving the threads of your dream into art...',
  idle: '',
  done: '',
  error: '',
};

export const Loader: React.FC<LoaderProps> = ({ loadingState }) => {
  if (loadingState === 'idle' || loadingState === 'done' || loadingState === 'error') return null;

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-500 border-t-purple-400"></div>
        <div className="absolute inset-2 animate-pulse rounded-full bg-purple-500/20"></div>
      </div>
      <p className="text-lg text-purple-300 font-medium tracking-wide">
        {messages[loadingState]}
      </p>
    </div>
  );
};
