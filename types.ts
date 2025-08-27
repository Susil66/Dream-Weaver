
export interface DreamSymbol {
  symbol: string;
  meaning: string;
}

export interface DreamAnalysis {
  title: string;
  summary: string;
  symbols: DreamSymbol[];
  themes: string[];
  image_prompt_enhancement: string;
}

export interface DreamRecord {
  id: number;
  description: string;
  analysis: DreamAnalysis;
  imageUrl: string;
}

export type LoadingState = 'idle' | 'analyzing' | 'visualizing' | 'done' | 'error';