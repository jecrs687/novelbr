import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchChapterContent, fetchChapterLinks } from "@/lib/data";
import { LoadingPage } from "@/components/ui/loading";
import { ReaderContent } from "./reader-content";
import { ReaderControls } from "./reader-controls";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Home,
  List,
} from "lucide-react";

interface ChapterPageProps {
  params: Promise<{ name: string; chapterIndex: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { name, chapterIndex } = await params;
  const decodedName = decodeURIComponent(name);
  const index = parseInt(chapterIndex, 10);

  const links = await fetchChapterLinks();
  const chapters = links[decodedName];

  if (!chapters) {
    return { title: "Capítulo não encontrado - NovelBR" };
  }

  const chapterTitles = Object.keys(chapters);
  const chapterTitle = chapterTitles[index] || "Capítulo";

  return {
    title: `${chapterTitle} - ${decodedName} - NovelBR`,
    description: `Leia ${chapterTitle} de ${decodedName} traduzido para português.`,
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { name, chapterIndex } = await params;
  const decodedName = decodeURIComponent(name);
  const index = parseInt(chapterIndex, 10);

  const links = await fetchChapterLinks();
  const chapters = links[decodedName];

  if (!chapters || isNaN(index)) {
    notFound();
  }

  const chapterTitles = Object.keys(chapters);
  const currentTitle = chapterTitles[index];

  if (!currentTitle) {
    notFound();
  }

  // Fetch chapter content
  let content;
  try {
    content = await fetchChapterContent(decodedName, index);
  } catch {
    notFound();
  }

  const hasPrevious = index > 0;
  const hasNext = index < chapterTitles.length - 1;

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation */}
        <nav className="sticky top-0 z-40 -mx-4 lg:-mx-8 px-4 lg:px-8 py-3 mb-8">
          <div className="glass rounded-2xl p-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Link
                  href={`/novel/${encodeURIComponent(decodedName)}`}
                  className="p-2.5 bg-muted rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                  aria-label="Voltar para a novel"
                >
                  <ArrowLeft size={20} />
                </Link>
                <div className="min-w-0 hidden sm:block">
                  <Link
                    href={`/novel/${encodeURIComponent(decodedName)}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                  >
                    {decodedName}
                  </Link>
                  <h1 className="font-semibold text-foreground truncate">
                    Capítulo {index + 1}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  className="p-2.5 bg-muted rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                  aria-label="Início"
                >
                  <Home size={20} />
                </Link>
                <Link
                  href={`/novel/${encodeURIComponent(decodedName)}`}
                  className="p-2.5 bg-muted rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
                  aria-label="Lista de capítulos"
                >
                  <List size={20} />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Chapter Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            <BookOpen size={16} />
            <span>Capítulo {index + 1} de {chapterTitles.length}</span>
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-3 text-balance">
            {currentTitle}
          </h2>
          <div className="divider max-w-24 mx-auto" />
        </header>

        {/* Reader Controls */}
        <ReaderControls />

        {/* Chapter Content */}
        <article className="my-8">
          <ReaderContent content={content} />
        </article>

        {/* Progress bar */}
        <div className="h-1 bg-muted rounded-full overflow-hidden my-8">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((index + 1) / chapterTitles.length) * 100}%` }}
          />
        </div>

        {/* Bottom Navigation */}
        <footer className="flex flex-col gap-6 pt-8 border-t border-border">
          <div className="flex items-center justify-between gap-4">
            {hasPrevious ? (
              <Link
                href={`/novel/${encodeURIComponent(decodedName)}/chapter/${index - 1}`}
                className="flex items-center gap-2 px-5 py-3 bg-card border border-border rounded-xl hover:border-primary hover:text-primary transition-all group"
              >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">Capítulo Anterior</span>
                <span className="sm:hidden">Anterior</span>
              </Link>
            ) : (
              <div />
            )}

            <Link
              href={`/novel/${encodeURIComponent(decodedName)}`}
              className="px-5 py-3 bg-muted rounded-xl hover:bg-muted/80 transition-colors text-center"
            >
              <BookOpen size={20} className="mx-auto mb-1" />
              <span className="text-xs">Capítulos</span>
            </Link>

            {hasNext ? (
              <Link
                href={`/novel/${encodeURIComponent(decodedName)}/chapter/${index + 1}`}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors group"
              >
                <span className="hidden sm:inline">Próximo Capítulo</span>
                <span className="sm:hidden">Próximo</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div className="px-5 py-3 bg-success/15 text-success rounded-xl text-center">
                <span className="text-sm font-medium">✓ Concluído</span>
              </div>
            )}
          </div>

          {/* Novel info */}
          <div className="bg-card rounded-2xl border border-border p-6 text-center">
            <p className="text-muted-foreground mb-3">Você está lendo</p>
            <Link
              href={`/novel/${encodeURIComponent(decodedName)}`}
              className="text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              {decodedName}
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              {chapterTitles.length} capítulos disponíveis
            </p>
          </div>
        </footer>
      </div>
    </Suspense>
  );
}
