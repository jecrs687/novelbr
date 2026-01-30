"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Pause, BookOpen, Star } from "lucide-react";
import type { NovelsList } from "@/lib/schemas";
import { truncateText } from "@/lib/utils";

interface HeroSliderProps {
  novels: NovelsList;
}

const SLIDE_DURATION = 6000;

export function HeroSlider({ novels }: HeroSliderProps) {
  const entries = Object.entries(novels).slice(0, 6);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % entries.length);
  }, [entries.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + entries.length) % entries.length);
  }, [entries.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPlaying, isHovered, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (entries.length === 0) return null;

  const [currentName, currentNovel] = entries[currentSlide];
  const summary = currentNovel.resumo.join(" ").trim();

  // Placeholder gradient background
  const getPlaceholderGradient = (name: string) => {
    const colors = [
      "from-purple-900 via-purple-800 to-indigo-900",
      "from-blue-900 via-blue-800 to-cyan-900",
      "from-emerald-900 via-emerald-800 to-teal-900",
      "from-rose-900 via-rose-800 to-pink-900",
      "from-amber-900 via-amber-800 to-orange-900",
      "from-violet-900 via-violet-800 to-purple-900",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <section
      className="relative h-[75vh] min-h-[500px] max-h-[700px] rounded-3xl overflow-hidden mb-12"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background slides */}
      {entries.map(([name, novel], index) => (
        <div
          key={name}
          className={`absolute inset-0 transition-all duration-1000 ${index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
            }`}
        >
          {!imageError[name] && novel.imagem ? (
            <Image
              src={novel.imagem}
              alt={name}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
              onError={() => setImageError((prev) => ({ ...prev, [name]: true }))}
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${getPlaceholderGradient(name)}`}>
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              </div>
            </div>
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl" key={currentSlide}>
            {/* Badge */}
            <div className="flex items-center gap-3 mb-6 animate-fadeInUp stagger-1">
              <span className="badge badge-primary">
                <Star size={12} className="mr-1" fill="currentColor" />
                Em Destaque
              </span>
              {currentNovel.genero && currentNovel.genero[0] && (
                <span className="badge badge-accent">
                  {currentNovel.genero[0]}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight animate-fadeInUp stagger-2">
              {currentName}
            </h1>

            {/* Summary */}
            <p className="text-lg text-foreground/70 mb-6 line-clamp-3 animate-fadeInUp stagger-3">
              {truncateText(summary, 200)}
            </p>

            {/* Genres */}
            {currentNovel.genero && currentNovel.genero.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-8 animate-fadeInUp stagger-4">
                {currentNovel.genero.slice(0, 4).map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1.5 bg-muted/50 backdrop-blur-sm rounded-lg text-sm text-foreground/80 border border-border/50"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center gap-4 animate-fadeInUp stagger-5">
              <Link
                href={`/novel/${encodeURIComponent(currentName)}`}
                className="btn-primary"
              >
                <BookOpen size={20} />
                Começar a Ler
              </Link>
              <Link
                href={`/novel/${encodeURIComponent(currentName)}`}
                className="btn-secondary"
              >
                Ver Detalhes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Thumbnails - Desktop */}
      <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-3">
        {entries.map(([name, novel], index) => (
          <button
            key={name}
            onClick={() => goToSlide(index)}
            className={`relative w-16 h-20 rounded-xl overflow-hidden transition-all duration-300 ${index === currentSlide
                ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                : "opacity-50 hover:opacity-80 hover:scale-105"
              }`}
          >
            {!imageError[name] && novel.imagem ? (
              <Image
                src={novel.imagem}
                alt={name}
                fill
                className="object-cover"
                sizes="64px"
                onError={() => setImageError((prev) => ({ ...prev, [name]: true }))}
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${getPlaceholderGradient(name)}`} />
            )}
          </button>
        ))}
      </div>

      {/* Controls - Bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="p-2.5 bg-card/80 backdrop-blur-sm rounded-xl hover:bg-card transition-colors border border-border/50"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} className="text-foreground" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {entries.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                  ? "w-8 bg-primary"
                  : "w-2 bg-foreground/30 hover:bg-foreground/50"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={nextSlide}
          className="p-2.5 bg-card/80 backdrop-blur-sm rounded-xl hover:bg-card transition-colors border border-border/50"
          aria-label="Next slide"
        >
          <ChevronRight size={20} className="text-foreground" />
        </button>

        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2.5 bg-card/80 backdrop-blur-sm rounded-xl hover:bg-card transition-colors border border-border/50"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? (
            <Pause size={20} className="text-foreground" />
          ) : (
            <Play size={20} className="text-foreground" />
          )}
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/30">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{
            width: `${((currentSlide + 1) / entries.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
}
