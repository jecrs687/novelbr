"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
    Trophy,
    Award,
    Star,
    Flame,
    BookOpen,
    Clock,
    Heart,
    MessageCircle,
    Zap,
    Target,
    Crown,
    Medal,
    Sparkles,
    CheckCircle,
    Lock,
    Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useUserStore } from "@/lib/store";

type AchievementCategory = "reading" | "social" | "collection" | "streak" | "all";

interface AchievementData {
    id: string;
    slug: string;
    name: string;
    description: string;
    icon: string | null;
    points: number;
    requirement: string;
    threshold: number;
    progress: number;
    unlockedAt: string | null;
}

interface StatsData {
    total: number;
    unlocked: number;
    points: number;
}

// Map requirement types to categories
const REQUIREMENT_CATEGORY_MAP: Record<string, AchievementCategory> = {
    CHAPTERS_READ: "reading",
    NOVELS_COMPLETED: "reading",
    READING_TIME: "reading",
    FAVORITES_COUNT: "collection",
    REVIEWS_WRITTEN: "social",
    COMMENTS_POSTED: "social",
    DAYS_STREAK: "streak",
};

// Map icon names to components
const ICON_MAP: Record<string, LucideIcon> = {
    BookOpen: BookOpen,
    Zap: Zap,
    Crown: Crown,
    Star: Star,
    Clock: Clock,
    Flame: Flame,
    Heart: Heart,
    MessageCircle: MessageCircle,
    Award: Award,
    Trophy: Trophy,
    Medal: Medal,
    Target: Target,
};

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
    all: "Todas",
    reading: "Leitura",
    social: "Social",
    collection: "Coleção",
    streak: "Sequência",
};

// Calculate rarity based on points
const getRarity = (points: number): "common" | "uncommon" | "rare" | "epic" | "legendary" => {
    if (points >= 250) return "legendary";
    if (points >= 100) return "epic";
    if (points >= 50) return "rare";
    if (points >= 25) return "uncommon";
    return "common";
};

const RARITY_COLORS: Record<string, string> = {
    common: "bg-gray-500",
    uncommon: "bg-green-500",
    rare: "bg-blue-500",
    epic: "bg-purple-500",
    legendary: "bg-amber-500",
};

const RARITY_LABELS: Record<string, string> = {
    common: "Comum",
    uncommon: "Incomum",
    rare: "Raro",
    epic: "Épico",
    legendary: "Lendário",
};

const GRADIENT_COLORS: Record<string, string> = {
    reading: "from-blue-500 to-cyan-500",
    social: "from-purple-500 to-indigo-500",
    collection: "from-pink-500 to-rose-500",
    streak: "from-orange-500 to-amber-500",
    all: "from-primary to-accent",
};

export default function AchievementsPage() {
    const [filter, setFilter] = useState<AchievementCategory>("all");
    const [showLocked, setShowLocked] = useState(true);
    const [achievements, setAchievements] = useState<AchievementData[]>([]);
    const [stats, setStats] = useState<StatsData>({ total: 0, unlocked: 0, points: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user, isAuthenticated } = useUserStore();

    const fetchAchievements = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const url = user?.id
                ? `/api/achievements?userId=${user.id}`
                : "/api/achievements";

            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setAchievements(data.data.achievements || []);
                setStats(data.data.stats || { total: 0, unlocked: 0, points: 0 });
            } else {
                setError(data.error || "Erro ao carregar conquistas");
            }
        } catch {
            setError("Erro ao conectar com o servidor");
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchAchievements();
    }, [fetchAchievements]);

    const filteredAchievements = useMemo(() => {
        let result = [...achievements];

        if (filter !== "all") {
            result = result.filter((a) => {
                const category = REQUIREMENT_CATEGORY_MAP[a.requirement] || "reading";
                return category === filter;
            });
        }

        if (!showLocked) {
            result = result.filter((a) => a.unlockedAt);
        }

        // Sort: unlocked first, then by progress percentage
        result.sort((a, b) => {
            if (a.unlockedAt && !b.unlockedAt) return -1;
            if (!a.unlockedAt && b.unlockedAt) return 1;
            return (b.progress / b.threshold) - (a.progress / a.threshold);
        });

        return result;
    }, [achievements, filter, showLocked]);

    const computedStats = useMemo(() => {
        const percentage = stats.total > 0
            ? Math.round((stats.unlocked / stats.total) * 100)
            : 0;
        const legendaryCount = achievements.filter(
            (a) => a.unlockedAt && getRarity(a.points) === "legendary"
        ).length;

        return { ...stats, percentage, legendaryCount };
    }, [stats, achievements]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" });
    };

    const getIcon = (iconName: string | null): LucideIcon => {
        if (iconName && ICON_MAP[iconName]) {
            return ICON_MAP[iconName];
        }
        return Award;
    };

    return (
        <div className="space-y-8 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-xl shadow-lg">
                        <Trophy className="text-white" size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Conquistas</h1>
                        <p className="text-muted-foreground">
                            {computedStats.unlocked}/{computedStats.total} desbloqueadas · {computedStats.points} pontos
                        </p>
                    </div>
                </div>

                {!isAuthenticated && (
                    <div className="text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg">
                        Faça login para acompanhar seu progresso
                    </div>
                )}
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
                        onClick={fetchAchievements}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {!isLoading && !error && (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Trophy className="text-primary" size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">{computedStats.unlocked}</div>
                                    <div className="text-sm text-muted-foreground">Desbloqueadas</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-secondary/10 rounded-lg">
                                    <Target className="text-secondary" size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">{computedStats.percentage}%</div>
                                    <div className="text-sm text-muted-foreground">Completo</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent/10 rounded-lg">
                                    <Sparkles className="text-accent" size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">{computedStats.points}</div>
                                    <div className="text-sm text-muted-foreground">Pontos</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <Crown className="text-amber-500" size={20} />
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-foreground">
                                        {computedStats.legendaryCount}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Lendárias</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex flex-wrap gap-2">
                            {(Object.keys(CATEGORY_LABELS) as AchievementCategory[]).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setFilter(category)}
                                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${filter === category
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-card border border-border text-foreground hover:bg-muted"
                                        }`}
                                >
                                    {CATEGORY_LABELS[category]}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                            <button
                                onClick={() => setShowLocked(!showLocked)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${showLocked
                                        ? "bg-card border border-border text-foreground"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                            >
                                <Lock size={16} />
                                {showLocked ? "Mostrar Bloqueadas" : "Ocultar Bloqueadas"}
                            </button>
                        </div>
                    </div>

                    {/* Achievements Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredAchievements.map((achievement) => {
                            const Icon = getIcon(achievement.icon);
                            const progressPercent = Math.min((achievement.progress / achievement.threshold) * 100, 100);
                            const isUnlocked = !!achievement.unlockedAt;
                            const rarity = getRarity(achievement.points);
                            const category = REQUIREMENT_CATEGORY_MAP[achievement.requirement] || "reading";
                            const gradientColor = GRADIENT_COLORS[category];

                            return (
                                <div
                                    key={achievement.id}
                                    className={`relative bg-card border rounded-2xl p-5 transition-all ${isUnlocked
                                            ? "border-border hover:border-primary/50"
                                            : "border-border/50 opacity-70"
                                        }`}
                                >
                                    {/* Rarity Badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium text-white ${RARITY_COLORS[rarity]}`}>
                                            {RARITY_LABELS[rarity]}
                                        </span>
                                    </div>

                                    {/* Icon */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientColor} shadow-lg ${!isUnlocked && "grayscale"}`}>
                                            <Icon className="text-white" size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                                {achievement.name}
                                                {isUnlocked && (
                                                    <CheckCircle className="text-success" size={16} />
                                                )}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {achievement.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    {!isUnlocked && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Progresso</span>
                                                <span className="font-medium text-foreground">
                                                    {achievement.progress}/{achievement.threshold}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${gradientColor} rounded-full transition-all`}
                                                    style={{ width: `${progressPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Points indicator */}
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Star size={12} />
                                            {achievement.points} pontos
                                        </span>

                                        {/* Unlocked date */}
                                        {isUnlocked && achievement.unlockedAt && (
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(achievement.unlockedAt)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredAchievements.length === 0 && (
                        <div className="text-center py-16 bg-card border border-border rounded-2xl">
                            <div className="inline-flex p-4 bg-muted rounded-full mb-4">
                                <Trophy className="text-muted-foreground" size={48} />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                Nenhuma conquista encontrada
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                {achievements.length === 0
                                    ? "As conquistas serão adicionadas em breve!"
                                    : "Tente ajustar os filtros para ver mais conquistas"}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
