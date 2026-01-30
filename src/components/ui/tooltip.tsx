"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, type ReactNode } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

const positionStyles: Record<TooltipPosition, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles: Record<TooltipPosition, string> = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent",
    right: "right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent",
};

interface TooltipProps {
    content: ReactNode;
    children: ReactNode;
    position?: TooltipPosition;
    delay?: number;
    className?: string;
    disabled?: boolean;
}

export function Tooltip({
    content,
    children,
    position = "top",
    delay = 200,
    className,
    disabled,
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showTooltip = () => {
        if (disabled) return;
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onFocus={showTooltip}
            onBlur={hideTooltip}
        >
            {children}
            {isVisible && content && (
                <div
                    role="tooltip"
                    className={cn(
                        "absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg",
                        "animate-fadeIn whitespace-nowrap max-w-xs pointer-events-none",
                        positionStyles[position],
                        className
                    )}
                >
                    {content}
                    <span
                        className={cn(
                            "absolute w-0 h-0 border-[6px]",
                            arrowStyles[position]
                        )}
                    />
                </div>
            )}
        </div>
    );
}

// ==================== SIMPLE TOOLTIP ====================
interface TooltipSimpleProps {
    text: string;
    children: ReactNode;
    position?: TooltipPosition;
}

export function TooltipSimple({ text, children, position = "top" }: TooltipSimpleProps) {
    return (
        <Tooltip content={text} position={position}>
            {children}
        </Tooltip>
    );
}
