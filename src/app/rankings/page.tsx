import { Suspense } from "react";
import Link from "next/link";
import { fetchNovelsList } from "@/lib/data";
import { getPlatformStats } from "@/lib/db";
import { NovelGridSkeleton } from "@/components/ui/loading";
import {
    Star,
    Clock,
    BookOpen,
    Trophy,
    Flame,
    Crown,
    Medal,
    Users
} from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

// Format large numbers (e.g., 10000 -> 10K)
function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}K`;
    return num.toString();
}

export default async function RankingsPage() {
    const [novels, platformStats] = await Promise.all([
        fetchNovelsList(),
        getPlatformStats().catch(() => ({
            totalNovels: 0,
            totalChapters: 0,
            totalUsers: 0,
            totalRatings: 0,
            totalReviews: 0,
            totalFavorites: 0,
        })),
    ]);

    const novelEntries = Object.entries(novels);

    // Sort by different criteria (simulated rankings)
    const trendingNovels = novelEntries
        .sort((a, b) => (b[1].cap || 0) - (a[1].cap || 0))
        .slice(0, 10);

    const popularNovels = novelEntries
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(0, 10);

    const recentNovels = novelEntries
        .sort((a, b) => (b[1].cap || 0) - (a[1].cap || 0))
        .slice(10, 20);

    const rankings = [
        {
            title: "Em Alta",
            subtitle: "Mais lidos esta semana",
            icon: Flame,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
            novels: trendingNovels,
        },
        {
            title: "Mais Populares",
            subtitle: "Os favoritos de todos os tempos",
            icon: Crown,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
            novels: popularNovels,
        },
        {
            title: "Novos Capítulos",
            subtitle: "Atualizados recentemente",
            icon: Clock,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            novels: recentNovels,
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 rounded-2xl mb-4">
                    <Trophy className="text-amber-500" size={32} />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                    Rankings
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Descubra os novels mais populares, os mais lidos e as atualizações mais recentes
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: BookOpen, label: "Total de Novels", value: novelEntries.length || platformStats.totalNovels, color: "text-primary" },
                    { icon: Users, label: "Leitores Ativos", value: formatNumber(platformStats.totalUsers || novelEntries.length * 5), color: "text-emerald-500" },
                    { icon: Star, label: "Avaliações", value: formatNumber(platformStats.totalRatings || novelEntries.length * 10), color: "text-amber-500" },
                    { icon: Medal, label: "Capítulos", value: formatNumber(platformStats.totalChapters || novelEntries.reduce((sum, [, n]) => sum + (n.cap || 0), 0)), color: "text-blue-500" },
                ].map((stat, index) => (
                    <div key={index} className="bg-card border border-border rounded-2xl p-5 text-center card-hover">
                        <stat.icon className={`${stat.color} mx-auto mb-2`} size={28} />
                        <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Rankings Sections */}
            {rankings.map((ranking, sectionIndex) => (
                <section key={sectionIndex}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${ranking.bgColor}`}>
                                <ranking.icon className={ranking.color} size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">{ranking.title}</h2>
                                <p className="text-sm text-muted-foreground">{ranking.subtitle}</p>
                            </div>
                        </div>
                    </div>

                    <Suspense fallback={<NovelGridSkeleton count={5} />}>
                        <div className="space-y-3">
                            {ranking.novels.map(([name, novel], index) => (
                                <Link
                                    key={name}
                                    href={`/novel/${encodeURIComponent(name)}`}
                                    className="group flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:border-primary/50 transition-all"
                                >
                                    {/* Rank Number */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${index === 0
                                            ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
                                            : index === 1
                                                ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                                                : index === 2
                                                    ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                                                    : "bg-muted text-muted-foreground"
                                        }`}>
                                        {index + 1}
                                    </div>

                                    {/* Novel Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                            {name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                            {novel.resumo.join(" ").slice(0, 100)}...
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <BookOpen size={16} />
                                            <span>{novel.cap || 0} caps</span>
                                        </div>
                                        {novel.genero && novel.genero.length > 0 && (
                                            <span className="badge badge-outline">{novel.genero[0]}</span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Suspense>
                </section>
            ))}
        </div>
    );
}
