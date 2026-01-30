"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Bell,
    Check,
    CheckCheck,
    BookOpen,
    MessageCircle,
    Heart,
    Star,
    Award,
    Trash2,
    Filter,
    Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useUserStore } from "@/lib/store";

type NotificationType = "CHAPTER" | "COMMENT" | "FAVORITE" | "REVIEW" | "ACHIEVEMENT" | "SYSTEM";

interface NotificationData {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    link: string | null;
    metadata: Record<string, unknown> | null;
}

const NOTIFICATION_CONFIG: Record<NotificationType, { icon: LucideIcon; color: string }> = {
    CHAPTER: { icon: BookOpen, color: "text-primary bg-primary/10" },
    COMMENT: { icon: MessageCircle, color: "text-blue-500 bg-blue-500/10" },
    FAVORITE: { icon: Heart, color: "text-rose-500 bg-rose-500/10" },
    REVIEW: { icon: Star, color: "text-amber-500 bg-amber-500/10" },
    ACHIEVEMENT: { icon: Award, color: "text-emerald-500 bg-emerald-500/10" },
    SYSTEM: { icon: Bell, color: "text-muted-foreground bg-muted" },
};

// Lower-case mapping for filter compatibility
const TYPE_FILTER_MAP: Record<string, NotificationType> = {
    chapter: "CHAPTER",
    comment: "COMMENT",
    favorite: "FAVORITE",
    review: "REVIEW",
    achievement: "ACHIEVEMENT",
    system: "SYSTEM",
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [unreadCount, setUnreadCount] = useState(0);

    const { user, isAuthenticated } = useUserStore();

    const fetchNotifications = useCallback(async () => {
        if (!user?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/notifications?userId=${user.id}`);
            const data = await response.json();

            if (data.success) {
                setNotifications(data.data || []);
                setUnreadCount(data.unreadCount || 0);
            } else {
                setError(data.error || "Erro ao carregar notificações");
            }
        } catch {
            setError("Erro ao conectar com o servidor");
        } finally {
            setIsLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (isAuthenticated && user?.id) {
            fetchNotifications();
        } else {
            setIsLoading(false);
        }
    }, [isAuthenticated, user?.id, fetchNotifications]);

    const filteredNotifications = useMemo(() => {
        let result = [...notifications];

        if (filter === "unread") {
            result = result.filter((n) => !n.isRead);
        }

        if (typeFilter !== "all") {
            const mappedType = TYPE_FILTER_MAP[typeFilter];
            if (mappedType) {
                result = result.filter((n) => n.type === mappedType);
            }
        }

        return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [notifications, filter, typeFilter]);

    const markAsRead = async (id: string) => {
        if (!user?.id) return;

        try {
            await fetch(`/api/notifications?userId=${user.id}&ids=${id}`, {
                method: "PUT",
            });

            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch {
            console.error("Error marking notification as read");
        }
    };

    const markAllAsRead = async () => {
        if (!user?.id) return;

        try {
            await fetch(`/api/notifications?userId=${user.id}`, {
                method: "PUT",
            });

            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch {
            console.error("Error marking all as read");
        }
    };

    const deleteNotification = (id: string) => {
        // Local delete only - would need API endpoint
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return "Agora";
        if (minutes < 60) return `${minutes}min`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString("pt-BR");
    };

    // Not authenticated state
    if (!isAuthenticated) {
        return (
            <div className="space-y-6 py-6 max-w-3xl mx-auto">
                <div className="text-center py-16 bg-card border border-border rounded-2xl">
                    <div className="inline-flex p-4 bg-muted rounded-full mb-4">
                        <Bell className="text-muted-foreground" size={48} />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                        Faça login para ver suas notificações
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Entre na sua conta para acessar suas notificações
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 py-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="relative p-3 bg-primary/10 rounded-xl">
                        <Bell className="text-primary" size={28} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                                {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Notificações</h1>
                        <p className="text-muted-foreground">
                            {unreadCount > 0 ? `${unreadCount} não lidas` : "Todas lidas"}
                        </p>
                    </div>
                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-xl font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                        <CheckCheck size={18} />
                        Marcar todas como lidas
                    </button>
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
                        onClick={fetchNotifications}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        Tentar novamente
                    </button>
                </div>
            )}

            {!isLoading && !error && (
                <>
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-xl font-medium transition-colors ${filter === "all"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border text-foreground hover:bg-muted"
                                }`}
                        >
                            Todas
                        </button>
                        <button
                            onClick={() => setFilter("unread")}
                            className={`px-4 py-2 rounded-xl font-medium transition-colors ${filter === "unread"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border text-foreground hover:bg-muted"
                                }`}
                        >
                            Não lidas
                        </button>

                        <div className="ml-auto flex items-center gap-2">
                            <Filter size={16} className="text-muted-foreground" />
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-3 py-2 bg-card border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">Todos os tipos</option>
                                <option value="chapter">Capítulos</option>
                                <option value="comment">Comentários</option>
                                <option value="achievement">Conquistas</option>
                                <option value="system">Sistema</option>
                            </select>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="space-y-3">
                        {filteredNotifications.map((notification) => {
                            const config = NOTIFICATION_CONFIG[notification.type] || NOTIFICATION_CONFIG.SYSTEM;
                            const Icon = config.icon;

                            return (
                                <div
                                    key={notification.id}
                                    className={`group relative flex items-start gap-4 p-4 bg-card border rounded-xl transition-colors ${notification.isRead
                                            ? "border-border"
                                            : "border-primary/30 bg-primary/5"
                                        }`}
                                >
                                    {/* Icon */}
                                    <div className={`p-2.5 rounded-xl shrink-0 ${config.color}`}>
                                        <Icon size={20} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className={`font-medium ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                                                    {notification.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mt-0.5">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            <span className="text-xs text-muted-foreground shrink-0">
                                                {formatTime(notification.createdAt)}
                                            </span>
                                        </div>

                                        {notification.link && (
                                            <Link
                                                href={notification.link}
                                                onClick={() => markAsRead(notification.id)}
                                                className="inline-flex items-center text-sm text-primary font-medium mt-2 hover:underline"
                                            >
                                                Ver detalhes
                                            </Link>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsRead(notification.id)}
                                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Marcar como lida"
                                            >
                                                <Check size={16} />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Unread indicator */}
                                    {!notification.isRead && (
                                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {filteredNotifications.length === 0 && (
                        <div className="text-center py-16 bg-card border border-border rounded-2xl">
                            <div className="inline-flex p-4 bg-muted rounded-full mb-4">
                                <Bell className="text-muted-foreground" size={48} />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                Nenhuma notificação
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                {filter === "unread"
                                    ? "Você leu todas as notificações!"
                                    : "Quando algo acontecer, você será notificado aqui"}
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
