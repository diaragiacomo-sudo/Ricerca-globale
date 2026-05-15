/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { SearchBar } from "./components/SearchBar";
import { ResultsDisplay } from "./components/ResultsDisplay";
import { Sidebar } from "./components/Sidebar";
import { performGlobalSearch } from "./services/searchService";
import { storageService } from "./services/storageService";
import { SearchResult, SavedSearch, AttachedFile } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, BarChart3, Globe2, BookMarked } from "lucide-react";

export default function App() {
  const [currentResult, setCurrentResult] = useState<SearchResult | null>(null);
  const [history, setHistory] = useState<SearchResult[]>([]);
  const [saved, setSaved] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHistory(storageService.getSearchHistory());
    setSaved(storageService.getSavedSearches());
  }, []);

  const handleSearch = async (query: string, files: AttachedFile[]) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await performGlobalSearch(query, files);
      setCurrentResult(result);
      storageService.saveSearchResult(result);
      setHistory(storageService.getSearchHistory());
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred during search.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("global_search_results");
    setHistory([]);
    setCurrentResult(null);
  };

  const toggleSave = (query: string) => {
    const newSaved = storageService.toggleSaveSearch(query);
    setSaved(newSaved);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-600 selection:text-white">
      <Sidebar 
        history={history}
        saved={saved}
        onSelectResult={setCurrentResult}
        onClearHistory={clearHistory}
        onToggleSave={toggleSave}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <div className="max-w-7xl mx-auto p-8">
            
            <div className={currentResult ? "py-4" : "h-[80vh] flex flex-col justify-center gap-12"}>
              {!currentResult && (
                <div className="text-center space-y-8 max-w-3xl mx-auto">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-200 dark:shadow-none"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <div className="space-y-4">
                    <h2 className="text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                      Intelligence <span className="text-indigo-600">Enterprise</span> <br/> 
                      a Portata di Mano.
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-xl mx-auto">
                      Analisi dati in tempo reale e reportistica avanzata per ricercatori professionisti.
                    </p>
                  </div>
                </div>
              )}

              <SearchBar onSearch={handleSearch} isLoading={isLoading} />

              {!currentResult && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 group hover:border-indigo-200 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                      <Globe2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Ricerca Globale</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">Grounding web in tempo reale per informazioni sempre aggiornate e verificate.</p>
                  </div>
                  <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 group hover:border-indigo-200 transition-colors text-center md:text-left">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto md:mx-0">
                      <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Analisi Visuale</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">Trasforma dati complessi in grafici interattivi e insight strutturati istantaneamente.</p>
                  </div>
                  <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 group hover:border-indigo-200 transition-colors text-center md:text-left">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mx-auto md:mx-0">
                      <BookMarked className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Professional PDF</h4>
                    <p className="text-sm text-slate-500 leading-relaxed">Genera report PDF dettagliati pronti per essere condivisi con il tuo team.</p>
                  </div>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-bold"
                >
                  {error}
                </motion.div>
              )}

              {currentResult && (
                <div className="mt-8">
                  <ResultsDisplay result={currentResult} onSave={toggleSave} />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Status Bar Footer */}
        <footer className="h-10 bg-slate-800 text-slate-400 px-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest flex-shrink-0">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> 
              Sistemi: Online
            </span>
            <span className="hidden sm:inline">Latenza: 42ms</span>
            <span className="hidden sm:inline">Sicurezza: AES-256</span>
          </div>
          <div className="flex items-center gap-4">
            <span>v1.0.0 Enterprise</span>
            <span>© 2024 GlobalSearch Systems</span>
          </div>
        </footer>

        {/* Decorative backgrounds */}
        {!currentResult && (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
            <div className="absolute top-[-10%] right-[-5%] w-[50rem] h-[50rem] bg-indigo-50 dark:bg-indigo-950/20 rounded-full blur-[10rem]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-slate-200 dark:bg-slate-900 rounded-full blur-[8rem]" />
          </div>
        )}
      </main>
    </div>
  );
}
