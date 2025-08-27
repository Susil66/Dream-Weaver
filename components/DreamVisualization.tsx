
import React from 'react';

interface DreamVisualizationProps {
  imageUrl: string;
}

export const DreamVisualization: React.FC<DreamVisualizationProps> = ({ imageUrl }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-in">
       <h3 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-6">
        Your Dream, Visualized
      </h3>
      <div className="aspect-video bg-slate-800/50 rounded-lg shadow-2xl shadow-purple-900/20 overflow-hidden border-2 border-slate-700">
        <img 
          src={imageUrl} 
          alt="A visualization of the dream" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
