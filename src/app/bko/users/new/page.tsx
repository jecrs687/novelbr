'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, User, Mail, Lock, Globe, MapPin } from 'lucide-react';

export default function NewUserPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get('email'),
            username: formData.get('username'),
            displayName: formData.get('displayName') || null,
            password: formData.get('password'),
            bio: formData.get('bio') || null,
            website: formData.get('website') || null,
            location: formData.get('location') || null,
        };

        try {
            const response = await fetch('/api/bko/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Erro ao criar usuário');
            }

            router.push('/bko/users');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/bko/users"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Novo Usuário</h1>
                    <p className="text-gray-400 mt-1">Criar um novo usuário no sistema</p>
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-red-900/50 border border-red-700 p-4 text-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Informações Básicas</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="usuario@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Username *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    name="username"
                                    required
                                    className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nome de Exibição
                            </label>
                            <input
                                type="text"
                                name="displayName"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Nome completo"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Senha *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={8}
                                    className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Mínimo 8 caracteres"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Perfil</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Biografia
                            </label>
                            <textarea
                                name="bio"
                                rows={4}
                                className="w-full rounded-lg bg-gray-700 border border-gray-600 px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Uma breve descrição sobre o usuário..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Website
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="url"
                                        name="website"
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="https://exemplo.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Localização
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="São Paulo, Brasil"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/bko/users"
                        className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="h-4 w-4" />
                        {isLoading ? 'Salvando...' : 'Criar Usuário'}
                    </button>
                </div>
            </form>
        </div>
    );
}
