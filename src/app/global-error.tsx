"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="pt-BR">
            <body className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center space-y-6">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">Erro crítico</h1>
                        <p className="text-gray-400">
                            Ocorreu um erro grave no aplicativo. Por favor, tente recarregar a
                            página.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <button
                            onClick={reset}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-xl hover:bg-purple-700 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Recarregar
                        </button>

                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Ir para início
                        </Link>
                    </div>

                    {/* Error ID */}
                    {error.digest && (
                        <p className="text-xs text-gray-500">
                            Código do erro: {error.digest}
                        </p>
                    )}
                </div>
            </body>
        </html>
    );
}
