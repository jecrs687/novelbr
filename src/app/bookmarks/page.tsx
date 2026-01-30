"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Bookmark,
    BookOpen,
    Trash2,
    Search,
    Filter,
    Calendar,
    ArrowRight,
    FolderOpen,
    Loader2
} from "lucide-react";
import { useUserStore } from "@/lib/store";

interface BookmarkData {
    id: string;
    title: string | null;
    note: string | null;
    position: number | null;
    createdAt: string;
    novel: {
        id: string;
        slug: string;
        title: string;
    };
    chapter: {
        id: string;
        chapterNumber: number;
        title: string;
    };
}

type SortOption = "recent" | "oldest" | "novel";

export default function BookmarksPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<SortOption>("recent");
    const [showFilters, setShowFilters] = useState(false);
    const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user, isAuthenticated } = useUserStore();

    const fetchBookmarks = useCallback(async () => {
        if (!user?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/bookmarks?userId=${user.id}`);
            const data = await response.json();

            if (data.success) {
                setBookmarks(data.data || []);
            } else {
                setError(data.error || "Erro ao carregar marcadores");
            }
        } catch {
            setError("Erro ao conectar com o servidor");
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchBookmarks();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, user?.id, fetchBookmarks]);

    const filteredBookmarks = useMemo(() => {
        let result = [...bookmarks];

        // Filter by search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (b) =>
                    b.title?.toLowerCase().includes(query) ||
                    b.note?.toLowerCase().includes(query) ||
                    b.novel.title.toLowerCase().includes(query) ||
                    b.chapter.title.toLowerCase().includes(query)
            );
        }

        // Sort
        switch (sortBy) {
            case "recent":
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case "oldest":
                result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case "novel":
                result.sort((a, b) => a.novel.title.localeCompare(b.novel.title));
                break;
        }

        return result;
    }, [bookmarks, searchQuery, sortBy]);

    // Group by novel for grouped view
    const groupedByNovel = useMemo(() => {
        const groups: Record<string, BookmarkData[]> = {};
        filteredBookmarks.forEach((bookmark) => {
            if (!groups[bookmark.novel.id]) {
                groups[bookmark.novel.id] = [];
            }
            groups[bookmark.novel.id].push(bookmark);
        });
        return groups;
    }, [filteredBookmarks]);

    const handleDelete = async (id: string) => {
        if (!user?.id) return;

        try {
            const response = await fetch(`/api/bookmarks?id=${id}&userId=${user.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setBookmarks((prev) => prev.filter((b) => b.id !== id));
            }
        } catch {
            console.error("Error deleting bookmark");
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return "Agora há pouco";
        if (hours < 24) return `${hours}h atrás`;
        if (days < 7) return `${days}d atrás`;
        return date.toLocaleDateString("pt-BR");
    };

    // Not authenticated state
    if (!isAuthenticated) {
        return (
            <div className="space-y-8 py-6">
                <div className="text-center py-16 bg-card border border-border rounded-2xl">
                    <div className="inline-flex p-4 bg-muted rounded-full mb-4">
                        <Bookmark className="text-muted-foreground" size={48} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        Faça login para ver seus marcadores
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Entre na sua conta para acessar e gerenciar seus marcadores salvos
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Bookmark className="text-primary" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Meus Marcadores
                        </h1>
                        <p className="text-muted-foreground">
                            {bookmarks.length} marcadores salvos
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={20}
                    />
                    <input
                        type="text"
                        placeholder="Buscar marcadores..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${showFilters
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border text-foreground hover:bg-muted"
                            }`}
                    >
                        <Filter size={20} />
                        Filtros
                    </button>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="recent">Mais Recentes</option>
                        <option value="oldest">Mais Antigos</option>
                        <option value="novel">Por Novel</option>
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="animate-spin text-primary" size={48} />
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-16 bg-destructive/10 border border-destructive/20 rounded-2xl">
                    <p className="text-destructive font-medium">{error}</p>
                    <button
                        onClick={fetchBookmarks}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {/* Bookmarks List */}
            {!isLoading && !error && filteredBookmarks.length > 0 ? (
                sortBy === "novel" ? (
                    // Grouped by novel view
                    <div className="space-y-8">
                        {Object.entries(groupedByNovel).map(([novelId, novelBookmarks]) => {
                            const firstBookmark = novelBookmarks[0];
                            return (
                                <div key={novelId}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-16 bg-muted rounded-lg overflow-hidden">
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <BookOpen size={20} />
                                            </div>
                                        </div>
                                        <div>
                                            <Link
                                                href={`/novel/${firstBookmark.novel.slug}`}
                                                className="font-semibold text-foreground hover:text-primary transition-colors"
                                            >
                                                {firstBookmark.novel.title}
                                            </Link>
                                            <p className="text-sm text-muted-foreground">
                                                {novelBookmarks.length} marcadores
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid gap-3 pl-4 border-l-2 border-border">
                                        {novelBookmarks.map((bookmark) => (
                                            <BookmarkCard
                                                key={bookmark.id}
                                                bookmark={bookmark}
                                                formatDate={formatDate}
                                                onDelete={handleDelete}
                                                showNovel={false}
                                            />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    // List view
                    <div className="grid gap-4">
                        {filteredBookmarks.map((bookmark) => (
                            <BookmarkCard
                                key={bookmark.id}
                                bookmark={bookmark}
                                formatDate={formatDate}
                                onDelete={handleDelete}
                                showNovel={true}
                            />
                        ))}
                    </div>
                )
            ) : !isLoading && !error ? (
                // Empty State
                <div className="text-center py-16 bg-card border border-border rounded-2xl">
                    <div className="inline-flex p-4 bg-muted rounded-full mb-4">
                        <FolderOpen className="text-muted-foreground" size={48} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        {searchQuery ? "Nenhum marcador encontrado" : "Nenhum marcador salvo"}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        {searchQuery
                            ? "Tente buscar por outros termos"
                            : "Marque partes importantes das novels para acessar rapidamente depois"}
                    </p>
                    {!searchQuery && (
                        <Link
                            href="/novels"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <BookOpen size={20} />
                            Explorar Novels
                        </Link>
                    )}
                </div>
            ) : null}
        </div>
    );
}

function BookmarkCard({
    bookmark,
    formatDate,
    onDelete,
    showNovel,
}: {
    bookmark: BookmarkData;
    formatDate: (date: string) => string;
    onDelete: (id: string) => void;
    showNovel: boolean;
}) {
    return (
        <div className="group flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors">
            {showNovel && (
                <div className="hidden sm:block w-12 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <BookOpen size={20} />
                    </div>
                </div>
            )}

            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                            {bookmark.title || `Marcador no Cap. ${bookmark.chapter.chapterNumber}`}
                        </h3>
                        {showNovel && (
                            <Link
                                href={`/novel/${bookmark.novel.slug}`}
                                className="text-sm text-primary hover:underline"
                            >
                                {bookmark.novel.title}
                            </Link>
                        )}
                        <p className="text-sm text-muted-foreground">
                            Capítulo {bookmark.chapter.chapterNumber} · {bookmark.chapter.title}
                        </p>
                        {bookmark.note && (
                            <p className="mt-2 text-sm text-muted-foreground italic">
                                &quot;{bookmark.note}&quot;
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar size={14} />
                            {formatDate(bookmark.createdAt)}
                        </span>
                        <button
                            onClick={() => onDelete(bookmark.id)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            title="Remover marcador"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="mt-3">
                    <Link
                        href={`/novel/${bookmark.novel.slug}/chapter/${bookmark.chapter.chapterNumber}`}
                        className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                    >
                        Ir para o marcador
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
