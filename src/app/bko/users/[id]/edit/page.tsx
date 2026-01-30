'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface User {
    id: string;
    username: string;
    email: string;
    displayName: string | null;
    bio: string | null;
    website: string | null;
    location: string | null;
    avatarUrl: string | null;
}

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch(`/api/bko/users/${userId}`);
                if (!res.ok) throw new Error('Usuário não encontrado');
                const data = await res.json();
                setUser(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar usuário');
            } finally {
                setIsLoading(false);
            }
        }

        fetchUser();
    }, [userId]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            username: formData.get('username'),
            email: formData.get('email'),
            displayName: formData.get('displayName') || null,
            bio: formData.get('bio') || null,
            website: formData.get('website') || null,
            location: formData.get('location') || null,
            avatarUrl: formData.get('avatarUrl') || null,
        };

        try {
            const response = await fetch(`/api/bko/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Erro ao atualizar usuário');
            }

            router.push(`/bko/users/${userId}`);
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400">{error || 'Usuário não encontrado'}</p>
                <Link href="/bko/users" className="text-indigo-400 hover:underline mt-4 inline-block">
                    Voltar para usuários
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center gap-4">
                <Link
                    href={`/bko/users/${userId}`}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Editar Usuário</h1>
                    <p className="text-gray-400 mt-1">@{user.username}</p>
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-red-900/50 border border-red-700 p-4 text-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Informações Básicas</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Username *
                            </label>
                            <input
                                type="text"
                                name="username"
                                required
                                defaultValue={user.username}
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                defaultValue={user.email}
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nome de Exibição
                            </label>
                            <input
                                type="text"
                                name="displayName"
                                defaultValue={user.displayName || ''}
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                URL do Avatar
                            </label>
                            <input
                                type="url"
                                name="avatarUrl"
                                defaultValue={user.avatarUrl || ''}
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Perfil</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                rows={4}
                                defaultValue={user.bio || ''}
                                className="w-full rounded-lg bg-gray-700 border border-gray-600 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                defaultValue={user.website || ''}
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Localização
                            </label>
                            <input
                                type="text"
                                name="location"
                                defaultValue={user.location || ''}
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Link
                        href={`/bko/users/${userId}`}
                        className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    );
}
