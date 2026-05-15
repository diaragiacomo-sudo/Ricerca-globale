import { SearchResult, SavedSearch } from "../types";

const SEARCH_STORAGE_KEY = "global_search_results";
const SAVED_SEARCHES_KEY = "global_search_saved";

export const storageService = {
  getSearchHistory: (): SearchResult[] => {
    const data = localStorage.getItem(SEARCH_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveSearchResult: (result: SearchResult) => {
    const history = storageService.getSearchHistory();
    const newHistory = [result, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(newHistory));
  },

  getSavedSearches: (): SavedSearch[] => {
    const data = localStorage.getItem(SAVED_SEARCHES_KEY);
    return data ? JSON.parse(data) : [];
  },

  toggleSaveSearch: (query: string) => {
    const saved = storageService.getSavedSearches();
    const exists = saved.find(s => s.query === query);
    
    let newSaved;
    if (exists) {
      newSaved = saved.filter(s => s.query !== query);
    } else {
      newSaved = [{ 
        id: crypto.randomUUID(), 
        query, 
        timestamp: Date.now() 
      }, ...saved];
    }
    
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(newSaved));
    return newSaved;
  }
};
