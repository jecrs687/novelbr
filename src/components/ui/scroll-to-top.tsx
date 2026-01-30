"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollToTopProps {
    threshold?: number;
    className?: string;
    smooth?: boolean;
}

export function ScrollToTop({
    threshold = 400,
    className,
    smooth = true,
}: ScrollToTopProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > threshold);
        };

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, [threshold]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: smooth ? "smooth" : "auto",
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className={cn(
                "fixed bottom-6 right-6 z-50",
                "w-12 h-12 rounded-full",
                "bg-primary text-primary-foreground",
                "shadow-lg shadow-primary/25",
                "flex items-center justify-center",
                "hover:bg-primary-hover transition-all duration-300",
                "hover:scale-110 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "animate-fadeIn",
                className
            )}
            aria-label="Voltar ao topo"
        >
            <ArrowUp className="w-5 h-5" />
        </button>
    );
}
