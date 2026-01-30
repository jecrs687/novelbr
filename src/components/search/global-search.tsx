"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Search, X, Loader2, BookOpen, Users, Tag } from "lucide-react";
import Link from "next/link";
import { cn, debounce } from "@/lib/utils";

interface SearchResult {
    id: string;
    type: "novel" | "genre" | "author";
    title: string;
    subtitle?: string;
    href: string;
}

interface GlobalSearchProps {
    className?: string;
    placeholder?: string;
}

export function GlobalSearch({
    className,
    placeholder = "Buscar novels, gêneros...",
}: GlobalSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Debounced search function
    const search = useMemo(
        () =>
            debounce(async (searchQuery: string) => {
                if (!searchQuery.trim()) {
                    setResults([]);
                    setIsLoading(false);
                    return;
                }

                setIsLoading(true);

                try {
                    const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=all`);
                    if (response.ok) {
                        const data = await response.json();
                        setResults(data.results || []);
                    }
                } catch (error) {
                    console.error("Search error:", error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            }, 300),
        []
    );

    useEffect(() => {
        if (query) {
            setIsLoading(true);
            search(query);
        } else {
            setResults([]);
        }
    }, [query, search]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsOpen(false);
            inputRef.current?.blur();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, -1));
        } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
            window.location.href = results[selectedIndex].href;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "novel":
                return <BookOpen className="w-4 h-4" />;
            case "genre":
                return <Tag className="w-4 h-4" />;
            case "author":
                return <Users className="w-4 h-4" />;
            default:
                return <Search className="w-4 h-4" />;
        }
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={cn(
                        "w-full pl-12 pr-10 py-3 bg-muted/50 border border-border rounded-xl",
                        "text-foreground placeholder:text-muted-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                        "transition-all duration-200"
                    )}
                />
                {isLoading ? (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
                ) : query ? (
                    <button
                        onClick={clearSearch}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                ) : null}
            </div>

            {/* Results Dropdown */}
            {isOpen && (query || results.length > 0) && (
                <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-xl overflow-hidden animate-fadeIn">
                    {results.length > 0 ? (
                        <ul className="max-h-96 overflow-y-auto py-2">
                            {results.map((result, index) => (
                                <li key={result.id}>
                                    <Link
                                        href={result.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 transition-colors",
                                            index === selectedIndex
                                                ? "bg-primary/10 text-primary"
                                                : "hover:bg-muted"
                                        )}
                                    >
                                        <span className="shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                            {getTypeIcon(result.type)}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-foreground truncate">
                                                {result.title}
                                            </p>
                                            {result.subtitle && (
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {result.subtitle}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded">
                                            {result.type === "novel" ? "Novel" : result.type === "genre" ? "Gênero" : "Autor"}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : query && !isLoading ? (
                        <div className="px-4 py-8 text-center text-muted-foreground">
                            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>Nenhum resultado para &ldquo;{query}&rdquo;</p>
                            <p className="text-sm mt-1">Tente buscar com outros termos</p>
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
