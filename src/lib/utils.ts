import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string | undefined | null, maxLength: number): string {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + "...";
}

/**
 * Truncate text by words
 */
export function truncateWords(text: string | undefined | null, maxWords: number): string {
    if (!text) return "";
    const words = text.split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
}

/**
 * Format a number with compact notation (1.2k, 3.4M, etc.)
 */
export function formatCompactNumber(num: number): string {
    if (num < 1000) return num.toString();
    if (num < 1000000) return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    if (num < 1000000000) return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "B";
}

/**
 * Format a date relative to now (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();

    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    if (weeks < 4) return `${weeks}sem atrás`;
    if (months < 12) return `${months}mês atrás`;
    return `${years}ano${years > 1 ? "s" : ""} atrás`;
}

/**
 * Format a date in Brazilian Portuguese
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        ...options,
    });
}

/**
 * Format duration in minutes to a readable string
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}min`;
}

/**
 * Format reading time estimate based on word count
 */
export function formatReadingTime(wordCount: number, wordsPerMinute = 200): string {
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return formatDuration(minutes);
}

/**
 * Generate a slug from a string
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
        .replace(/[^\w\s-]/g, "") // Remove non-word characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/--+/g, "-") // Replace multiple hyphens with single
        .replace(/^-+/, "") // Remove leading hyphens
        .replace(/-+$/, ""); // Remove trailing hyphens
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(text: string): string {
    return text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Get initials from a name
 */
export function getInitials(name: string | undefined | null, maxLength = 2): string {
    if (!name) return "?";
    return name
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase())
        .slice(0, maxLength)
        .join("");
}

/**
 * Check if running on client side
 */
export const isClient = typeof window !== "undefined";

/**
 * Check if running on server side
 */
export const isServer = typeof window === "undefined";

/**
 * Debounce a function
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Throttle a function
 */
export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Generate a random ID
 */
export function generateId(length = 8): string {
    return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clamp a number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) return true;
    if (typeof value === "string") return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
}
