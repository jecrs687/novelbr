import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchNovelsList, fetchChapterLinks } from "@/lib/data";
import { LoadingPage } from "@/components/ui/loading";
import { ChapterList } from "./chapter-list";
import { FavoriteButton } from "./favorite-button";
import {
  BookOpen,
  ArrowLeft,
  ExternalLink,
  BookMarked,
  Star,
  Share2,
  Bookmark,
} from "lucide-react";

interface NovelPageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: NovelPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const novels = await fetchNovelsList();
  const novel = novels[decodedName];

  if (!novel) {
    return {
      title: "Novel não encontrada - NovelBR",
    };
  }

  return {
    title: `${decodedName} - NovelBR`,
    description: novel.resumo.join(" ").slice(0, 160),
    openGraph: {
      title: decodedName,
      description: novel.resumo.join(" ").slice(0, 160),
      images: [novel.imagem],
    },
  };
}

// Placeholder gradient based on name
function getPlaceholderGradient(name: string) {
  const colors = [
    "from-purple-600 via-purple-500 to-indigo-600",
    "from-blue-600 via-blue-500 to-cyan-600",
    "from-emerald-600 via-emerald-500 to-teal-600",
    "from-rose-600 via-rose-500 to-pink-600",
    "from-amber-600 via-amber-500 to-orange-600",
    "from-violet-600 via-violet-500 to-purple-600",
  ];
  const index = name.length % colors.length;
  return colors[index];
}

export default async function NovelPage({ params }: NovelPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const [novels, links] = await Promise.all([
    fetchNovelsList(),
    fetchChapterLinks(),
  ]);

  const novel = novels[decodedName];
  const chapters = links[decodedName];

  if (!novel) {
    notFound();
  }

  const chapterEntries = chapters
    ? Object.entries(chapters).map(([title, link]) => ({ title, link }))
    : [];

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <Link
          href="/novels"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Voltar para biblioteca</span>
        </Link>

        {/* Novel Header - Hero Section */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background blur image */}
          <div className="absolute inset-0">
            {novel.imagem ? (
              <Image
                src={novel.imagem}
                alt=""
                fill
                className="object-cover blur-2xl scale-110 opacity-30"
                priority
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${getPlaceholderGradient(decodedName)} opacity-30`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80" />
          </div>

          {/* Content */}
          <div className="relative p-6 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cover Image */}
              <div className="relative mx-auto lg:mx-0 w-64 h-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/10">
                {novel.imagem ? (
                  <Image
                    src={novel.imagem}
                    alt={decodedName}
                    fill
                    className="object-cover"
                    priority
                    sizes="256px"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${getPlaceholderGradient(decodedName)}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="text-white/40" size={64} />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center lg:text-left">
                {/* Title and Favorite */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                    {decodedName}
                  </h1>
                  <div className="flex items-center justify-center lg:justify-start gap-2">
                    <FavoriteButton novelName={decodedName} />
                    <button className="p-3 bg-card/80 rounded-xl border border-border hover:bg-card transition-colors">
                      <Share2 size={20} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Genres */}
                {novel.genero && novel.genero.length > 0 && (
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                    {novel.genero.map((genre) => (
                      <span
                        key={genre}
                        className="badge badge-primary"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                      <BookMarked className="text-primary" size={20} />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-foreground">{chapterEntries.length}</div>
                      <div className="text-xs text-muted-foreground">Capítulos</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                      <Star className="text-accent" size={20} />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-foreground">N/A</div>
                      <div className="text-xs text-muted-foreground">Avaliação</div>
                    </div>
                  </div>
                  {novel.link && (
                    <a
                      href={novel.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center">
                        <ExternalLink className="text-secondary" size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-foreground">Fonte</div>
                        <div className="text-xs text-muted-foreground">Original</div>
                      </div>
                    </a>
                  )}
                </div>

                {/* CTA Buttons */}
                {chapterEntries.length > 0 && (
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                    <Link
                      href={`/novel/${encodeURIComponent(decodedName)}/chapter/0`}
                      className="btn-primary"
                    >
                      <BookOpen size={20} />
                      Começar a Ler
                    </Link>
                    <button className="btn-secondary">
                      <Bookmark size={20} />
                      Continuar Leitura
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="text-primary" size={22} />
            Sinopse
          </h2>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {novel.resumo.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Chapters */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-6 lg:p-8 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <BookMarked className="text-accent" size={22} />
                Lista de Capítulos
              </h2>
              <span className="badge badge-accent">
                {chapterEntries.length} capítulos
              </span>
            </div>
          </div>
          <ChapterList
            novelName={decodedName}
            chapters={chapterEntries}
          />
        </div>
      </div>
    </Suspense>
  );
}
