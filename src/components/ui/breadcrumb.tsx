"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
    showHome?: boolean;
    separator?: "chevron" | "slash";
}

export function Breadcrumb({
    items,
    className,
    showHome = true,
    separator = "chevron",
}: BreadcrumbProps) {
    const allItems = showHome
        ? [{ label: "Início", href: "/" }, ...items]
        : items;

    return (
        <nav aria-label="Breadcrumb" className={cn("mb-4", className)}>
            <ol className="flex items-center flex-wrap gap-1 text-sm">
                {allItems.map((item, index) => {
                    const isLast = index === allItems.length - 1;
                    const isHome = index === 0 && showHome;

                    return (
                        <li key={index} className="flex items-center gap-1">
                            {item.href && !isLast ? (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "text-muted-foreground hover:text-foreground transition-colors",
                                        "inline-flex items-center gap-1"
                                    )}
                                >
                                    {isHome && <Home className="w-4 h-4" />}
                                    {!isHome && item.label}
                                </Link>
                            ) : (
                                <span
                                    className={cn(
                                        isLast
                                            ? "text-foreground font-medium"
                                            : "text-muted-foreground",
                                        "inline-flex items-center gap-1"
                                    )}
                                >
                                    {isHome && <Home className="w-4 h-4" />}
                                    {!isHome && item.label}
                                </span>
                            )}

                            {!isLast && (
                                <span className="text-muted-foreground mx-1">
                                    {separator === "chevron" ? (
                                        <ChevronRight className="w-4 h-4" />
                                    ) : (
                                        "/"
                                    )}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

// Helper function to generate breadcrumbs from pathname
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
    const segments = pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");

        // Convert segment to readable label
        const label = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

        return {
            label,
            href: index < segments.length - 1 ? href : undefined,
        };
    });
}
