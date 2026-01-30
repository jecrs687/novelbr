"use client";

import { cn } from "@/lib/utils";
import {
    createContext,
    useContext,
    useState,
    type ReactNode,
    useId,
    useCallback,
} from "react";

// ==================== CONTEXT ====================
interface TabsContextValue {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("Tabs components must be used within a Tabs provider");
    }
    return context;
}

// ==================== TABS CONTAINER ====================
interface TabsProps {
    children: ReactNode;
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
}

export function Tabs({
    children,
    defaultValue,
    value,
    onValueChange,
    className,
}: TabsProps) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const baseId = useId();

    const activeTab = value ?? internalValue;
    const setActiveTab = useCallback(
        (tab: string) => {
            if (value === undefined) {
                setInternalValue(tab);
            }
            onValueChange?.(tab);
        },
        [value, onValueChange]
    );

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    );
}

// ==================== TABS LIST ====================
type TabsListVariant = "default" | "pills" | "underline" | "segmented";

const listVariantStyles: Record<TabsListVariant, string> = {
    default: "bg-muted rounded-lg p-1 gap-1",
    pills: "gap-2",
    underline: "border-b border-border gap-4",
    segmented: "bg-muted rounded-lg p-1 gap-0",
};

interface TabsListProps {
    children: ReactNode;
    variant?: TabsListVariant;
    className?: string;
    fullWidth?: boolean;
}

export function TabsList({
    children,
    variant = "default",
    className,
    fullWidth,
}: TabsListProps) {
    return (
        <div
            role="tablist"
            className={cn(
                "inline-flex items-center",
                listVariantStyles[variant],
                fullWidth && "w-full",
                className
            )}
            data-variant={variant}
        >
            {children}
        </div>
    );
}

// ==================== TAB TRIGGER ====================
const triggerVariantStyles: Record<TabsListVariant, { base: string; active: string; inactive: string }> = {
    default: {
        base: "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active: "bg-background text-foreground shadow-sm",
        inactive: "text-muted-foreground hover:text-foreground",
    },
    pills: {
        base: "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active: "bg-primary text-primary-foreground",
        inactive: "text-muted-foreground hover:text-foreground hover:bg-muted",
    },
    underline: {
        base: "pb-3 text-sm font-medium border-b-2 -mb-px transition-colors",
        active: "border-primary text-foreground",
        inactive: "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50",
    },
    segmented: {
        base: "px-4 py-2 text-sm font-medium transition-colors first:rounded-l-md last:rounded-r-md",
        active: "bg-background text-foreground shadow-sm",
        inactive: "text-muted-foreground hover:text-foreground",
    },
};

interface TabTriggerProps {
    value: string;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    icon?: ReactNode;
    count?: number;
}

export function TabTrigger({
    value,
    children,
    className,
    disabled,
    icon,
    count,
}: TabTriggerProps) {
    const { activeTab, setActiveTab, baseId } = useTabsContext();
    const isActive = activeTab === value;

    // Get variant from parent TabsList
    const variant = "default"; // Default, actual variant passed via data attribute

    return (
        <button
            role="tab"
            type="button"
            id={`${baseId}-tab-${value}`}
            aria-selected={isActive}
            aria-controls={`${baseId}-panel-${value}`}
            tabIndex={isActive ? 0 : -1}
            disabled={disabled}
            onClick={() => setActiveTab(value)}
            className={cn(
                "inline-flex items-center justify-center gap-2 whitespace-nowrap",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                triggerVariantStyles[variant].base,
                isActive ? triggerVariantStyles[variant].active : triggerVariantStyles[variant].inactive,
                className
            )}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
            {typeof count === "number" && (
                <span
                    className={cn(
                        "ml-1 rounded-full px-2 py-0.5 text-xs",
                        isActive
                            ? "bg-primary/10 text-primary"
                            : "bg-muted-foreground/10 text-muted-foreground"
                    )}
                >
                    {count}
                </span>
            )}
        </button>
    );
}

// ==================== TAB CONTENT ====================
interface TabContentProps {
    value: string;
    children: ReactNode;
    className?: string;
    forceMount?: boolean;
}

export function TabContent({
    value,
    children,
    className,
    forceMount,
}: TabContentProps) {
    const { activeTab, baseId } = useTabsContext();
    const isActive = activeTab === value;

    if (!isActive && !forceMount) return null;

    return (
        <div
            role="tabpanel"
            id={`${baseId}-panel-${value}`}
            aria-labelledby={`${baseId}-tab-${value}`}
            tabIndex={0}
            hidden={!isActive}
            className={cn(
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "mt-4 animate-fadeIn",
                !isActive && "hidden",
                className
            )}
        >
            {children}
        </div>
    );
}

// ==================== SIMPLE TAB BUTTONS ====================
// For when you just want styled buttons without the full tabs system

interface TabButtonsProps {
    options: Array<{ value: string; label: string; icon?: ReactNode; count?: number }>;
    value: string;
    onChange: (value: string) => void;
    variant?: "default" | "pills" | "underline";
    className?: string;
}

export function TabButtons({
    options,
    value,
    onChange,
    variant = "default",
    className,
}: TabButtonsProps) {
    const styles = triggerVariantStyles[variant];

    return (
        <div
            className={cn(
                "inline-flex items-center",
                listVariantStyles[variant],
                className
            )}
        >
            {options.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    className={cn(
                        "inline-flex items-center justify-center gap-2 whitespace-nowrap",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        styles.base,
                        value === option.value ? styles.active : styles.inactive
                    )}
                >
                    {option.icon && <span className="shrink-0">{option.icon}</span>}
                    {option.label}
                    {typeof option.count === "number" && (
                        <span
                            className={cn(
                                "rounded-full px-2 py-0.5 text-xs",
                                value === option.value
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted-foreground/10"
                            )}
                        >
                            {option.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}
