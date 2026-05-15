export interface SearchResult {
  id: string;
  query: string;
  timestamp: number;
  summary: string;
  groundingChunks?: GroundingChunk[];
  analysis?: AnalysisData;
  files?: AttachedFile[];
}

export interface GroundingChunk {
  uri: string;
  title: string;
}

export interface AnalysisData {
  summary: string;
  keyPoints: string[];
  chartData?: { name: string; value: number }[];
  tags: string[];
}

export interface AttachedFile {
  name: string;
  type: string;
  size: number;
  data: string; // base64
}

export interface SavedSearch {
  id: string;
  query: string;
  timestamp: number;
}
