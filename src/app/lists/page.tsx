"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    List,
    Plus,
    Search,
    BookOpen,
    Edit,
    Trash2,
    Lock,
    Globe,
    FolderOpen,
    X,
    Loader2,
} from "lucide-react";
import { useUserStore } from "@/lib/store";

interface ReadingListItem {
    id: string;
    order: number;
    note: string | null;
    novel: {
        id: string;
        slug: string;
        title: string;
        coverUrl: string | null;
    };
}

interface ReadingListData {
    id: string;
    name: string;
    description: string | null;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    items: ReadingListItem[];
    _count: {
        items: number;
    };
}

export default function ReadingListsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [lists, setLists] = useState<ReadingListData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newListName, setNewListName] = useState("");
    const [newListDescription, setNewListDescription] = useState("");
    const [newListPublic, setNewListPublic] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const { user, isAuthenticated } = useUserStore();

    const fetchLists = useCallback(async () => {
        if (!user?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/reading-lists?userId=${user.id}`);
            const data = await response.json();

            if (data.success) {
                setLists(data.data || []);
            } else {
                setError(data.error || "Erro ao carregar listas");
            }
        } catch {
            setError("Erro ao conectar com o servidor");
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchLists();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, user?.id, fetchLists]);

    const filteredLists = useMemo(() => {
        if (!searchQuery) return lists;
        const query = searchQuery.toLowerCase();
        return lists.filter(
            (list) =>
                list.name.toLowerCase().includes(query) ||
                list.description?.toLowerCase().includes(query)
        );
    }, [lists, searchQuery]);

    const handleCreateList = async () => {
        if (!newListName.trim() || !user?.id) return;

        setIsCreating(true);

        try {
            const response = await fetch("/api/reading-lists", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    name: newListName,
                    description: newListDescription || undefined,
                    isPublic: newListPublic,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Add new list to state
                setLists((prev) => [
                    {
                        ...data.data,
                        items: [],
                        _count: { items: 0 },
                    },
                    ...prev,
                ]);
                setShowCreateModal(false);
                setNewListName("");
                setNewListDescription("");
                setNewListPublic(false);
            }
        } catch {
            console.error("Error creating list");
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteList = async (id: string) => {
        // Note: DELETE endpoint would need to be added to the API
        // For now, just remove from local state
        setLists((prev) => prev.filter((list) => list.id !== id));
    };

    const totalNovels = useMemo(
        () => lists.reduce((sum, list) => sum + list._count.items, 0),
        [lists]
    );

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
                        <List className="text-muted-foreground" size={48} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        Faça login para ver suas listas
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Entre na sua conta para acessar e gerenciar suas listas de leitura
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
                        <List className="text-primary" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Minhas Listas
                        </h1>
                        <p className="text-muted-foreground">
                            {lists.length} listas · {totalNovels} novels
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                    <Plus size={20} />
                    Nova Lista
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                />
                <input
                    type="text"
                    placeholder="Buscar listas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
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
                        onClick={fetchLists}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {/* Lists Grid */}
            {!isLoading && !error && filteredLists.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLists.map((list) => (
                        <div
                            key={list.id}
                            className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg"
                        >
                            {/* Cover Images */}
                            <div className="h-32 bg-muted relative overflow-hidden">
                                {list.items.length > 0 ? (
                                    <div className="absolute inset-0 flex">
                                        {list.items.slice(0, 3).map((item, i) => (
                                            <div
                                                key={item.id}
                                                className="flex-1 bg-gradient-to-br from-primary/20 to-accent/20"
                                                style={{
                                                    opacity: 1 - i * 0.2,
                                                    backgroundImage: item.novel.coverUrl ? `url(${item.novel.coverUrl})` : undefined,
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                                        <FolderOpen className="text-muted-foreground" size={48} />
                                    </div>
                                )}

                                {/* Public/Private Badge */}
                                <div className="absolute top-3 right-3">
                                    <span
                                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${list.isPublic
                                                ? "bg-success/20 text-success"
                                                : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {list.isPublic ? <Globe size={12} /> : <Lock size={12} />}
                                        {list.isPublic ? "Pública" : "Privada"}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        className="p-2 bg-card/80 backdrop-blur rounded-lg text-foreground hover:bg-card transition-colors"
                                        title="Editar"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteList(list.id)}
                                        className="p-2 bg-card/80 backdrop-blur rounded-lg text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <Link
                                href={`/lists/${list.id}`}
                                className="block p-4"
                            >
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {list.name}
                                </h3>
                                {list.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                        {list.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <BookOpen size={14} />
                                            {list._count.items} novels
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(list.updatedAt)}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : !isLoading && !error ? (
                // Empty State
                <div className="text-center py-16 bg-card border border-border rounded-2xl">
                    <div className="inline-flex p-4 bg-muted rounded-full mb-4">
                        <FolderOpen className="text-muted-foreground" size={48} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        {searchQuery ? "Nenhuma lista encontrada" : "Nenhuma lista criada"}
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        {searchQuery
                            ? "Tente buscar por outros termos"
                            : "Crie listas para organizar suas novels favoritas"}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                        >
                            <Plus size={20} />
                            Criar Primeira Lista
                        </button>
                    )}
                </div>
            ) : null}

            {/* Create List Modal */}
            {showCreateModal && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={() => setShowCreateModal(false)}
                    />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-2xl p-6 z-50 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground">Nova Lista</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Nome da Lista *
                                </label>
                                <input
                                    type="text"
                                    value={newListName}
                                    onChange={(e) => setNewListName(e.target.value)}
                                    placeholder="Ex: Favoritos, Para Ler..."
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    value={newListDescription}
                                    onChange={(e) => setNewListDescription(e.target.value)}
                                    placeholder="Uma breve descrição da lista..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setNewListPublic(!newListPublic)}
                                    className={`relative w-12 h-7 rounded-full transition-colors ${newListPublic ? "bg-primary" : "bg-muted"
                                        }`}
                                >
                                    <span
                                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${newListPublic ? "translate-x-5" : ""
                                            }`}
                                    />
                                </button>
                                <div>
                                    <span className="text-sm font-medium text-foreground">
                                        Lista Pública
                                    </span>
                                    <p className="text-xs text-muted-foreground">
                                        Outros usuários poderão ver esta lista
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-3 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateList}
                                    disabled={!newListName.trim() || isCreating}
                                    className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isCreating && <Loader2 className="animate-spin" size={18} />}
                                    Criar Lista
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
