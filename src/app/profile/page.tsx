"use client";

import { useEffect, useState } from "react";
import {
    User,
    BookOpen,
    Clock,
    Award,
    TrendingUp,
    Heart,
    Calendar,
    Target,
    Flame,
    Star,
    BarChart3,
    Settings,
    LogOut,
    Edit3,
    Loader2
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";

interface ProfileStats {
    totalReadingTime: number;
    totalWordsRead: number;
    totalSessions: number;
    completedNovels: number;
    favoriteCount: number;
    reviewsCount: number;
    commentsCount: number;
    bookmarksCount: number;
    listsCount: number;
    achievementsCount: number;
    currentStreak: number;
    longestStreak: number;
}

interface WeeklyActivity {
    day: string;
    chapters: number;
}

interface UserProfile {
    id: string;
    email: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
}

interface ProfileData {
    user: UserProfile;
    stats: ProfileStats;
    weeklyActivity: WeeklyActivity[];
}

export default function ProfilePage() {
    const router = useRouter();
    const { user, logout } = useUserStore();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            // Check if user is logged in
            if (!user) {
                router.push("/login");
                return;
            }

            try {
                const response = await fetch(`/api/auth/me?userId=${user.id}`);
                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || "Erro ao carregar perfil");
                    return;
                }

                setProfile(data.data);
            } catch {
                setError("Erro ao conectar com o servidor");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, router]);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const formatReadingTime = (minutes: number) => {
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours < 24) return `${hours}h ${mins}m`;
        const days = Math.floor(hours / 24);
        return `${days}d ${hours % 24}h`;
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="animate-spin text-primary mx-auto mb-4" size={48} />
                    <p className="text-muted-foreground">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-destructive mb-4">{error || "Perfil não encontrado"}</p>
                    <Link href="/login" className="btn btn-primary">
                        Fazer Login
                    </Link>
                </div>
            </div>
        );
    }

    const { stats, weeklyActivity } = profile;

    const statCards = [
        {
            icon: BookOpen,
            label: "Novels Completos",
            value: stats.completedNovels,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            icon: BarChart3,
            label: "Sessões de Leitura",
            value: stats.totalSessions,
            color: "text-accent",
            bgColor: "bg-accent/10",
        },
        {
            icon: Clock,
            label: "Tempo de Leitura",
            value: formatReadingTime(stats.totalReadingTime),
            color: "text-secondary",
            bgColor: "bg-secondary/10",
        },
        {
            icon: Flame,
            label: "Sequência Atual",
            value: `${stats.currentStreak} dias`,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
        },
        {
            icon: Target,
            label: "Melhor Sequência",
            value: `${stats.longestStreak} dias`,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10",
        },
        {
            icon: Heart,
            label: "Favoritos",
            value: stats.favoriteCount,
            color: "text-rose-500",
            bgColor: "bg-rose-500/10",
        },
        {
            icon: TrendingUp,
            label: "Reviews",
            value: stats.reviewsCount,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
        },
        {
            icon: Star,
            label: "Conquistas",
            value: stats.achievementsCount,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10",
        },
    ];

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const activityData = weeklyActivity.length > 0 ? weeklyActivity : weekDays.map(day => ({ day, chapters: 0 }));
    const maxChapters = Math.max(...activityData.map(d => d.chapters), 1);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Profile Header */}
            <div className="bg-card border border-border rounded-3xl p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {profile.user.avatarUrl ? (
                        <Image
                            src={profile.user.avatarUrl}
                            alt={profile.user.displayName || profile.user.username}
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <User className="text-white" size={48} />
                        </div>
                    )}
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-foreground">
                                {profile.user.displayName || profile.user.username}
                            </h1>
                            <Link
                                href="/settings"
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                title="Editar perfil"
                            >
                                <Edit3 size={18} className="text-muted-foreground" />
                            </Link>
                        </div>
                        <p className="text-muted-foreground mb-1">@{profile.user.username}</p>
                        {profile.user.bio && (
                            <p className="text-foreground text-sm mb-3">{profile.user.bio}</p>
                        )}
                        <p className="text-sm text-muted-foreground mb-4">
                            Membro desde {new Date(profile.user.createdAt).toLocaleDateString("pt-BR", {
                                month: "long",
                                year: "numeric"
                            })}
                        </p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            {stats.completedNovels > 0 && (
                                <span className="badge badge-primary">Leitor Ávido</span>
                            )}
                            {stats.favoriteCount >= 5 && (
                                <span className="badge badge-accent">Colecionador</span>
                            )}
                            {stats.currentStreak >= 7 && (
                                <span className="badge badge-secondary">Maratonista</span>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">{stats.currentStreak}</div>
                            <div className="text-sm text-muted-foreground">Dias de sequência</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/settings"
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                                title="Configurações"
                            >
                                <Settings size={20} className="text-muted-foreground" />
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                                title="Sair"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-card border border-border rounded-2xl p-5 card-hover"
                    >
                        <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>
                            <stat.icon className={stat.color} size={20} />
                        </div>
                        <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Weekly Activity */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Calendar size={22} className="text-primary" />
                    Atividade Semanal
                </h2>
                <div className="flex items-end justify-between gap-2 h-40">
                    {activityData.map((day, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex items-end justify-center" style={{ height: "120px" }}>
                                <div
                                    className="w-full max-w-[40px] bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all hover:opacity-80"
                                    style={{
                                        height: `${day.chapters > 0 ? (day.chapters / maxChapters) * 100 : 0}%`,
                                        minHeight: day.chapters > 0 ? "8px" : "2px",
                                        opacity: day.chapters > 0 ? 1 : 0.3
                                    }}
                                />
                            </div>
                            <span className="text-xs text-muted-foreground">{day.day}</span>
                            <span className="text-xs font-medium text-foreground">{day.chapters}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/profile/achievements" className="bg-card border border-border rounded-2xl p-5 card-hover text-center">
                    <Award className="mx-auto text-amber-500 mb-3" size={28} />
                    <div className="font-medium text-foreground">Conquistas</div>
                    <div className="text-sm text-muted-foreground">{stats.achievementsCount} desbloqueadas</div>
                </Link>
                <Link href="/bookmarks" className="bg-card border border-border rounded-2xl p-5 card-hover text-center">
                    <BookOpen className="mx-auto text-primary mb-3" size={28} />
                    <div className="font-medium text-foreground">Marcadores</div>
                    <div className="text-sm text-muted-foreground">{stats.bookmarksCount} salvos</div>
                </Link>
                <Link href="/lists" className="bg-card border border-border rounded-2xl p-5 card-hover text-center">
                    <BarChart3 className="mx-auto text-accent mb-3" size={28} />
                    <div className="font-medium text-foreground">Listas</div>
                    <div className="text-sm text-muted-foreground">{stats.listsCount} criadas</div>
                </Link>
                <Link href="/favorites" className="bg-card border border-border rounded-2xl p-5 card-hover text-center">
                    <Heart className="mx-auto text-rose-500 mb-3" size={28} />
                    <div className="font-medium text-foreground">Favoritos</div>
                    <div className="text-sm text-muted-foreground">{stats.favoriteCount} novels</div>
                </Link>
            </div>

            {/* Achievements Preview */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <Award size={22} className="text-amber-500" />
                        Conquistas Recentes
                    </h2>
                    <Link href="/profile/achievements" className="text-sm text-primary hover:underline">
                        Ver todas
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { name: "Primeiro Capítulo", icon: "📖", desc: "Leia seu primeiro capítulo", unlocked: stats.totalSessions > 0 },
                        { name: "Leitor Dedicado", icon: "🔥", desc: "Sequência de 7 dias", unlocked: stats.currentStreak >= 7 },
                        { name: "Colecionador", icon: "❤️", desc: "10 novels favoritos", unlocked: stats.favoriteCount >= 10 },
                        { name: "Maratonista", icon: "🏃", desc: "Complete um novel", unlocked: stats.completedNovels > 0 },
                    ].map((achievement, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-xl border ${achievement.unlocked
                                    ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30"
                                    : "bg-muted/30 border-border opacity-50"
                                }`}
                        >
                            <div className="text-3xl mb-2">{achievement.icon}</div>
                            <div className="font-medium text-foreground text-sm">{achievement.name}</div>
                            <div className="text-xs text-muted-foreground">{achievement.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reading Goals */}
            <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    <Target size={22} className="text-emerald-500" />
                    Metas de Leitura
                </h2>
                <div className="space-y-4">
                    {[
                        { label: "Meta Diária", current: Math.min(stats.totalSessions, 5), target: 5, unit: "sessões" },
                        { label: "Meta Semanal", current: Math.min(stats.totalSessions, 20), target: 20, unit: "sessões" },
                        { label: "Meta Mensal", current: stats.completedNovels, target: 2, unit: "novels" },
                    ].map((goal, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-foreground">{goal.label}</span>
                                <span className="text-sm text-muted-foreground">
                                    {goal.current}/{goal.target} {goal.unit}
                                </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
