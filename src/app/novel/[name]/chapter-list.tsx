"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, BookOpen, ChevronRight, ArrowUpDown, Check } from "lucide-react";
import { useReadingProgressStore } from "@/lib/store";

interface Chapter {
  title: string;
  link: string;
}

interface ChapterListProps {
  novelName: string;
  chapters: Chapter[];
}

export function ChapterList({ novelName, chapters }: ChapterListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const { progress } = useReadingProgressStore();

  const currentProgress = progress[novelName];
  const lastReadChapter = currentProgress?.chapterIndex;

  const filteredChapters = useMemo(() => {
    let result = [...chapters];

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((chapter) =>
        chapter.title.toLowerCase().includes(query)
      );
    }

    return result;
  }, [chapters, searchQuery]);

  const sortedChapters = useMemo(() => {
    if (sortOrder === "desc") {
      return [...filteredChapters].reverse();
    }
    return filteredChapters;
  }, [filteredChapters, sortOrder]);

  const displayChapters = showAll
    ? sortedChapters
    : sortedChapters.slice(0, 30);

  const hasMoreChapters = sortedChapters.length > 30;

  if (chapters.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <BookOpen className="text-muted-foreground" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Sem capítulos disponíveis
        </h3>
        <p className="text-muted-foreground">
          Esta novel ainda não possui capítulos traduzidos.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Sort */}
      <div className="p-4 lg:p-6 border-b border-border bg-background-secondary/50">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar capítulo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-11 py-2.5"
            />
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-muted rounded-xl text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
          >
            <ArrowUpDown size={16} />
            {sortOrder === "asc" ? "Mais antigos" : "Mais recentes"}
          </button>
        </div>

        {searchQuery && (
          <p className="mt-3 text-sm text-muted-foreground">
            {filteredChapters.length} {filteredChapters.length === 1 ? "resultado" : "resultados"} encontrados
          </p>
        )}
      </div>

      {/* Chapters Grid */}
      <div className="divide-y divide-border">
        {displayChapters.map((chapter) => {
          const originalIndex = sortOrder === "desc"
            ? chapters.length - 1 - chapters.indexOf(chapter)
            : chapters.indexOf(chapter);
          const isRead = lastReadChapter !== undefined && originalIndex <= lastReadChapter;
          const isCurrent = originalIndex === lastReadChapter;

          return (
            <Link
              key={chapter.title}
              href={`/novel/${encodeURIComponent(novelName)}/chapter/${originalIndex}`}
              className={`group flex items-center gap-4 p-4 lg:px-6 hover:bg-muted/50 transition-colors ${isCurrent ? "bg-primary/5 border-l-2 border-primary" : ""
                }`}
            >
              {/* Chapter number */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isCurrent
                  ? "bg-primary text-primary-foreground"
                  : isRead
                    ? "bg-success/15 text-success"
                    : "bg-muted text-muted-foreground"
                }`}>
                {isRead ? (
                  <Check size={20} />
                ) : (
                  <span className="font-semibold text-sm">{originalIndex + 1}</span>
                )}
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium line-clamp-1 transition-colors ${isCurrent
                    ? "text-primary"
                    : "text-foreground group-hover:text-primary"
                  }`}>
                  {chapter.title}
                </h3>
                {isCurrent && (
                  <p className="text-xs text-primary mt-0.5">Continuar leitura</p>
                )}
              </div>

              {/* Arrow */}
              <ChevronRight
                size={20}
                className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0"
              />
            </Link>
          );
        })}
      </div>

      {/* Show more button */}
      {hasMoreChapters && !showAll && (
        <div className="p-4 lg:p-6 border-t border-border">
          <button
            onClick={() => setShowAll(true)}
            className="w-full py-3 bg-muted rounded-xl text-foreground font-medium hover:bg-muted/80 transition-colors"
          >
            Mostrar todos os {sortedChapters.length} capítulos
          </button>
        </div>
      )}

      {showAll && hasMoreChapters && (
        <div className="p-4 lg:p-6 border-t border-border">
          <button
            onClick={() => setShowAll(false)}
            className="w-full py-3 bg-muted rounded-xl text-foreground font-medium hover:bg-muted/80 transition-colors"
          >
            Mostrar menos
          </button>
        </div>
      )}
    </div>
  );
}
