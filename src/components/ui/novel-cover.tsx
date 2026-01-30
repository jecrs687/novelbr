"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";

interface NovelCoverProps {
    src?: string;
    alt: string;
    className?: string;
    fill?: boolean;
    width?: number;
    height?: number;
    priority?: boolean;
    sizes?: string;
}

// Generate a deterministic gradient based on the novel title
function getGradientFromTitle(title: string): string {
    const gradients = [
        "from-violet-600 via-purple-500 to-fuchsia-500",
        "from-blue-600 via-cyan-500 to-teal-400",
        "from-rose-600 via-pink-500 to-orange-400",
        "from-emerald-600 via-green-500 to-lime-400",
        "from-amber-600 via-orange-500 to-red-400",
        "from-indigo-600 via-blue-500 to-cyan-400",
        "from-fuchsia-600 via-pink-500 to-rose-400",
        "from-teal-600 via-emerald-500 to-green-400",
        "from-red-600 via-rose-500 to-pink-400",
        "from-sky-600 via-blue-500 to-indigo-400",
    ];

    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
}

// Get first letters of words for placeholder
function getInitials(title: string): string {
    return title
        .split(/[\s-_]+/)
        .slice(0, 2)
        .map(word => word.charAt(0).toUpperCase())
        .join("");
}

export function NovelCover({
    src,
    alt,
    className = "",
    fill = false,
    width,
    height,
    priority = false,
    sizes,
}: NovelCoverProps) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const gradient = getGradientFromTitle(alt);
    const initials = getInitials(alt);

    // Show placeholder if no src or if image failed to load
    const showPlaceholder = !src || hasError;

    const placeholderContent = (
        <div
            className={`flex flex-col items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
            style={!fill ? { width, height } : undefined}
        >
            <BookOpen
                className="text-white/40 mb-2"
                size={fill ? 48 : Math.min((width || 100) * 0.3, 48)}
            />
            <span
                className="font-bold text-white/60"
                style={{ fontSize: fill ? "1.5rem" : `${Math.max((width || 100) * 0.15, 12)}px` }}
            >
                {initials}
            </span>
            <span className="text-white/40 text-xs mt-1 px-2 text-center line-clamp-2">
                {alt}
            </span>
        </div>
    );

    if (showPlaceholder) {
        return placeholderContent;
    }

    return (
        <div className={`relative ${fill ? "w-full h-full" : ""} ${className}`}>
            {/* Loading state */}
            {isLoading && (
                <div
                    className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${gradient} animate-pulse`}
                >
                    <BookOpen className="text-white/40" size={fill ? 48 : Math.min((width || 100) * 0.3, 48)} />
                </div>
            )}

            <Image
                src={src}
                alt={alt}
                fill={fill}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                priority={priority}
                sizes={sizes}
                className={`object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                }}
            />
        </div>
    );
}
