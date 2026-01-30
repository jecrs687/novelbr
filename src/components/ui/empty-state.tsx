import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { FileX, Search, Inbox, AlertCircle, Wifi, Lock } from "lucide-react";

type EmptyStateType = "no-data" | "no-results" | "error" | "offline" | "restricted" | "custom";

const typeConfig: Record<Exclude<EmptyStateType, "custom">, { icon: typeof FileX; defaultTitle: string }> = {
    "no-data": {
        icon: Inbox,
        defaultTitle: "Nenhum dado encontrado",
    },
    "no-results": {
        icon: Search,
        defaultTitle: "Nenhum resultado encontrado",
    },
    error: {
        icon: AlertCircle,
        defaultTitle: "Ocorreu um erro",
    },
    offline: {
        icon: Wifi,
        defaultTitle: "Você está offline",
    },
    restricted: {
        icon: Lock,
        defaultTitle: "Acesso restrito",
    },
};

interface EmptyStateProps {
    type?: EmptyStateType;
    icon?: ReactNode;
    title?: string;
    description?: string;
    action?: ReactNode;
    className?: string;
    compact?: boolean;
}

export function EmptyState({
    type = "no-data",
    icon,
    title,
    description,
    action,
    className,
    compact,
}: EmptyStateProps) {
    const config = type !== "custom" ? typeConfig[type] : null;
    const IconComponent = config?.icon ?? FileX;

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center text-center",
                compact ? "py-8 px-4" : "py-16 px-6",
                className
            )}
        >
            <div
                className={cn(
                    "rounded-full bg-muted flex items-center justify-center mb-4",
                    compact ? "w-12 h-12" : "w-16 h-16"
                )}
            >
                {icon ?? (
                    <IconComponent
                        className={cn(
                            "text-muted-foreground",
                            compact ? "w-6 h-6" : "w-8 h-8"
                        )}
                    />
                )}
            </div>

            <h3
                className={cn(
                    "font-semibold text-foreground mb-2",
                    compact ? "text-base" : "text-lg"
                )}
            >
                {title ?? config?.defaultTitle ?? "Nenhum dado"}
            </h3>

            {description && (
                <p
                    className={cn(
                        "text-muted-foreground max-w-sm mb-6",
                        compact ? "text-sm" : "text-base"
                    )}
                >
                    {description}
                </p>
            )}

            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}

// ==================== NO FAVORITES ====================
export function NoFavorites({
    action,
    className,
}: {
    action?: ReactNode;
    className?: string;
}) {
    return (
        <EmptyState
            type="no-data"
            title="Nenhum favorito ainda"
            description="Adicione novels aos seus favoritos para acessá-los rapidamente aqui."
            action={action}
            className={className}
        />
    );
}

// ==================== NO BOOKMARKS ====================
export function NoBookmarks({
    action,
    className,
}: {
    action?: ReactNode;
    className?: string;
}) {
    return (
        <EmptyState
            type="no-data"
            title="Nenhum marcador salvo"
            description="Marque páginas para continuar sua leitura de onde parou."
            action={action}
            className={className}
        />
    );
}

// ==================== NO SEARCH RESULTS ====================
export function NoSearchResults({
    query,
    action,
    className,
}: {
    query?: string;
    action?: ReactNode;
    className?: string;
}) {
    return (
        <EmptyState
            type="no-results"
            title="Nenhum resultado encontrado"
            description={
                query
                    ? `Não encontramos resultados para "${query}". Tente buscar com outros termos.`
                    : "Tente buscar com outros termos ou filtros."
            }
            action={action}
            className={className}
        />
    );
}

// ==================== NO NOTIFICATIONS ====================
export function NoNotifications({ className }: { className?: string }) {
    return (
        <EmptyState
            type="no-data"
            title="Nenhuma notificação"
            description="Você está em dia! Novas notificações aparecerão aqui."
            className={className}
        />
    );
}

// ==================== ERROR STATE ====================
export function ErrorState({
    title,
    description,
    action,
    className,
}: {
    title?: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}) {
    return (
        <EmptyState
            type="error"
            title={title ?? "Algo deu errado"}
            description={description ?? "Ocorreu um erro ao carregar os dados. Tente novamente."}
            action={action}
            className={className}
        />
    );
}

// ==================== OFFLINE STATE ====================
export function OfflineState({ className }: { className?: string }) {
    return (
        <EmptyState
            type="offline"
            title="Você está offline"
            description="Verifique sua conexão com a internet e tente novamente."
            className={className}
        />
    );
}
