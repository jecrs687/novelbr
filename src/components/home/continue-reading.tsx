"use client";

import Link from "next/link";
import { Clock, ArrowRight, Trash2 } from "lucide-react";
import { useReadingProgressStore } from "@/lib/store";
import { NovelCover } from "@/components/ui/novel-cover";
import type { NovelsList } from "@/lib/schemas";

interface ContinueReadingProps {
    novels: NovelsList;
}

export function ContinueReading({ novels }: ContinueReadingProps) {
    const { progress, clearProgress } = useReadingProgressStore();

    // Get all progress entries sorted by most recent
    const progressEntries = Object.values(progress)
        .filter(entry => novels[entry.novelName]) // Only show novels that exist
        .sort((a, b) => new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime())
        .slice(0, 6);

    if (progressEntries.length === 0) {
        return null;
    }

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Agora mesmo";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h atrás`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
        return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
    };

    return (
        <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                        <Clock className="text-primary" size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Continue Lendo</h2>
                        <p className="text-sm text-muted-foreground">Retome de onde parou</p>
                    </div>
                </div>
                <Link
                    href="/novels"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    Ver mais
                    <ArrowRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {progressEntries.map((entry) => {
                    const novel = novels[entry.novelName];
                    if (!novel) return null;

                    const totalChapters = novel.cap || 0;
                    const progressPercentage = totalChapters > 0
                        ? Math.round(((entry.chapterIndex + 1) / totalChapters) * 100)
                        : 0;

                    return (
                        <div
                            key={entry.novelName}
                            className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all"
                        >
                            <Link
                                href={`/novel/${encodeURIComponent(entry.novelName)}/chapter/${entry.chapterIndex}`}
                                className="flex gap-4 p-4"
                            >
                                {/* Cover */}
                                <div className="relative w-20 h-28 rounded-lg overflow-hidden flex-shrink-0">
                                    <NovelCover
                                        src={novel.imagem}
                                        alt={entry.novelName}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground truncate mb-1 group-hover:text-primary transition-colors">
                                        {entry.novelName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Capítulo {entry.chapterIndex + 1}
                                        {totalChapters > 0 && ` de ${totalChapters}`}
                                    </p>

                                    {/* Progress bar */}
                                    <div className="mb-2">
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                                                style={{ width: `${progressPercentage}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-muted-foreground">{progressPercentage}% concluído</span>
                                            <span className="text-xs text-muted-foreground">{formatTimeAgo(entry.lastRead)}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Remove button */}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    clearProgress(entry.novelName);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-muted/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-all"
                                title="Remover do histórico"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
