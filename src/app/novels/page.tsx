import { Suspense } from "react";
import { fetchNovelsList } from "@/lib/data";
import { NovelGrid } from "@/components/home/novel-grid";
import { NovelGridSkeleton } from "@/components/ui/loading";
import { SearchBar } from "./search-bar";
import { Library, Filter, Grid3X3, List } from "lucide-react";

export const metadata = {
  title: "Biblioteca - NovelBR",
  description: "Explore nossa coleção completa de light novels e web novels traduzidas para português.",
};

export default async function NovelsPage() {
  const novels = await fetchNovelsList();
  const totalNovels = Object.keys(novels).length;

  // Get unique genres
  const allGenres = new Set<string>();
  Object.values(novels).forEach(novel => {
    novel.genero?.forEach(genre => allGenres.add(genre));
  });
  const genres = Array.from(allGenres).sort();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border border-border p-8 lg:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Library className="text-primary" size={28} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Biblioteca
              </h1>
              <p className="text-muted-foreground">
                {totalNovels} novels disponíveis para leitura
              </p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="px-4 py-2 bg-card/80 backdrop-blur-sm rounded-xl border border-border">
              <span className="text-foreground font-semibold">{totalNovels}</span>
              <span className="text-muted-foreground ml-2">Novels</span>
            </div>
            <div className="px-4 py-2 bg-card/80 backdrop-blur-sm rounded-xl border border-border">
              <span className="text-foreground font-semibold">{genres.length}</span>
              <span className="text-muted-foreground ml-2">Gêneros</span>
            </div>
            <div className="px-4 py-2 bg-card/80 backdrop-blur-sm rounded-xl border border-border">
              <span className="text-foreground font-semibold">100%</span>
              <span className="text-muted-foreground ml-2">Gratuito</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card rounded-2xl border border-border p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-muted rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors">
              <Filter size={18} />
              <span className="hidden sm:inline">Filtros</span>
            </button>
            <button className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <Grid3X3 size={20} />
            </button>
            <button className="p-2.5 bg-muted rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors">
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Genre tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="badge badge-primary">
            Todos
          </button>
          {genres.slice(0, 10).map(genre => (
            <button
              key={genre}
              className="badge badge-muted hover:badge-primary transition-colors cursor-pointer"
            >
              {genre}
            </button>
          ))}
          {genres.length > 10 && (
            <button className="badge badge-muted">
              +{genres.length - 10} mais
            </button>
          )}
        </div>
      </div>

      {/* Novels Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Mostrando <span className="text-foreground font-medium">{totalNovels}</span> novels
          </p>
          <select className="bg-card border border-border rounded-xl px-4 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>Mais recentes</option>
            <option>Nome (A-Z)</option>
            <option>Nome (Z-A)</option>
            <option>Mais populares</option>
          </select>
        </div>

        <Suspense fallback={<NovelGridSkeleton count={20} />}>
          <NovelGrid novels={novels} />
        </Suspense>
      </div>

      {/* Load more */}
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          Você está vendo todas as {totalNovels} novels disponíveis
        </p>
      </div>
    </div>
  );
}
