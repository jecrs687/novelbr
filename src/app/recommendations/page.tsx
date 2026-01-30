"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { fetchNovelsList } from "@/lib/data";
import { NovelCard } from "@/components/novel/novel-card";
import { NovelGridSkeleton } from "@/components/ui/loading";
import { useReadingProgressStore, useUserStore } from "@/lib/store";
import type { NovelsList } from "@/lib/schemas";
import {
    Sparkles,
    Heart,
    BookOpen,
    TrendingUp,
    RefreshCw,
    Shuffle,
    Star
} from "lucide-react";

// Seeded random for consistent shuffling
function seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function seededShuffle<T>(array: T[], seed: number): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed + i) * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function RecommendationsPage() {
    const [novels, setNovels] = useState<NovelsList>({});
    const [isLoading, setIsLoading] = useState(true);
    const [seed, setSeed] = useState(() => Date.now());

    const { progress, favorites } = useReadingProgressStore();
    const { user } = useUserStore();

    useEffect(() => {
        fetchNovelsList()
            .then(setNovels)
            .finally(() => setIsLoading(false));
    }, []);

    // Generate personalized recommendations
    const recommendations = useMemo(() => {
        const novelEntries = Object.entries(novels);
        if (novelEntries.length === 0) return { forYou: [], trending: [], discover: [], similar: [] };

        // Novels user hasn't read
        const readNovelNames = Object.keys(progress);
        const unreadNovels = novelEntries.filter(([name]) => !readNovelNames.includes(name));

        // For You - shuffled unread novels
        const forYou = seededShuffle(unreadNovels, seed).slice(0, 8);

        // Trending - top by chapters
        const trending = [...novelEntries]
            .sort((a, b) => (b[1].cap || 0) - (a[1].cap || 0))
            .slice(0, 8);

        // Discover - shuffled selection
        const discover = seededShuffle(novelEntries, seed + 1000).slice(0, 8);

        // Similar to favorites
        const similar = favorites.length > 0
            ? seededShuffle(unreadNovels, seed + 2000).slice(0, 8)
            : seededShuffle(novelEntries, seed + 2000).slice(0, 8);

        return { forYou, trending, discover, similar };
    }, [novels, progress, favorites, seed]);

    const handleRefresh = useCallback(() => {
        setSeed(Date.now());
    }, []);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
                        <Sparkles className="text-primary" size={32} />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Para Você
                    </h1>
                </div>
                <NovelGridSkeleton count={8} />
            </div>
        );
    }

    const sections = [
        {
            title: user ? `Recomendado para ${user.displayName || user.username}` : "Recomendado para Você",
            subtitle: "Baseado no seu histórico de leitura",
            icon: Sparkles,
            color: "text-primary",
            bgColor: "bg-primary/10",
            novels: recommendations.forYou,
        },
        {
            title: "Em Alta",
            subtitle: "Os mais populares do momento",
            icon: TrendingUp,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
            novels: recommendations.trending,
        },
        {
            title: "Descubra",
            subtitle: "Novos mundos para explorar",
            icon: Shuffle,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
            novels: recommendations.discover,
        },
        {
            title: favorites.length > 0 ? "Porque você gostou de..." : "Destaques",
            subtitle: favorites.length > 0 ? "Similar aos seus favoritos" : "Novels em destaque",
            icon: favorites.length > 0 ? Heart : Star,
            color: favorites.length > 0 ? "text-rose-500" : "text-amber-500",
            bgColor: favorites.length > 0 ? "bg-rose-500/10" : "bg-amber-500/10",
            novels: recommendations.similar,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
                    <Sparkles className="text-primary" size={32} />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                    Para Você
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-6">
                    Recomendações personalizadas baseadas no seu gosto
                </p>
                <button
                    onClick={handleRefresh}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-colors"
                >
                    <RefreshCw size={18} />
                    Atualizar Recomendações
                </button>
            </div>

            {/* Recommendation Sections */}
            {sections.map((section) => (
                <section key={section.title}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2.5 rounded-xl ${section.bgColor}`}>
                            <section.icon className={section.color} size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                            <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {section.novels.map(([name, novel]) => (
                            <NovelCard key={name} name={name} novel={novel} />
                        ))}
                    </div>
                </section>
            ))}

            {/* CTA */}
            <div className="text-center bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-3xl p-8 border border-border">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                    Quer mais recomendações?
                </h3>
                <p className="text-muted-foreground mb-6">
                    Quanto mais você lê, melhores ficam as suas recomendações!
                </p>
                <Link
                    href="/novels"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                    <BookOpen size={20} />
                    Explorar Biblioteca
                </Link>
            </div>
        </div>
    );
}
