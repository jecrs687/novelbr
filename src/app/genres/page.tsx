"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    BookOpen,
    Sword,
    Heart,
    Wand2,
    Skull,
    Rocket,
    Crown,
    Ghost,
    Sparkles,
    Shield,
    Flame,
    Wind,
    Search,
    ArrowRight
} from "lucide-react";

// Genre data with icons and colors
const GENRES = [
    { id: 1, name: "Ação", slug: "acao", icon: Sword, color: "from-red-500 to-orange-500", count: 45, description: "Batalhas épicas e aventuras intensas" },
    { id: 2, name: "Romance", slug: "romance", icon: Heart, color: "from-pink-500 to-rose-500", count: 38, description: "Histórias de amor emocionantes" },
    { id: 3, name: "Fantasia", slug: "fantasia", icon: Wand2, color: "from-purple-500 to-indigo-500", count: 62, description: "Mundos mágicos e criaturas fantásticas" },
    { id: 4, name: "Horror", slug: "horror", icon: Skull, color: "from-gray-600 to-gray-800", count: 12, description: "Suspense e terror psicológico" },
    { id: 5, name: "Ficção Científica", slug: "ficcao-cientifica", icon: Rocket, color: "from-blue-500 to-cyan-500", count: 28, description: "Tecnologia e futuros distópicos" },
    { id: 6, name: "Cultivo", slug: "cultivo", icon: Flame, color: "from-amber-500 to-yellow-500", count: 85, description: "Artes marciais e busca pelo poder" },
    { id: 7, name: "Drama", slug: "drama", icon: Crown, color: "from-emerald-500 to-teal-500", count: 34, description: "Intrigas políticas e conflitos" },
    { id: 8, name: "Comédia", slug: "comedia", icon: Sparkles, color: "from-yellow-400 to-orange-400", count: 25, description: "Histórias divertidas e leves" },
    { id: 9, name: "Sobrenatural", slug: "sobrenatural", icon: Ghost, color: "from-violet-500 to-purple-600", count: 31, description: "Poderes além do natural" },
    { id: 10, name: "Aventura", slug: "aventura", icon: Wind, color: "from-sky-500 to-blue-500", count: 56, description: "Jornadas épicas e descobertas" },
    { id: 11, name: "Xuanhuan", slug: "xuanhuan", icon: Shield, color: "from-rose-500 to-pink-600", count: 42, description: "Fantasia oriental e mitologia" },
    { id: 12, name: "Xianxia", slug: "xianxia", icon: BookOpen, color: "from-indigo-500 to-blue-600", count: 48, description: "Imortais e cultivação espiritual" },
];

export default function GenresPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "count">("count");

    const filteredGenres = useMemo(() => {
        let genres = [...GENRES];

        if (searchQuery) {
            genres = genres.filter(genre =>
                genre.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                genre.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (sortBy === "name") {
            genres.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            genres.sort((a, b) => b.count - a.count);
        }

        return genres;
    }, [searchQuery, sortBy]);

    const totalNovels = useMemo(() =>
        GENRES.reduce((sum, g) => sum + g.count, 0),
        []);

    return (
        <div className="space-y-8 py-6">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-foreground">
                    Explorar Gêneros
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Descubra novels organizadas por gênero. Temos {GENRES.length} gêneros
                    diferentes com mais de {totalNovels} novels para você explorar.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card border border-border rounded-2xl p-4">
                <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar gênero..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64 pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Ordenar por:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "name" | "count")}
                        className="px-3 py-2 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="count">Mais Populares</option>
                        <option value="name">Nome A-Z</option>
                    </select>
                </div>
            </div>

            {/* Genres Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGenres.map((genre) => {
                    const Icon = genre.icon;
                    return (
                        <Link
                            key={genre.id}
                            href={`/novels?genre=${genre.slug}`}
                            className="group relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1"
                        >
                            {/* Icon Badge */}
                            <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${genre.color} mb-4 shadow-lg`}>
                                <Icon className="text-white" size={28} />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {genre.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                {genre.description}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-primary">
                                    {genre.count} novels
                                </span>
                                <ArrowRight
                                    className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                                    size={18}
                                />
                            </div>

                            {/* Hover Glow */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${genre.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
                        </Link>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredGenres.length === 0 && (
                <div className="text-center py-12">
                    <div className="p-4 bg-muted rounded-full inline-flex mb-4">
                        <Search className="text-muted-foreground" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        Nenhum gênero encontrado
                    </h3>
                    <p className="text-muted-foreground">
                        Tente buscar por outro termo
                    </p>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{GENRES.length}</div>
                    <div className="text-sm text-muted-foreground">Gêneros</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">{totalNovels}</div>
                    <div className="text-sm text-muted-foreground">Novels</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-accent">
                        {Math.max(...GENRES.map(g => g.count))}
                    </div>
                    <div className="text-sm text-muted-foreground">Maior Gênero</div>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-500">
                        {Math.round(totalNovels / GENRES.length)}
                    </div>
                    <div className="text-sm text-muted-foreground">Média por Gênero</div>
                </div>
            </div>
        </div>
    );
}
