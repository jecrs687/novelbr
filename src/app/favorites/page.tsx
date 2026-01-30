"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReadingProgressStore } from "@/lib/store";
import { NovelCard } from "@/components/novel/novel-card";
import { fetchNovelsList } from "@/lib/data";
import { Heart, BookOpen, Trash2 } from "lucide-react";
import type { NovelsList } from "@/lib/schemas";
import { NovelGridSkeleton } from "@/components/ui/loading";

export default function FavoritesPage() {
  const { favorites, clearAllProgress } = useReadingProgressStore();
  const [novels, setNovels] = useState<NovelsList>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNovelsList()
      .then(setNovels)
      .finally(() => setIsLoading(false));
  }, []);

  const favoriteNovels = Object.fromEntries(
    Object.entries(novels).filter(([name]) => favorites.includes(name))
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/10 rounded-xl">
              <Heart className="text-destructive" size={28} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Meus Favoritos
              </h1>
              <p className="text-muted-foreground">
                {favorites.length} novels salvos
              </p>
            </div>
          </div>

          {favorites.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Tem certeza que deseja limpar todos os favoritos?")) {
                  clearAllProgress();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors"
            >
              <Trash2 size={18} />
              <span className="hidden sm:inline">Limpar tudo</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <NovelGridSkeleton count={6} />
      ) : favorites.length === 0 ? (
        <div className="bg-card rounded-3xl border border-border p-12 text-center">
          <Heart className="mx-auto mb-4 text-muted-foreground" size={64} />
          <h2 className="text-2xl font-bold text-card-foreground mb-2">
            Nenhum favorito ainda
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Adicione novels aos seus favoritos para acessá-los rapidamente
            aqui. Clique no ícone de coração na página de qualquer novel.
          </p>
          <Link
            href="/novels"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <BookOpen size={20} />
            Explorar Novels
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
          {Object.entries(favoriteNovels).map(([name, novel]) => (
            <NovelCard key={name} name={name} novel={novel} />
          ))}
        </div>
      )}
    </div>
  );
}
