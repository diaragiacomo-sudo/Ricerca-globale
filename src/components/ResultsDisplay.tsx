import React from "react";
import { ExternalLink, Quote, FileText, Download, Share2 } from "lucide-react";
import { SearchResult } from "../types";
import { Card, Button, Badge } from "./ui/Primitives";
import ReactMarkdown from "react-markdown";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { reportService } from "../services/reportService";

interface ResultsDisplayProps {
  result: SearchResult;
  onSave: (query: string) => void;
}

export const ResultsDisplay = ({ result, onSave }: ResultsDisplayProps) => {
  const chartData = result.analysis?.chartData || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8 pb-20"
    >
      {/* Header Actions */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wide">Live Feed</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wide">{result.groundingChunks?.length || 0} Sources</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Real-time Analysis: <span className="text-indigo-600 underline underline-offset-4">{result.query}</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => reportService.generatePDF(result)}>
            <FileText className="w-4 h-4" />
            Report PDF
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => onSave(result.query)}
          >
            <Share2 className="w-4 h-4" />
            Salva Ricerca
          </Button>
          <Button variant="secondary" onClick={() => reportService.exportJSON(result)}>
            <Download className="w-4 h-4" />
            Esporta Dati
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Analysis */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-8 border-slate-100 shadow-sm">
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
              <ReactMarkdown>{result.summary}</ReactMarkdown>
            </div>
          </Card>

          {/* Visualization if data exists */}
          {chartData.length > 0 && (
            <Card className="p-8 space-y-6 border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-indigo-600 rounded-full" />
                  Data Analysis Visualization
                </h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#94a3b8' }} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: '1px solid #e2e8f0', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index % 2 === 0 ? '#4f46e5' : '#818cf8'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {/* Key Points */}
          {result.analysis?.keyPoints && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium">
              {result.analysis.keyPoints.map((point, idx) => (
                <div key={idx} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 flex gap-4">
                  <Quote className="w-5 h-5 text-indigo-200 dark:text-indigo-900 flex-shrink-0" />
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Context */}
        <div className="lg:col-span-4 space-y-8">
          {/* Grounding Sources */}
          {result.groundingChunks && result.groundingChunks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2">
                Primary Sources
              </h3>
              <div className="space-y-2">
                {result.groundingChunks.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <div className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {source.title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium truncate max-w-[180px]">
                            {new URL(source.uri).hostname}
                          </p>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-indigo-400" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {result.analysis?.tags && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2">
                Related Context
              </h3>
              <div className="flex flex-wrap gap-1.5 px-2">
                {result.analysis.tags.map((tag, idx) => (
                  <span key={idx} className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-2 py-0.5 rounded transition-colors cursor-pointer capitalize">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
