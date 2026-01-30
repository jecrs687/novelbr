"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ==================== INPUT ====================
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    helper?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, helper, id, ...props }, ref) => {
        const inputId = id || props.name;

        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
                        {label}
                        {props.required && <span className="text-destructive ml-1">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        "w-full px-4 py-3 bg-background border rounded-xl text-foreground placeholder:text-muted-foreground transition-colors",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error ? "border-destructive focus:ring-destructive" : "border-border",
                        className
                    )}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
                    {...props}
                />
                {error && (
                    <p id={`${inputId}-error`} className="text-sm text-destructive" role="alert">
                        {error}
                    </p>
                )}
                {helper && !error && (
                    <p id={`${inputId}-helper`} className="text-sm text-muted-foreground">
                        {helper}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

// ==================== TEXTAREA ====================
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    label?: string;
    helper?: string;
    maxLength?: number;
    showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, error, label, helper, id, maxLength, showCount, value, ...props }, ref) => {
        const textareaId = id || props.name;
        const charCount = typeof value === "string" ? value.length : 0;

        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={textareaId} className="block text-sm font-medium text-foreground">
                        {label}
                        {props.required && <span className="text-destructive ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    value={value}
                    maxLength={maxLength}
                    className={cn(
                        "w-full px-4 py-3 bg-background border rounded-xl text-foreground placeholder:text-muted-foreground transition-colors resize-none",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error ? "border-destructive focus:ring-destructive" : "border-border",
                        className
                    )}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${textareaId}-error` : helper ? `${textareaId}-helper` : undefined}
                    {...props}
                />
                <div className="flex items-center justify-between">
                    <div>
                        {error && (
                            <p id={`${textareaId}-error`} className="text-sm text-destructive" role="alert">
                                {error}
                            </p>
                        )}
                        {helper && !error && (
                            <p id={`${textareaId}-helper`} className="text-sm text-muted-foreground">
                                {helper}
                            </p>
                        )}
                    </div>
                    {showCount && maxLength && (
                        <span className={cn(
                            "text-xs",
                            charCount > maxLength * 0.9 ? "text-destructive" : "text-muted-foreground"
                        )}>
                            {charCount}/{maxLength}
                        </span>
                    )}
                </div>
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

// ==================== SELECT ====================
export interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
    error?: string;
    label?: string;
    helper?: string;
    options: Array<{ value: string; label: string; disabled?: boolean }>;
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, error, label, helper, id, options, placeholder, ...props }, ref) => {
        const selectId = id || props.name;

        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={selectId} className="block text-sm font-medium text-foreground">
                        {label}
                        {props.required && <span className="text-destructive ml-1">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={cn(
                        "w-full px-4 py-3 bg-background border rounded-xl text-foreground transition-colors appearance-none cursor-pointer",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error ? "border-destructive focus:ring-destructive" : "border-border",
                        className
                    )}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${selectId}-error` : helper ? `${selectId}-helper` : undefined}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p id={`${selectId}-error`} className="text-sm text-destructive" role="alert">
                        {error}
                    </p>
                )}
                {helper && !error && (
                    <p id={`${selectId}-helper`} className="text-sm text-muted-foreground">
                        {helper}
                    </p>
                )}
            </div>
        );
    }
);
Select.displayName = "Select";

// ==================== CHECKBOX ====================
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string;
    description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, description, id, ...props }, ref) => {
        const checkboxId = id || props.name;

        return (
            <label htmlFor={checkboxId} className="flex items-start gap-3 cursor-pointer group">
                <input
                    ref={ref}
                    type="checkbox"
                    id={checkboxId}
                    className={cn(
                        "mt-0.5 w-5 h-5 rounded border-border bg-background cursor-pointer",
                        "checked:bg-primary checked:border-primary",
                        "focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        className
                    )}
                    {...props}
                />
                {(label || description) && (
                    <div>
                        {label && (
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                {label}
                            </span>
                        )}
                        {description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                        )}
                    </div>
                )}
            </label>
        );
    }
);
Checkbox.displayName = "Checkbox";

// ==================== SWITCH ====================
export interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    id?: string;
}

export function Switch({ checked, onChange, label, description, disabled, id }: SwitchProps) {
    return (
        <label className={cn("flex items-start gap-3", disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer")}>
            <button
                type="button"
                role="switch"
                id={id}
                aria-checked={checked}
                disabled={disabled}
                onClick={() => !disabled && onChange(!checked)}
                className={cn(
                    "relative w-11 h-6 rounded-full transition-colors shrink-0",
                    checked ? "bg-primary" : "bg-muted"
                )}
            >
                <span
                    className={cn(
                        "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
                        checked && "translate-x-5"
                    )}
                />
            </button>
            {(label || description) && (
                <div>
                    {label && <span className="text-sm font-medium text-foreground">{label}</span>}
                    {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
                </div>
            )}
        </label>
    );
}
