import { Suspense } from "react";
import Link from "next/link";
import { fetchNovelsList } from "@/lib/data";
import { NovelGridSkeleton } from "@/components/ui/loading";
import { NovelCard } from "@/components/novel/novel-card";
import {
    Clock,
    Calendar,
    BookOpen,
    ArrowRight,
    Sparkles
} from "lucide-react";

export const revalidate = 1800; // Revalidate every 30 minutes

export default async function RecentPage() {
    const novels = await fetchNovelsList();
    const novelEntries = Object.entries(novels);

    // Sort by chapter count descending (simulating recent updates)
    const recentUpdates = novelEntries
        .sort((a, b) => (b[1].cap || 0) - (a[1].cap || 0))
        .slice(0, 30);

    // Group by "time" (simulated)
    const todayNovels = recentUpdates.slice(0, 8);
    const yesterdayNovels = recentUpdates.slice(8, 16);
    const thisWeekNovels = recentUpdates.slice(16, 30);

    const timeGroups = [
        { label: "Hoje", icon: Sparkles, novels: todayNovels, color: "text-emerald-500", bgColor: "bg-emerald-500/10" },
        { label: "Ontem", icon: Clock, novels: yesterdayNovels, color: "text-blue-500", bgColor: "bg-blue-500/10" },
        { label: "Esta Semana", icon: Calendar, novels: thisWeekNovels, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4">
                    <Clock className="text-blue-500" size={32} />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                    Atualizações Recentes
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                    Os novels com novos capítulos mais recentes
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-2xl p-5 text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">{todayNovels.length}</div>
                    <div className="text-sm text-muted-foreground">Atualizados hoje</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">{yesterdayNovels.length}</div>
                    <div className="text-sm text-muted-foreground">Atualizados ontem</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5 text-center">
                    <div className="text-3xl font-bold text-foreground mb-1">{thisWeekNovels.length}</div>
                    <div className="text-sm text-muted-foreground">Esta semana</div>
                </div>
            </div>

            {/* Time-grouped sections */}
            {timeGroups.map((group) => (
                <section key={group.label}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-2.5 rounded-xl ${group.bgColor}`}>
                            <group.icon className={group.color} size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{group.label}</h2>
                            <p className="text-sm text-muted-foreground">{group.novels.length} novels atualizados</p>
                        </div>
                    </div>

                    <Suspense fallback={<NovelGridSkeleton count={8} />}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {group.novels.map(([name, novel]) => (
                                <NovelCard key={name} name={name} novel={novel} />
                            ))}
                        </div>
                    </Suspense>
                </section>
            ))}

            {/* View All */}
            <div className="text-center">
                <Link
                    href="/novels"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                    <BookOpen size={20} />
                    Ver Todos os Novels
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}
