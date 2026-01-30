"use client";

import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/lib/store";

interface FavoriteButtonProps {
  novelName: string;
}

export function FavoriteButton({ novelName }: FavoriteButtonProps) {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const isFavorite = favorites.includes(novelName);

  return (
    <button
      onClick={() => toggleFavorite(novelName)}
      className={`group flex items-center gap-2 px-4 py-3 rounded-xl border font-medium transition-all ${isFavorite
          ? "bg-destructive text-destructive-foreground border-destructive shadow-lg shadow-destructive/25"
          : "bg-card border-border text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/5"
        }`}
      aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <Heart
        size={20}
        fill={isFavorite ? "currentColor" : "none"}
        className={isFavorite ? "" : "group-hover:scale-110 transition-transform"}
      />
      <span className="hidden sm:inline">
        {isFavorite ? "Favorito" : "Favoritar"}
      </span>
    </button>
  );
}
