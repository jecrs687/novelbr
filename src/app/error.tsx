"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-destructive" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-foreground">
                        Algo deu errado
                    </h1>
                    <p className="text-muted-foreground">
                        Ocorreu um erro inesperado. Nossa equipe foi notificada e estamos
                        trabalhando para resolver o problema.
                    </p>
                </div>

                {/* Error Details (development only) */}
                {process.env.NODE_ENV === "development" && error.message && (
                    <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 text-left">
                        <p className="text-sm font-mono text-destructive break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-muted-foreground mt-2">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary-hover transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Tentar novamente
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-muted text-foreground font-medium rounded-xl hover:bg-muted/80 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Ir para início
                    </Link>
                </div>

                {/* Back link */}
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar à página anterior
                </button>
            </div>
        </div>
    );
}
