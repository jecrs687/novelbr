'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const requirementOptions = [
    { value: 'CHAPTERS_READ', label: 'Capítulos Lidos' },
    { value: 'NOVELS_COMPLETED', label: 'Novels Completas' },
    { value: 'REVIEWS_WRITTEN', label: 'Reviews Escritas' },
    { value: 'COMMENTS_POSTED', label: 'Comentários Postados' },
    { value: 'DAYS_STREAK', label: 'Dias Consecutivos' },
    { value: 'FAVORITES_COUNT', label: 'Favoritos' },
    { value: 'READING_TIME', label: 'Tempo de Leitura (minutos)' },
];

export default function NewAchievementPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            slug: formData.get('slug'),
            description: formData.get('description'),
            icon: formData.get('icon') || null,
            points: parseInt(formData.get('points') as string) || 0,
            requirement: formData.get('requirement'),
            threshold: parseInt(formData.get('threshold') as string) || 1,
        };

        try {
            const response = await fetch('/api/bko/achievements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Erro ao criar conquista');
            }

            router.push('/bko/achievements');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    }

    function generateSlug(name: string) {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/bko/achievements"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Nova Conquista</h1>
                    <p className="text-gray-400 mt-1">Criar uma nova conquista para os usuários</p>
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-red-900/50 border border-red-700 p-4 text-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Informações da Conquista</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nome *
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                onChange={(e) => {
                                    const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                                    if (slugInput && !slugInput.dataset.edited) {
                                        slugInput.value = generateSlug(e.target.value);
                                    }
                                }}
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Ex: Leitor Iniciante, Mestre das Reviews"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Slug *
                            </label>
                            <input
                                type="text"
                                name="slug"
                                required
                                onChange={(e) => {
                                    (e.target as HTMLInputElement).dataset.edited = 'true';
                                }}
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="leitor-iniciante"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Descrição *
                            </label>
                            <textarea
                                name="description"
                                required
                                rows={3}
                                className="w-full rounded-lg bg-gray-700 border border-gray-600 px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Descrição da conquista para os usuários..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Ícone (Emoji)
                                </label>
                                <input
                                    type="text"
                                    name="icon"
                                    maxLength={4}
                                    className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="🏆"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Pontos *
                                </label>
                                <input
                                    type="number"
                                    name="points"
                                    required
                                    min="0"
                                    defaultValue="10"
                                    className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Requisitos</h2>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tipo de Requisito *
                            </label>
                            <select
                                name="requirement"
                                required
                                defaultValue="CHAPTERS_READ"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {requirementOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Valor Necessário *
                            </label>
                            <input
                                type="number"
                                name="threshold"
                                required
                                min="1"
                                defaultValue="1"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/bko/achievements"
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
                        {isLoading ? 'Salvando...' : 'Criar Conquista'}
                    </button>
                </div>
            </form>
        </div>
    );
}
