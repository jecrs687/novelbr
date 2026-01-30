"use client";

import { useEffect, useState } from "react";
import { useSearchStore } from "@/lib/store";
import { NovelCard } from "@/components/novel/novel-card";
import { fetchNovelsList, searchNovels } from "@/lib/data";
import { Search, X, Clock, Sparkles } from "lucide-react";
import type { NovelsList } from "@/lib/schemas";
import { NovelGridSkeleton } from "@/components/ui/loading";

export default function SearchPage() {
  const {
    query,
    setQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useSearchStore();
  const [novels, setNovels] = useState<NovelsList>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNovelsList()
      .then(setNovels)
      .finally(() => setIsLoading(false));
  }, []);

  const results = query.trim() ? searchNovels(novels, query) : {};

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    if (searchTerm.trim()) {
      addRecentSearch(searchTerm.trim());
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Search className="text-primary" size={28} />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Pesquisar
            </h1>
            <p className="text-muted-foreground">
              Encontre sua próxima leitura
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={24}
          />
          <input
            type="text"
            placeholder="Pesquisar por título, gênero ou descrição..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                addRecentSearch(query.trim());
              }
            }}
            autoFocus
            className="w-full pl-14 pr-12 py-4 bg-card border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-lg"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <NovelGridSkeleton count={12} />
      ) : query.trim() ? (
        // Search Results
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">
              {Object.keys(results).length} resultados para &quot;{query}&quot;
            </h2>
          </div>

          {Object.keys(results).length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {Object.entries(results).map(([name, novel]) => (
                <NovelCard key={name} name={name} novel={novel} />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-3xl border border-border p-12 text-center">
              <Search className="mx-auto mb-4 text-muted-foreground" size={64} />
              <h3 className="text-2xl font-bold text-card-foreground mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Tente pesquisar com termos diferentes ou explore nossa
                biblioteca completa.
              </p>
            </div>
          )}
        </div>
      ) : (
        // Recent Searches & Suggestions
        <div className="space-y-8">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Clock size={20} />
                  Pesquisas Recentes
                </h2>
                <button
                  onClick={clearRecentSearches}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Limpar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="px-4 py-2 bg-card border border-border rounded-full hover:bg-muted transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Popular */}
          <section>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Sparkles size={20} />
              Sugestões
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
              {Object.entries(novels)
                .slice(0, 10)
                .map(([name, novel]) => (
                  <NovelCard key={name} name={name} novel={novel} />
                ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
