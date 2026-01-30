import { useEffect, useCallback } from "react";

type KeyHandler = (event: KeyboardEvent) => void;

interface ShortcutOptions {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
}

interface Shortcut {
    key: string;
    handler: KeyHandler;
    options?: ShortcutOptions;
    description?: string;
}

/**
 * Hook for handling keyboard shortcuts
 * @example
 * useKeyboardShortcuts([
 *   { key: "/", handler: () => focusSearch(), description: "Focus search" },
 *   { key: "h", handler: () => goHome(), options: { ctrl: true }, description: "Go home" },
 * ]);
 */
export function useKeyboardShortcuts(shortcuts: Shortcut[], enabled = true) {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs
            const target = event.target as HTMLElement;
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable
            ) {
                return;
            }

            for (const shortcut of shortcuts) {
                const { key, handler, options = {} } = shortcut;

                const matchesKey = event.key.toLowerCase() === key.toLowerCase();
                const matchesCtrl = options.ctrl ? event.ctrlKey : !event.ctrlKey;
                const matchesAlt = options.alt ? event.altKey : !event.altKey;
                const matchesShift = options.shift ? event.shiftKey : !event.shiftKey;
                const matchesMeta = options.meta ? event.metaKey : !event.metaKey;

                if (matchesKey && matchesCtrl && matchesAlt && matchesShift && matchesMeta) {
                    event.preventDefault();
                    handler(event);
                    break;
                }
            }
        },
        [shortcuts]
    );

    useEffect(() => {
        if (!enabled) return;

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown, enabled]);
}

/**
 * Hook for global reader keyboard shortcuts
 */
export function useReaderShortcuts({
    onNextChapter,
    onPrevChapter,
    onToggleMenu,
    onToggleNightMode,
    onIncreaseFontSize,
    onDecreaseFontSize,
    enabled = true,
}: {
    onNextChapter?: () => void;
    onPrevChapter?: () => void;
    onToggleMenu?: () => void;
    onToggleNightMode?: () => void;
    onIncreaseFontSize?: () => void;
    onDecreaseFontSize?: () => void;
    enabled?: boolean;
}) {
    const shortcuts: Shortcut[] = [
        // Navigation
        ...(onNextChapter
            ? [{ key: "ArrowRight", handler: onNextChapter, description: "Next chapter" }]
            : []),
        ...(onPrevChapter
            ? [{ key: "ArrowLeft", handler: onPrevChapter, description: "Previous chapter" }]
            : []),
        // Menu
        ...(onToggleMenu
            ? [{ key: "m", handler: onToggleMenu, description: "Toggle menu" }]
            : []),
        // Theme
        ...(onToggleNightMode
            ? [{ key: "n", handler: onToggleNightMode, description: "Toggle night mode" }]
            : []),
        // Font size
        ...(onIncreaseFontSize
            ? [{ key: "+", handler: onIncreaseFontSize, description: "Increase font size" }]
            : []),
        ...(onIncreaseFontSize
            ? [{ key: "=", handler: onIncreaseFontSize, description: "Increase font size" }]
            : []),
        ...(onDecreaseFontSize
            ? [{ key: "-", handler: onDecreaseFontSize, description: "Decrease font size" }]
            : []),
    ];

    useKeyboardShortcuts(shortcuts, enabled);
}

/**
 * Hook for global app keyboard shortcuts
 */
export function useGlobalShortcuts({
    onSearch,
    onGoHome,
    onGoToFavorites,
    onGoToSettings,
    onToggleTheme,
    enabled = true,
}: {
    onSearch?: () => void;
    onGoHome?: () => void;
    onGoToFavorites?: () => void;
    onGoToSettings?: () => void;
    onToggleTheme?: () => void;
    enabled?: boolean;
}) {
    const shortcuts: Shortcut[] = [
        ...(onSearch
            ? [{ key: "/", handler: onSearch, description: "Focus search" }]
            : []),
        ...(onSearch
            ? [{ key: "k", handler: onSearch, options: { ctrl: true }, description: "Search" }]
            : []),
        ...(onGoHome
            ? [{ key: "h", handler: onGoHome, options: { ctrl: true }, description: "Go home" }]
            : []),
        ...(onGoToFavorites
            ? [{ key: "f", handler: onGoToFavorites, options: { ctrl: true }, description: "Go to favorites" }]
            : []),
        ...(onGoToSettings
            ? [{ key: ",", handler: onGoToSettings, options: { ctrl: true }, description: "Go to settings" }]
            : []),
        ...(onToggleTheme
            ? [{ key: "d", handler: onToggleTheme, options: { ctrl: true }, description: "Toggle theme" }]
            : []),
    ];

    useKeyboardShortcuts(shortcuts, enabled);
}

export default useKeyboardShortcuts;
