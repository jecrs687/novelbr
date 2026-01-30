"use client";

import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { User } from "lucide-react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

const sizeStyles: Record<AvatarSize, { container: string; text: string; icon: string }> = {
    xs: { container: "w-6 h-6", text: "text-[10px]", icon: "w-3 h-3" },
    sm: { container: "w-8 h-8", text: "text-xs", icon: "w-4 h-4" },
    md: { container: "w-10 h-10", text: "text-sm", icon: "w-5 h-5" },
    lg: { container: "w-14 h-14", text: "text-base", icon: "w-6 h-6" },
    xl: { container: "w-20 h-20", text: "text-xl", icon: "w-8 h-8" },
    "2xl": { container: "w-28 h-28", text: "text-2xl", icon: "w-10 h-10" },
};

interface AvatarProps {
    src?: string | null;
    alt?: string;
    name?: string;
    size?: AvatarSize;
    className?: string;
    fallback?: ReactNode;
    status?: "online" | "offline" | "away" | "busy";
    bordered?: boolean;
    ring?: boolean;
}

const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-gray-400",
    away: "bg-amber-500",
    busy: "bg-destructive",
};

export function Avatar({
    src,
    alt = "Avatar",
    name,
    size = "md",
    className,
    fallback,
    status,
    bordered,
    ring,
}: AvatarProps) {
    const [error, setError] = useState(false);
    const styles = sizeStyles[size];
    const initials = name ? getInitials(name) : null;

    const showFallback = !src || error;

    return (
        <div className="relative inline-block">
            <div
                className={cn(
                    "relative rounded-full overflow-hidden flex items-center justify-center",
                    "bg-muted text-muted-foreground",
                    styles.container,
                    bordered && "border-2 border-border",
                    ring && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                    className
                )}
            >
                {showFallback ? (
                    fallback ? (
                        fallback
                    ) : initials ? (
                        <span className={cn("font-semibold", styles.text)}>{initials}</span>
                    ) : (
                        <User className={cn("text-muted-foreground", styles.icon)} />
                    )
                ) : (
                    <Image
                        src={src!}
                        alt={alt}
                        fill
                        className="object-cover"
                        onError={() => setError(true)}
                    />
                )}
            </div>

            {status && (
                <span
                    className={cn(
                        "absolute bottom-0 right-0 rounded-full border-2 border-background",
                        statusColors[status],
                        size === "xs" && "w-2 h-2",
                        size === "sm" && "w-2.5 h-2.5",
                        size === "md" && "w-3 h-3",
                        size === "lg" && "w-4 h-4",
                        size === "xl" && "w-5 h-5",
                        size === "2xl" && "w-6 h-6"
                    )}
                />
            )}
        </div>
    );
}

// ==================== AVATAR GROUP ====================
interface AvatarGroupProps {
    avatars: Array<{ src?: string | null; name?: string; alt?: string }>;
    size?: AvatarSize;
    max?: number;
    className?: string;
}

export function AvatarGroup({
    avatars,
    size = "md",
    max = 4,
    className,
}: AvatarGroupProps) {
    const visibleAvatars = avatars.slice(0, max);
    const remainingCount = avatars.length - max;
    const styles = sizeStyles[size];

    return (
        <div className={cn("flex -space-x-2", className)}>
            {visibleAvatars.map((avatar, index) => (
                <Avatar
                    key={index}
                    src={avatar.src}
                    name={avatar.name}
                    alt={avatar.alt}
                    size={size}
                    bordered
                    className="hover:z-10 transition-transform hover:scale-110"
                />
            ))}
            {remainingCount > 0 && (
                <div
                    className={cn(
                        "relative rounded-full flex items-center justify-center",
                        "bg-muted text-muted-foreground border-2 border-background",
                        "font-medium",
                        styles.container,
                        styles.text
                    )}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}

// ==================== AVATAR WITH INFO ====================
interface AvatarWithInfoProps {
    src?: string | null;
    name: string;
    description?: string;
    size?: AvatarSize;
    status?: "online" | "offline" | "away" | "busy";
    className?: string;
    action?: ReactNode;
}

export function AvatarWithInfo({
    src,
    name,
    description,
    size = "md",
    status,
    className,
    action,
}: AvatarWithInfoProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Avatar src={src} name={name} size={size} status={status} />
            <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{name}</p>
                {description && (
                    <p className="text-sm text-muted-foreground truncate">{description}</p>
                )}
            </div>
            {action}
        </div>
    );
}
