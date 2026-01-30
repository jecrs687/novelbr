"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Heart, ChevronRight, Sparkles } from "lucide-react";
import type { NovelSummary } from "@/lib/schemas";
import { truncateText } from "@/lib/utils";
import { useFavoritesStore } from "@/lib/store";

interface NovelCardProps {
  name: string;
  novel: NovelSummary;
  variant?: "default" | "compact" | "featured" | "wide";
  priority?: boolean;
}

// Generate placeholder gradient based on name
const getPlaceholderGradient = (novelName: string) => {
  const colors = [
    "from-purple-600 via-purple-500 to-indigo-600",
    "from-blue-600 via-blue-500 to-cyan-600",
    "from-emerald-600 via-emerald-500 to-teal-600",
    "from-rose-600 via-rose-500 to-pink-600",
    "from-amber-600 via-amber-500 to-orange-600",
    "from-violet-600 via-violet-500 to-purple-600",
  ];
  const index = novelName.length % colors.length;
  return colors[index];
};

// Separate component for image rendering
function NovelImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  onError
}: {
  src: string | undefined;
  alt: string;
  className: string;
  sizes: string;
  priority?: boolean;
  onError: () => void;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-br ${getPlaceholderGradient(alt)}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="text-white/40" size={40} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => {
        setHasError(true);
        onError();
      }}
    />
  );
}

export function NovelCard({ name, novel, variant = "default", priority = false }: NovelCardProps) {
  const encodedName = encodeURIComponent(name);
  const summary = novel.resumo.join(" ").trim();
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
  const isFavorite = favorites.includes(name);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(name);
    } else {
      addFavorite(name);
    }
  };

  // Compact variant - horizontal card
  if (variant === "compact") {
    return (
      <Link
        href={`/novel/${encodedName}`}
        className="group flex gap-4 p-3 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 card-hover"
      >
        <div className="relative w-16 h-20 flex-shrink-0 rounded-xl overflow-hidden">
          <NovelImage
            src={novel.imagem}
            alt={name}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="64px"
            onError={() => { }}
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h4 className="font-semibold text-sm text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {truncateText(summary, 50)}
          </p>
          {novel.genero && novel.genero[0] && (
            <span className="mt-2 inline-flex text-xs text-accent">
              {novel.genero[0]}
            </span>
          )}
        </div>
        <div className="flex items-center">
          <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </Link>
    );
  }

  // Featured variant - large card with more details
  if (variant === "featured") {
    return (
      <Link
        href={`/novel/${encodedName}`}
        className="group relative block h-[400px] rounded-3xl overflow-hidden"
      >
        <NovelImage
          src={novel.imagem}
          alt={name}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={priority}
          onError={() => { }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-sm transition-all duration-300 z-10 ${isFavorite
              ? "bg-destructive text-destructive-foreground"
              : "bg-white/10 text-white hover:bg-white/20"
            }`}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-primary">
              <Sparkles size={12} className="mr-1" />
              Destaque
            </span>
          </div>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-white/70 text-sm line-clamp-2 mb-4">
            {truncateText(summary, 120)}
          </p>
          {novel.genero && novel.genero.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {novel.genero.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-xs text-white border border-white/10"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Wide variant - horizontal featured card
  if (variant === "wide") {
    return (
      <Link
        href={`/novel/${encodedName}`}
        className="group flex flex-col md:flex-row gap-6 p-4 bg-card rounded-3xl border border-border hover:border-primary/50 transition-all duration-300 card-hover"
      >
        <div className="relative w-full md:w-48 h-64 md:h-auto flex-shrink-0 rounded-2xl overflow-hidden">
          <NovelImage
            src={novel.imagem}
            alt={name}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 192px"
            onError={() => { }}
          />
        </div>
        <div className="flex-1 flex flex-col">
          {novel.genero && novel.genero[0] && (
            <span className="badge badge-accent w-fit mb-3">
              {novel.genero[0]}
            </span>
          )}
          <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
            {truncateText(summary, 200)}
          </p>
          {novel.genero && novel.genero.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {novel.genero.slice(1, 4).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-muted rounded-lg text-xs text-muted-foreground"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    );
  }

  // Default variant - grid card
  return (
    <Link
      href={`/novel/${encodedName}`}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden card-hover glow-border"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <NovelImage
          src={novel.imagem}
          alt={name}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          priority={priority}
          onError={() => { }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-sm transition-all duration-300 z-10 ${isFavorite
              ? "bg-destructive text-destructive-foreground"
              : "bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100"
            }`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Bottom action */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-center gap-2 text-white text-sm font-medium">
            <BookOpen size={18} />
            <span>Ver detalhes</span>
          </div>
        </div>

        {/* Genre badge */}
        {novel.genero && novel.genero[0] && (
          <div className="absolute top-3 left-3">
            <span className="badge badge-primary text-xs">
              {novel.genero[0]}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem]">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {truncateText(summary, 80)}
        </p>

        {/* Tags */}
        {novel.genero && novel.genero.length > 1 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {novel.genero.slice(1, 3).map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 bg-muted rounded-md text-xs text-muted-foreground"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
