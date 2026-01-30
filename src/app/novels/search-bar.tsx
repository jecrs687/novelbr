"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, History, TrendingUp } from "lucide-react";
import { useSearchStore } from "@/lib/store";

export function SearchBar() {
  const { query, setQuery, recentSearches, addRecentSearch, clearRecentSearches } =
    useSearchStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query.trim());
    }
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleRecentClick = (search: string) => {
    setQuery(search);
    addRecentSearch(search);
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const popularSearches = ["Ação", "Romance", "Fantasia", "Cultivação", "Aventura"];

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <Search
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isFocused ? "text-primary" : "text-muted-foreground"
            }`}
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar novels por nome ou gênero..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowDropdown(true);
          }}
          onBlur={() => setIsFocused(false)}
          className="input pl-12 pr-12"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {/* Dropdown */}
      {showDropdown && (recentSearches.length > 0 || !query) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-lg overflow-hidden z-50 animate-fadeInDown"
        >
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Pesquisas recentes
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Limpar
                </button>
              </div>
              <div className="space-y-1">
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentClick(search)}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-muted transition-colors text-left"
                  >
                    <History size={16} className="text-muted-foreground" />
                    <span className="text-foreground">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular searches */}
          {!query && (
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-accent" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Populares
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleRecentClick(search)}
                    className="px-3 py-1.5 bg-muted rounded-lg text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
