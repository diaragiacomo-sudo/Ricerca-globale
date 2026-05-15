import React, { useState } from "react";
import { Search, SlidersHorizontal, Paperclip, X, Loader2 } from "lucide-react";
import { Button } from "./ui/Primitives";
import { AttachedFile } from "../types";
import { useDropzone } from "react-dropzone";

interface SearchBarProps {
  onSearch: (query: string, files: AttachedFile[]) => void;
  isLoading: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result as string
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    noClick: true 
  });

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim() || attachedFiles.length > 0) {
      onSearch(query, attachedFiles);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <form 
        onSubmit={handleSearch}
        className="relative group bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500/20 shadow-sm"
      >
        <div className="flex items-center gap-4 px-4 h-12">
          <Search className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca qualsiasi cosa, analizza dati o carica file..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 font-medium"
          />
          <div className="flex items-center gap-1">
            <input {...getInputProps()} id="file-input-hidden" />
            <button 
              type="button"
              onClick={() => document.getElementById('file-input-hidden')?.click()}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-all"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <Button 
              id="search-button"
              onClick={handleSearch} 
              disabled={isLoading || (!query.trim() && attachedFiles.length === 0)}
              className="h-9 px-5 rounded-lg text-xs"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cerca"}
            </Button>
          </div>
        </div>

        {isDragActive && (
          <div className="absolute inset-0 z-50 bg-zinc-900/80 backdrop-blur-sm rounded-[22px] flex items-center justify-center border-2 border-dashed border-white/50 m-1">
            <p className="text-white font-medium">Drop files to analyze</p>
          </div>
        )}
      </form>

      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2">
          {attachedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 truncate max-w-[150px]">{file.name}</span>
              <button 
                onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                className="text-zinc-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
