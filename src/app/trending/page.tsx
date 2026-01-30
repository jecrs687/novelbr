import { Suspense } from "react";
import Link from "next/link";
import { fetchNovelsList } from "@/lib/data";
import { NovelGridSkeleton } from "@/components/ui/loading";
import { NovelCover } from "@/components/ui/novel-cover";
import {
    Flame,
    TrendingUp,
    Eye,
    Clock,
    ArrowRight
} from "lucide-react";

export const revalidate = 3600; // Revalidate every hour

export default async function TrendingPage() {
    const novels = await fetchNovelsList();
    const novelEntries = Object.entries(novels);

    // Sort by chapter count (simulating trending by activity)
    const trendingNovels = novelEntries
        .sort((a, b) => (b[1].cap || 0) - (a[1].cap || 0))
        .slice(0, 20);

    // Get top 3 for featured section
    const topThree = trendingNovels.slice(0, 3);
    const restNovels = trendingNovels.slice(3);

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-orange-500/10 rounded-2xl mb-4">
                    <Flame className="text-orange-500" size={32} />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                    Em Alta
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Os novels mais lidos e comentados da semana
                </p>
            </div>

            {/* Top 3 Featured */}
            <section className="grid lg:grid-cols-3 gap-6">
                {topThree.map(([name, novel], index) => (
                    <Link
                        key={name}
                        href={`/novel/${encodeURIComponent(name)}`}
                        className={`group relative overflow-hidden rounded-3xl border border-border bg-card card-hover ${index === 0 ? "lg:col-span-1 lg:row-span-1" : ""
                            }`}
                    >
                        <div className="aspect-[3/4] relative">
                            <NovelCover
                                src={novel.imagem}
                                alt={name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Rank Badge */}
                            <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl ${index === 0
                                    ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30"
                                    : index === 1
                                        ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                                        : "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                                }`}>
                                #{index + 1}
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="flex items-center gap-2 text-orange-400 text-sm mb-2">
                                    <TrendingUp size={16} />
                                    <span>Em alta</span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                    {name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                    <span className="flex items-center gap-1">
                                        <Eye size={14} />
                                        {((novel.cap || 1) * 150).toLocaleString()} views
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {novel.cap || 0} caps
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>

            {/* Rest of Trending */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Mais Populares</h2>
                </div>

                <Suspense fallback={<NovelGridSkeleton count={10} />}>
                    <div className="space-y-3">
                        {restNovels.map(([name, novel], index) => (
                            <Link
                                key={name}
                                href={`/novel/${encodeURIComponent(name)}`}
                                className="group flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:border-primary/50 transition-all"
                            >
                                {/* Rank Number */}
                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center font-bold text-lg text-muted-foreground">
                                    {index + 4}
                                </div>

                                {/* Cover */}
                                <div className="relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                    <NovelCover
                                        src={novel.imagem}
                                        alt={name}
                                        fill
                                        sizes="64px"
                                    />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                                        {name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {novel.cap || 0} capítulos
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Eye size={14} />
                                        {((novel.cap || 1) * 100).toLocaleString()}
                                    </span>
                                    <span className="flex items-center gap-1 text-orange-500">
                                        <TrendingUp size={14} />
                                        +{((index + 4) * 3 + 10)}%
                                    </span>
                                </div>

                                <ArrowRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </Link>
                        ))}
                    </div>
                </Suspense>
            </section>
        </div>
    );
}
