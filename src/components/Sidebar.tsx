import React from "react";
import { History, Bookmark, Trash2, Search as SearchIcon, ChevronRight } from "lucide-react";
import { SearchResult, SavedSearch } from "../types";
import { cn, formatDate } from "../lib/utils";

interface SidebarProps {
  history: SearchResult[];
  saved: SavedSearch[];
  onSelectResult: (result: SearchResult) => void;
  onClearHistory: () => void;
  onToggleSave: (query: string) => void;
}

export const Sidebar = ({ 
  history, 
  saved, 
  onSelectResult, 
  onClearHistory,
  onToggleSave 
}: SidebarProps) => {
  return (
    <div className="w-80 h-full border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-bold text-xl mb-1">
          <SearchIcon className="w-6 h-6" />
          <span>GlobalSearch</span>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise Intelligence</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
        {/* Saved Searches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Bookmark className="w-3 h-3" />
              Esplorazioni Salvate
            </h3>
          </div>
          {saved.length === 0 ? (
            <p className="text-xs text-slate-400 px-2 italic font-medium">Nessuna ricerca salvata.</p>
          ) : (
            <div className="space-y-1">
              {saved.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {/* Trigger search again or select */}}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">{s.query}</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <History className="w-3 h-3" />
              Cronologia Recente
            </h3>
            <button 
              onClick={onClearHistory}
              className="text-[9px] uppercase tracking-wider font-bold text-slate-400 hover:text-red-500 transition-colors"
            >
              Pulisci
            </button>
          </div>
          <div className="space-y-1">
            {history.map((h) => (
              <button
                key={h.id}
                onClick={() => onSelectResult(h)}
                className="w-full text-left p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-all group"
              >
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate mb-0.5 group-hover:text-indigo-700 dark:group-hover:text-indigo-400">{h.query}</p>
                <p className="text-[10px] text-slate-400 font-medium">{formatDate(h.timestamp)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold">JD</div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Jane Doe</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Pro Analyst</p>
          </div>
        </div>
      </div>
    </div>
  );
};
