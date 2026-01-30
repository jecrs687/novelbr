import { Suspense } from "react";
import { fetchNovelsList } from "@/lib/data";
import { HeroSlider } from "@/components/home/hero-slider";
import { NovelGrid } from "@/components/home/novel-grid";
import { ContinueReading } from "@/components/home/continue-reading";
import {
  HeroSliderSkeleton,
  NovelGridSkeleton,
} from "@/components/ui/loading";
import Link from "next/link";
import { ArrowRight, BookOpen, Heart, Sparkles, TrendingUp, Clock, Star, Zap } from "lucide-react";

export default async function HomePage() {
  const novels = await fetchNovelsList();

  // Get featured novels (first 6)
  const featuredNovels = Object.fromEntries(Object.entries(novels).slice(0, 6));

  // Get recent novels (next 12)
  const recentNovels = Object.fromEntries(Object.entries(novels).slice(6, 18));

  // Get random recommendations (use last 8 for consistency on server)
  const allEntries = Object.entries(novels);
  const recommendations = Object.fromEntries(allEntries.slice(-8));

  const totalNovels = Object.keys(novels).length;

  return (
    <div className="max-w-7xl mx-auto space-y-16">
      {/* Hero Section */}
      <Suspense fallback={<HeroSliderSkeleton />}>
        <HeroSlider novels={featuredNovels} />
      </Suspense>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group relative bg-card rounded-2xl border border-border p-6 overflow-hidden card-hover">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
              <BookOpen className="text-primary" size={24} />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {totalNovels}+
            </div>
            <div className="text-sm text-muted-foreground">Novels Disponíveis</div>
          </div>
        </div>

        <div className="group relative bg-card rounded-2xl border border-border p-6 overflow-hidden card-hover">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mb-4">
              <Zap className="text-accent" size={24} />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              5000+
            </div>
            <div className="text-sm text-muted-foreground">Capítulos</div>
          </div>
        </div>

        <div className="group relative bg-card rounded-2xl border border-border p-6 overflow-hidden card-hover">
          <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center mb-4">
              <Star className="text-secondary" size={24} />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              100%
            </div>
            <div className="text-sm text-muted-foreground">Gratuito</div>
          </div>
        </div>

        <div className="group relative bg-card rounded-2xl border border-border p-6 overflow-hidden card-hover">
          <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-success/15 flex items-center justify-center mb-4">
              <TrendingUp className="text-success" size={24} />
            </div>
            <div className="text-3xl font-bold text-foreground mb-1">
              PT-BR
            </div>
            <div className="text-sm text-muted-foreground">Traduzido</div>
          </div>
        </div>
      </section>

      {/* Continue Reading Section */}
      <ContinueReading novels={novels} />

      {/* Recent Novels Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
              <Clock className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Adicionados Recentemente
              </h2>
              <p className="text-muted-foreground mt-1">
                As últimas adições à nossa biblioteca
              </p>
            </div>
          </div>
          <Link
            href="/novels"
            className="hidden sm:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
          >
            Ver todos
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <Suspense fallback={<NovelGridSkeleton count={12} />}>
          <NovelGrid novels={recentNovels} />
        </Suspense>
        <Link
          href="/novels"
          className="sm:hidden flex items-center justify-center gap-2 mt-6 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Ver todos
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Recommendations Section */}
      <section>
        <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-3xl border border-border p-8 lg:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center animate-pulse-glow">
              <Sparkles className="text-accent" size={24} />
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                Recomendados para Você
              </h2>
              <p className="text-muted-foreground mt-1">
                Descubra novas histórias incríveis
              </p>
            </div>
          </div>
          <Suspense fallback={<NovelGridSkeleton count={8} />}>
            <NovelGrid novels={recommendations} />
          </Suspense>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl border border-border p-6 card-hover group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <BookOpen className="text-white" size={28} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Biblioteca Vasta
          </h3>
          <p className="text-muted-foreground">
            Acesse mais de {totalNovels} novels traduzidas em português brasileiro,
            de diversos gêneros e estilos.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 card-hover group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Zap className="text-white" size={28} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Leitura Otimizada
          </h3>
          <p className="text-muted-foreground">
            Interface limpa e personalizável para uma experiência de leitura
            confortável em qualquer dispositivo.
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 card-hover group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <Heart className="text-white" size={28} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Seus Favoritos
          </h3>
          <p className="text-muted-foreground">
            Salve suas novels favoritas e acompanhe seu progresso de leitura
            automaticamente.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1)_0%,_transparent_50%)] bg-[length:20px_20px]" />
        <div className="relative px-8 py-16 lg:py-20 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            Comece sua Aventura
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
            Explore mundos fantásticos, acompanhe heróis incríveis e mergulhe em
            histórias épicas. Tudo gratuito, tudo em português.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/novels"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-foreground rounded-xl font-bold hover:bg-white/90 transition-colors shadow-lg"
            >
              <BookOpen size={20} />
              Explorar Biblioteca
            </Link>
            <Link
              href="/favorites"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-colors"
            >
              <Heart size={20} />
              Meus Favoritos
            </Link>
          </div>
        </div>
      </section>

      {/* Footer spacing */}
      <div className="h-8" />
    </div>
  );
}
