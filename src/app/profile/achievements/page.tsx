"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Trophy,
    Lock,
    Star,
    BookOpen,
    Heart,
    Clock,
    Target,
    Flame,
    Award,
    Medal,
    Zap,
    CheckCircle,
    Loader2,
} from "lucide-react";
import { useUserStore } from "@/lib/store";

interface Achievement {
    id: string;
    slug: string;
    name: string;
    description: string;
    icon: string;
    points: number;
    requirement: string;
    threshold: number;
    progress: number;
    unlockedAt: string | null;
}

interface AchievementStats {
    total: number;
    unlocked: number;
    points: number;
}

interface AchievementsResponse {
    success: boolean;
    data: {
        achievements: Achievement[];
        stats: AchievementStats;
    };
}

// Map icon strings to components
const iconMap: Record<string, React.ElementType> = {
    book: BookOpen,
    heart: Heart,
    clock: Clock,
    target: Target,
    flame: Flame,
    trophy: Trophy,
    award: Award,
    medal: Medal,
    star: Star,
    zap: Zap,
};

function getIcon(iconName: string): React.ElementType {
    return iconMap[iconName?.toLowerCase()] || Trophy;
}

// Group achievements by category
function categorizeAchievements(achievements: Achievement[]) {
    const categories: Record<string, Achievement[]> = {
        reading: [],
        collection: [],
        social: [],
        streak: [],
        special: [],
    };

    achievements.forEach((achievement) => {
        switch (achievement.requirement) {
            case "CHAPTERS_READ":
            case "READING_TIME":
                categories.reading.push(achievement);
                break;
            case "NOVELS_COMPLETED":
            case "FAVORITES_COUNT":
                categories.collection.push(achievement);
                break;
            case "COMMENTS_POSTED":
            case "REVIEWS_WRITTEN":
                categories.social.push(achievement);
                break;
            case "DAYS_STREAK":
                categories.streak.push(achievement);
                break;
            default:
                categories.special.push(achievement);
        }
    });

    return categories;
}

const categoryLabels: Record<string, { name: string; icon: React.ElementType }> = {
    reading: { name: "Leitura", icon: BookOpen },
    collection: { name: "Coleção", icon: Heart },
    social: { name: "Social", icon: Star },
    streak: { name: "Sequência", icon: Flame },
    special: { name: "Especiais", icon: Award },
};

export default function AchievementsPage() {
    const router = useRouter();
    const { user } = useUserStore();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [stats, setStats] = useState<AchievementStats>({ total: 0, unlocked: 0, points: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all");

    useEffect(() => {
        async function fetchAchievements() {
            setLoading(true);
            setError(null);

            try {
                const url = user?.id
                    ? `/api/achievements?userId=${user.id}`
                    : "/api/achievements";

                const response = await fetch(url);
                const data: AchievementsResponse = await response.json();

                if (data.success) {
                    setAchievements(data.data.achievements);
                    setStats(data.data.stats);
                } else {
                    setError("Falha ao carregar conquistas");
                }
            } catch {
                setError("Erro de conexão");
            } finally {
                setLoading(false);
            }
        }

        fetchAchievements();
    }, [user?.id]);

    const filteredAchievements = achievements.filter((a) => {
        if (filter === "unlocked") return a.unlockedAt !== null;
        if (filter === "locked") return a.unlockedAt === null;
        return true;
    });

    const categories = categorizeAchievements(filteredAchievements);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Carregando conquistas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-accent transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Conquistas</h1>
                        <p className="text-muted-foreground">
                            Desbloqueie conquistas enquanto lê
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-card border border-border rounded-2xl p-5 text-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-3">
                            <Trophy className="text-white" size={24} />
                        </div>
                        <div className="text-3xl font-bold">{stats.unlocked}</div>
                        <div className="text-sm text-muted-foreground">
                            de {stats.total} desbloqueadas
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-5 text-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3">
                            <Star className="text-white" size={24} />
                        </div>
                        <div className="text-3xl font-bold">{stats.points}</div>
                        <div className="text-sm text-muted-foreground">pontos totais</div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-5 text-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-3">
                            <Target className="text-white" size={24} />
                        </div>
                        <div className="text-3xl font-bold">
                            {stats.total > 0
                                ? Math.round((stats.unlocked / stats.total) * 100)
                                : 0}
                            %
                        </div>
                        <div className="text-sm text-muted-foreground">progresso geral</div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[
                        { key: "all", label: "Todas" },
                        { key: "unlocked", label: "Desbloqueadas" },
                        { key: "locked", label: "Bloqueadas" },
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key as typeof filter)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${filter === key
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border hover:bg-accent"
                                }`}
                        >
                            {label}
                            <span className="ml-2 opacity-70">
                                {key === "all"
                                    ? achievements.length
                                    : key === "unlocked"
                                        ? achievements.filter((a) => a.unlockedAt).length
                                        : achievements.filter((a) => !a.unlockedAt).length}
                            </span>
                        </button>
                    ))}
                </div>

                {/* No achievements message */}
                {achievements.length === 0 && (
                    <div className="text-center py-16">
                        <Trophy className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">
                            Nenhuma conquista disponível
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            As conquistas estarão disponíveis em breve!
                        </p>
                        <Link
                            href="/profile"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                        >
                            Voltar ao perfil
                        </Link>
                    </div>
                )}

                {/* Achievement Categories */}
                {Object.entries(categories).map(([categoryKey, categoryAchievements]) => {
                    if (categoryAchievements.length === 0) return null;

                    const category = categoryLabels[categoryKey];
                    const CategoryIcon = category.icon;

                    return (
                        <section key={categoryKey} className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <CategoryIcon size={18} className="text-primary" />
                                </div>
                                <h2 className="text-lg font-semibold">{category.name}</h2>
                                <span className="text-sm text-muted-foreground">
                                    ({categoryAchievements.filter((a) => a.unlockedAt).length}/
                                    {categoryAchievements.length})
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categoryAchievements.map((achievement) => {
                                    const isUnlocked = achievement.unlockedAt !== null;
                                    const progressPercent = Math.min(
                                        (achievement.progress / achievement.threshold) * 100,
                                        100
                                    );
                                    const IconComponent = getIcon(achievement.icon);

                                    return (
                                        <div
                                            key={achievement.id}
                                            className={`bg-card border rounded-2xl p-5 transition-all ${isUnlocked
                                                    ? "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent"
                                                    : "border-border opacity-70"
                                                }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Icon */}
                                                <div
                                                    className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${isUnlocked
                                                            ? "bg-gradient-to-br from-yellow-500 to-orange-500"
                                                            : "bg-muted"
                                                        }`}
                                                >
                                                    {isUnlocked ? (
                                                        <IconComponent
                                                            size={28}
                                                            className="text-white"
                                                        />
                                                    ) : (
                                                        <Lock size={24} className="text-muted-foreground" />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold truncate">
                                                            {achievement.name}
                                                        </h3>
                                                        {isUnlocked && (
                                                            <CheckCircle
                                                                size={16}
                                                                className="text-green-500 flex-shrink-0"
                                                            />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                        {achievement.description}
                                                    </p>

                                                    {/* Progress Bar */}
                                                    {!isUnlocked && (
                                                        <div className="space-y-1">
                                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                                                    style={{ width: `${progressPercent}%` }}
                                                                />
                                                            </div>
                                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                                <span>
                                                                    {achievement.progress}/{achievement.threshold}
                                                                </span>
                                                                <span>{Math.round(progressPercent)}%</span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Unlocked Badge */}
                                                    {isUnlocked && achievement.unlockedAt && (
                                                        <div className="text-xs text-green-600 flex items-center gap-1">
                                                            <CheckCircle size={12} />
                                                            Desbloqueada em{" "}
                                                            {new Date(achievement.unlockedAt).toLocaleDateString(
                                                                "pt-BR"
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Points Badge */}
                                                <div
                                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex-shrink-0 ${isUnlocked
                                                            ? "bg-yellow-500/20 text-yellow-600"
                                                            : "bg-muted text-muted-foreground"
                                                        }`}
                                                >
                                                    +{achievement.points}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    );
                })}

                {/* Empty state for filtered results */}
                {filteredAchievements.length === 0 && achievements.length > 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                            {filter === "unlocked" ? (
                                <Trophy size={32} className="text-muted-foreground" />
                            ) : (
                                <Lock size={32} className="text-muted-foreground" />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                            {filter === "unlocked"
                                ? "Nenhuma conquista desbloqueada ainda"
                                : "Você desbloqueou todas as conquistas!"}
                        </h3>
                        <p className="text-muted-foreground">
                            {filter === "unlocked"
                                ? "Continue lendo para desbloquear conquistas"
                                : "Parabéns! Você é um verdadeiro leitor!"}
                        </p>
                    </div>
                )}

                {/* Back to Profile Link */}
                <div className="mt-8 text-center">
                    <Link
                        href="/profile"
                        className="text-primary hover:underline inline-flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Voltar ao perfil
                    </Link>
                </div>
            </div>
        </div>
    );
}
