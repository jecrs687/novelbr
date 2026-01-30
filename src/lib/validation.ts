// Validation utility functions and hooks

export type ValidationRule<T> = {
    validate: (value: T) => boolean;
    message: string;
};

export type FieldValidation<T> = {
    rules: ValidationRule<T>[];
    touched: boolean;
    error: string | null;
};

// ==================== COMMON VALIDATION RULES ====================

export const required = (message = "Este campo é obrigatório"): ValidationRule<unknown> => ({
    validate: (value) => {
        if (typeof value === "string") return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== undefined;
    },
    message,
});

export const minLength = (min: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.length >= min,
    message: message || `Mínimo de ${min} caracteres`,
});

export const maxLength = (max: number, message?: string): ValidationRule<string> => ({
    validate: (value) => value.length <= max,
    message: message || `Máximo de ${max} caracteres`,
});

export const email = (message = "Email inválido"): ValidationRule<string> => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
});

export const pattern = (regex: RegExp, message: string): ValidationRule<string> => ({
    validate: (value) => regex.test(value),
    message,
});

export const min = (minValue: number, message?: string): ValidationRule<number> => ({
    validate: (value) => value >= minValue,
    message: message || `Valor mínimo: ${minValue}`,
});

export const max = (maxValue: number, message?: string): ValidationRule<number> => ({
    validate: (value) => value <= maxValue,
    message: message || `Valor máximo: ${maxValue}`,
});

export const match = (fieldName: string, getValue: () => string, message?: string): ValidationRule<string> => ({
    validate: (value) => value === getValue(),
    message: message || `Deve ser igual a ${fieldName}`,
});

export const url = (message = "URL inválida"): ValidationRule<string> => ({
    validate: (value) => {
        if (!value) return true;
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    },
    message,
});

export const alphanumeric = (message = "Apenas letras e números"): ValidationRule<string> => ({
    validate: (value) => /^[a-zA-Z0-9]+$/.test(value),
    message,
});

export const noWhitespace = (message = "Não pode conter espaços"): ValidationRule<string> => ({
    validate: (value) => !/\s/.test(value),
    message,
});

// ==================== VALIDATION FUNCTION ====================

export function validate<T>(value: T, rules: ValidationRule<T>[]): string | null {
    for (const rule of rules) {
        if (!rule.validate(value)) {
            return rule.message;
        }
    }
    return null;
}

export function validateAll<T extends Record<string, unknown>>(
    values: T,
    schema: { [K in keyof T]?: ValidationRule<T[K]>[] }
): { [K in keyof T]?: string } {
    const errors: { [K in keyof T]?: string } = {};

    for (const key in schema) {
        const rules = schema[key];
        if (rules) {
            const error = validate(values[key], rules);
            if (error) {
                errors[key] = error;
            }
        }
    }

    return errors;
}

export function hasErrors(errors: Record<string, string | undefined>): boolean {
    return Object.values(errors).some((error) => error !== undefined);
}

// ==================== USERNAME VALIDATION ====================

export const username = (message = "Nome de usuário inválido"): ValidationRule<string> => ({
    validate: (value) => /^[a-zA-Z0-9_-]{3,20}$/.test(value),
    message: message || "3-20 caracteres, apenas letras, números, _ e -",
});

// ==================== PASSWORD VALIDATION ====================

export const password = {
    minLength: (min = 8): ValidationRule<string> => ({
        validate: (value) => value.length >= min,
        message: `Mínimo de ${min} caracteres`,
    }),
    hasUppercase: (): ValidationRule<string> => ({
        validate: (value) => /[A-Z]/.test(value),
        message: "Deve conter uma letra maiúscula",
    }),
    hasLowercase: (): ValidationRule<string> => ({
        validate: (value) => /[a-z]/.test(value),
        message: "Deve conter uma letra minúscula",
    }),
    hasNumber: (): ValidationRule<string> => ({
        validate: (value) => /[0-9]/.test(value),
        message: "Deve conter um número",
    }),
    hasSpecial: (): ValidationRule<string> => ({
        validate: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
        message: "Deve conter um caractere especial",
    }),
    strong: (): ValidationRule<string>[] => [
        password.minLength(8),
        password.hasUppercase(),
        password.hasLowercase(),
        password.hasNumber(),
    ],
};

// ==================== HELPER: CHECK PASSWORD STRENGTH ====================

export function getPasswordStrength(value: string): {
    score: number;
    label: string;
    color: string;
} {
    let score = 0;

    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) score++;

    if (score <= 2) return { score, label: "Fraca", color: "bg-destructive" };
    if (score <= 4) return { score, label: "Média", color: "bg-amber-500" };
    return { score, label: "Forte", color: "bg-emerald-500" };
}
