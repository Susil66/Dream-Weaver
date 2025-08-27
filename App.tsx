
import React, { useState, useCallback, useEffect } from 'react';
import type { DreamAnalysis as DreamAnalysisType, LoadingState, DreamRecord } from './types';
import { analyzeDream, visualizeDream } from './services/geminiService';
import { DreamInput } from './components/DreamInput';
import { DreamAnalysis } from './components/DreamAnalysis';
import { DreamVisualization } from './components/DreamVisualization';
import { Loader } from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { ShareIcon } from './components/icons/ShareIcon';
import { ShareModal } from './components/ShareModal';
import { DreamHistory } from './components/DreamHistory';
import { RefreshIcon } from './components/icons/RefreshIcon';


// Define styles in a way that tailwind can parse them
const animationStyles = `
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.7s ease-out forwards;
}
@keyframes float {
	0% { transform: translatey(0px); }
	50% { transform: translatey(-10px); }
	100% { transform: translatey(0px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
@keyframes animate-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-pan {
    background-size: 200% 200%;
    animation: animate-gradient 15s ease infinite;
}
`;

const App: React.FC = () => {
  const [dreamDescription, setDreamDescription] = useState<string>('');
  const [analysis, setAnalysis] = useState<DreamAnalysisType | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [dreamHistory, setDreamHistory] = useState<DreamRecord[]>([]);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const isLoading = loadingState === 'analyzing' || loadingState === 'visualizing';

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('dreamHistory');
      if (storedHistory) {
        setDreamHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load dream history from localStorage", error);
    }
  }, []);

  const addDreamToHistory = (newRecord: Omit<DreamRecord, 'id'>) => {
    const recordWithId: DreamRecord = { ...newRecord, id: Date.now() };
    setDreamHistory(prevHistory => {
      const updatedHistory = [recordWithId, ...prevHistory];
      try {
        localStorage.setItem('dreamHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save dream history to localStorage", error);
      }
      return updatedHistory;
    });
  };

  const handleWeaveDream = useCallback(async () => {
    if (!dreamDescription.trim()) return;

    setError(null);
    setAnalysis(null);
    setImageUrl(null);
    setLoadingState('analyzing');

    try {
      const analysisResult = await analyzeDream(dreamDescription);
      setAnalysis(analysisResult);
      setLoadingState('visualizing');

      const imageResult = await visualizeDream(analysisResult.image_prompt_enhancement);
      setImageUrl(imageResult);
      setLoadingState('done');
      
      addDreamToHistory({
        description: dreamDescription,
        analysis: analysisResult,
        imageUrl: imageResult,
      });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(errorMessage);
      setError(`There was a problem weaving your dream. ${errorMessage}`);
      setLoadingState('error');
    }
  }, [dreamDescription]);
  
    const handleRegenerateVisualization = useCallback(async () => {
    if (!analysis) return;

    setIsRegenerating(true);
    setError(null);

    try {
      const newImageUrl = await visualizeDream(analysis.image_prompt_enhancement);
      setImageUrl(newImageUrl);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(errorMessage);
      setError(`There was a problem regenerating your visualization. ${errorMessage}`);
    } finally {
      setIsRegenerating(false);
    }
  }, [analysis]);


  const handleSelectDream = (dream: DreamRecord) => {
    setDreamDescription(dream.description);
    setAnalysis(dream.analysis);
    setImageUrl(dream.imageUrl);
    setLoadingState('done');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleClearHistory = () => {
    try {
      localStorage.removeItem('dreamHistory');
      setDreamHistory([]);
    } catch (error) {
      console.error("Failed to clear dream history from localStorage", error);
    }
  };


  const resetState = () => {
    setDreamDescription('');
    setAnalysis(null);
    setImageUrl(null);
    setLoadingState('idle');
    setIsShareModalOpen(false);
  };

  return (
    <>
    <style>{animationStyles}</style>
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 text-slate-200 antialiased animate-gradient-pan">
      <main className="container mx-auto px-4 py-8 sm:py-16">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-2">
             <SparklesIcon className="w-12 h-12 text-purple-400 animate-float"/>
             <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
               Dream Weaver
             </h1>
          </div>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Unlock the mysteries of your subconscious. Describe your dream, and let AI reveal its meaning and bring it to life.
          </p>
        </header>

        {loadingState === 'idle' && (
          <div className="animate-fade-in">
            <DreamInput 
              dreamDescription={dreamDescription}
              setDreamDescription={setDreamDescription}
              onSubmit={handleWeaveDream}
              isLoading={isLoading}
            />
            <DreamHistory
              history={dreamHistory}
              onSelectDream={handleSelectDream}
              onClear={handleClearHistory}
            />
          </div>
        )}

        {isLoading && <Loader loadingState={loadingState} />}
        
        {error && (
            <div className="text-center my-8 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg max-w-2xl mx-auto animate-fade-in">
                <p className="font-semibold">Oh no, a nightmare!</p>
                <p>{error}</p>
                <button 
                  onClick={() => {
                      setError(null); 
                      if(loadingState === 'error') setLoadingState('idle');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
                 >
                 { loadingState === 'error' ? 'Try Again' : 'Close' }
                 </button>
            </div>
        )}

        {loadingState === 'done' && analysis && (
          <div className="space-y-12 mt-12">
            <DreamAnalysis analysis={analysis} />
            {imageUrl && <DreamVisualization imageUrl={imageUrl} />}
            <div className="flex flex-wrap justify-center gap-4 text-center animate-fade-in">
                 <button
                    onClick={handleRegenerateVisualization}
                    disabled={isRegenerating}
                    className="group relative inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-green-500/40 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RefreshIcon className={`w-5 h-5 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                    {isRegenerating ? 'Regenerating...' : 'Regenerate Image'}
                </button>
                <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="group relative inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                    <ShareIcon className="w-5 h-5 mr-2" />
                    Share Dream
                </button>
                <button
                    onClick={resetState}
                    className="group relative inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-slate-600/40 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                   <SparklesIcon className="w-5 h-5 mr-2" />
                    Weave Another Dream
                </button>
            </div>
          </div>
        )}
      </main>
      
      {isShareModalOpen && analysis && imageUrl && (
        <ShareModal
          analysis={analysis}
          imageUrl={imageUrl}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
    </>
  );
};

export default App;
