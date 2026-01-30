"use client";

import { cn } from "@/lib/utils";
import {
    useState,
    useRef,
    useEffect,
    createContext,
    useContext,
    type ReactNode,
} from "react";
import { ChevronDown, Check } from "lucide-react";

// ==================== CONTEXT ====================
interface DropdownContextValue {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    selectedValue?: string;
    onSelect?: (value: string) => void;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext() {
    const context = useContext(DropdownContext);
    if (!context) {
        throw new Error("Dropdown components must be used within a Dropdown provider");
    }
    return context;
}

// ==================== DROPDOWN ====================
type DropdownAlign = "start" | "center" | "end";

interface DropdownProps {
    children: ReactNode;
    className?: string;
}

export function Dropdown({ children, className }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
            <div ref={ref} className={cn("relative inline-block", className)}>
                {children}
            </div>
        </DropdownContext.Provider>
    );
}

// ==================== DROPDOWN TRIGGER ====================
interface DropdownTriggerProps {
    children: ReactNode;
    className?: string;
    asChild?: boolean;
}

export function DropdownTrigger({ children, className, asChild }: DropdownTriggerProps) {
    const { isOpen, setIsOpen } = useDropdownContext();

    if (asChild) {
        return (
            <div onClick={() => setIsOpen(!isOpen)} className={className}>
                {children}
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            className={cn(
                "inline-flex items-center justify-between gap-2 px-4 py-2",
                "bg-background border border-input rounded-lg",
                "text-sm font-medium",
                "hover:bg-muted transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className
            )}
        >
            {children}
            <ChevronDown
                className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    isOpen && "rotate-180"
                )}
            />
        </button>
    );
}

// ==================== DROPDOWN CONTENT ====================
interface DropdownContentProps {
    children: ReactNode;
    align?: DropdownAlign;
    className?: string;
    sideOffset?: number;
}

const alignStyles: Record<DropdownAlign, string> = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
};

export function DropdownContent({
    children,
    align = "start",
    className,
    sideOffset = 4,
}: DropdownContentProps) {
    const { isOpen } = useDropdownContext();

    if (!isOpen) return null;

    return (
        <div
            className={cn(
                "absolute z-50 min-w-[180px] py-1",
                "bg-popover border border-border rounded-lg shadow-lg",
                "animate-fadeIn",
                alignStyles[align],
                className
            )}
            style={{ marginTop: sideOffset }}
        >
            {children}
        </div>
    );
}

// ==================== DROPDOWN ITEM ====================
interface DropdownItemProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    icon?: ReactNode;
    shortcut?: string;
    destructive?: boolean;
}

export function DropdownItem({
    children,
    onClick,
    className,
    disabled,
    icon,
    shortcut,
    destructive,
}: DropdownItemProps) {
    const { setIsOpen } = useDropdownContext();

    const handleClick = () => {
        if (disabled) return;
        onClick?.();
        setIsOpen(false);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-sm",
                "transition-colors text-left",
                disabled
                    ? "opacity-50 cursor-not-allowed"
                    : destructive
                        ? "text-destructive hover:bg-destructive/10"
                        : "text-foreground hover:bg-muted",
                className
            )}
        >
            {icon && <span className="shrink-0 w-4 h-4">{icon}</span>}
            <span className="flex-1">{children}</span>
            {shortcut && (
                <span className="text-xs text-muted-foreground ml-auto">{shortcut}</span>
            )}
        </button>
    );
}

// ==================== DROPDOWN SEPARATOR ====================
export function DropdownSeparator({ className }: { className?: string }) {
    return <div className={cn("h-px bg-border my-1", className)} />;
}

// ==================== DROPDOWN LABEL ====================
interface DropdownLabelProps {
    children: ReactNode;
    className?: string;
}

export function DropdownLabel({ children, className }: DropdownLabelProps) {
    return (
        <div
            className={cn(
                "px-3 py-1.5 text-xs font-semibold text-muted-foreground",
                className
            )}
        >
            {children}
        </div>
    );
}

// ==================== SELECT DROPDOWN ====================
interface SelectDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string; icon?: ReactNode }>;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
}

export function SelectDropdown({
    value,
    onChange,
    options,
    placeholder = "Selecione...",
    className,
    disabled,
}: SelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className={cn("relative", className)}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "w-full flex items-center justify-between gap-2 px-4 py-2.5",
                    "bg-background border border-input rounded-lg",
                    "text-sm",
                    disabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-ring transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                )}
            >
                <span className={cn(!selectedOption && "text-muted-foreground")}>
                    {selectedOption ? (
                        <span className="flex items-center gap-2">
                            {selectedOption.icon}
                            {selectedOption.label}
                        </span>
                    ) : (
                        placeholder
                    )}
                </span>
                <ChevronDown
                    className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 py-1 bg-popover border border-border rounded-lg shadow-lg animate-fadeIn">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full flex items-center justify-between gap-2 px-3 py-2 text-sm",
                                "transition-colors text-left",
                                value === option.value
                                    ? "bg-primary/10 text-primary"
                                    : "hover:bg-muted"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                {option.icon}
                                {option.label}
                            </span>
                            {value === option.value && <Check className="w-4 h-4" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
