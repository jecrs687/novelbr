"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useReadingProgressStore } from "@/lib/store";
import { fetchNovelsList } from "@/lib/data";
import { NovelCover } from "@/components/ui/novel-cover";
import type { NovelsList } from "@/lib/schemas";
import {
    History,
    Clock,
    BookOpen,
    Trash2,
    ArrowRight,
    Calendar
} from "lucide-react";

export default function HistoryPage() {
    const { progress, clearProgress, clearAllProgress } = useReadingProgressStore();
    const [novels, setNovels] = useState<NovelsList>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchNovelsList()
            .then(setNovels)
            .finally(() => setIsLoading(false));
    }, []);

    // Sort by most recent
    const historyEntries = Object.values(progress)
        .sort((a, b) => new Date(b.lastRead).getTime() - new Date(a.lastRead).getTime());

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "Agora mesmo";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h atrás`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
        return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" });
    };

    const groupByDate = (entries: typeof historyEntries) => {
        const groups: Record<string, typeof historyEntries> = {};

        entries.forEach(entry => {
            const date = new Date(entry.lastRead);
            const today = new Date();
            const yesterday = new Date(today.getTime() - 86400000);

            let groupKey: string;
            if (date.toDateString() === today.toDateString()) {
                groupKey = "Hoje";
            } else if (date.toDateString() === yesterday.toDateString()) {
                groupKey = "Ontem";
            } else {
                groupKey = date.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });
            }

            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(entry);
        });

        return groups;
    };

    const groupedHistory = groupByDate(historyEntries);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="animate-pulse space-y-6">
                    <div className="h-12 bg-muted rounded-xl w-1/3" />
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-24 bg-muted rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <History className="text-primary" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Histórico de Leitura</h1>
                        <p className="text-muted-foreground">
                            {historyEntries.length} novels no histórico
                        </p>
                    </div>
                </div>

                {historyEntries.length > 0 && (
                    <button
                        onClick={() => {
                            if (confirm("Tem certeza que deseja limpar todo o histórico?")) {
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

            {/* Content */}
            {historyEntries.length === 0 ? (
                <div className="bg-card rounded-3xl border border-border p-12 text-center">
                    <History className="mx-auto mb-4 text-muted-foreground" size={64} />
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        Nenhum histórico ainda
                    </h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        Comece a ler novels para ver seu histórico de leitura aqui.
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
                <div className="space-y-8">
                    {Object.entries(groupedHistory).map(([date, entries]) => (
                        <div key={date}>
                            <div className="flex items-center gap-2 mb-4">
                                <Calendar size={18} className="text-muted-foreground" />
                                <h2 className="text-lg font-semibold text-foreground">{date}</h2>
                                <span className="text-sm text-muted-foreground">({entries.length})</span>
                            </div>

                            <div className="space-y-3">
                                {entries.map((entry) => {
                                    const novel = novels[entry.novelName];
                                    if (!novel) return null;

                                    const totalChapters = novel.cap || 0;
                                    const progressPercentage = totalChapters > 0
                                        ? Math.round(((entry.chapterIndex + 1) / totalChapters) * 100)
                                        : 0;

                                    return (
                                        <div
                                            key={entry.novelName}
                                            className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all"
                                        >
                                            <div className="flex gap-4 p-4">
                                                {/* Cover */}
                                                <Link
                                                    href={`/novel/${encodeURIComponent(entry.novelName)}`}
                                                    className="relative w-16 h-24 rounded-lg overflow-hidden flex-shrink-0"
                                                >
                                                    <NovelCover
                                                        src={novel.imagem}
                                                        alt={entry.novelName}
                                                        fill
                                                        sizes="64px"
                                                        className="object-cover"
                                                    />
                                                </Link>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <Link
                                                        href={`/novel/${encodeURIComponent(entry.novelName)}`}
                                                        className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                                                    >
                                                        {entry.novelName}
                                                    </Link>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Capítulo {entry.chapterIndex + 1}
                                                        {totalChapters > 0 && ` de ${totalChapters}`}
                                                    </p>

                                                    {/* Progress bar */}
                                                    <div className="mt-2 mb-1">
                                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                                                                style={{ width: `${progressPercentage}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">
                                                            {progressPercentage}% concluído
                                                        </span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Clock size={12} />
                                                            {formatTimeAgo(entry.lastRead)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col justify-between items-end">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            clearProgress(entry.novelName);
                                                        }}
                                                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                                                        title="Remover do histórico"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>

                                                    <Link
                                                        href={`/novel/${encodeURIComponent(entry.novelName)}/chapter/${entry.chapterIndex}`}
                                                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                                                    >
                                                        Continuar
                                                        <ArrowRight size={14} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
