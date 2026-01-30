"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ReadingProgressIndicatorProps {
    className?: string;
    showPercentage?: boolean;
    position?: "top" | "bottom";
    height?: string;
}

export function ReadingProgressIndicator({
    className,
    showPercentage = false,
    position = "top",
    height = "h-1",
}: ReadingProgressIndicatorProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const calculateProgress = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const percentage = documentHeight > 0 ? (scrolled / documentHeight) * 100 : 0;
            setProgress(Math.min(Math.max(percentage, 0), 100));
        };

        calculateProgress();
        window.addEventListener("scroll", calculateProgress, { passive: true });
        window.addEventListener("resize", calculateProgress, { passive: true });

        return () => {
            window.removeEventListener("scroll", calculateProgress);
            window.removeEventListener("resize", calculateProgress);
        };
    }, []);

    return (
        <div
            className={cn(
                "fixed left-0 right-0 z-50 bg-muted/50",
                position === "top" ? "top-0" : "bottom-0",
                height,
                className
            )}
        >
            <div
                className={cn(
                    "h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 transition-all duration-150",
                    height
                )}
                style={{ width: `${progress}%` }}
            />
            {showPercentage && (
                <span
                    className={cn(
                        "absolute right-4 text-xs font-medium text-foreground bg-background/80 px-2 py-0.5 rounded",
                        position === "top" ? "top-2" : "bottom-2"
                    )}
                >
                    {Math.round(progress)}%
                </span>
            )}
        </div>
    );
}
