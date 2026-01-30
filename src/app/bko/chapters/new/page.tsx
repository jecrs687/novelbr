'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

interface Novel {
    id: string;
    title: string;
    slug: string;
}

export default function NewChapterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [novels, setNovels] = useState<Novel[]>([]);
    const [selectedNovel, setSelectedNovel] = useState<string>('');
    const [nextChapterNumber, setNextChapterNumber] = useState<number>(1);

    useEffect(() => {
        async function loadNovels() {
            const res = await fetch('/api/bko/novels?limit=1000');
            const data = await res.json();
            setNovels(data.novels || []);
        }
        loadNovels();
    }, []);

    useEffect(() => {
        async function loadNextChapter() {
            if (!selectedNovel) return;
            const res = await fetch(`/api/bko/novels/${selectedNovel}/next-chapter`);
            const data = await res.json();
            setNextChapterNumber(data.nextChapterNumber || 1);
        }
        loadNextChapter();
    }, [selectedNovel]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const content = formData.get('content') as string;
        const wordCount = content.split(/\s+/).filter(Boolean).length;

        const data = {
            novelId: formData.get('novelId'),
            chapterNumber: parseInt(formData.get('chapterNumber') as string),
            title: formData.get('title') || null,
            content,
            wordCount,
            isPublished: formData.get('isPublished') === 'true',
            isPremium: formData.get('isPremium') === 'true',
        };

        try {
            const response = await fetch('/api/bko/chapters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Erro ao criar capítulo');
            }

            router.push('/bko/chapters');
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
                    href="/bko/chapters"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Novo Capítulo</h1>
                    <p className="text-gray-400 mt-1">Adicionar um novo capítulo a uma novel</p>
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-red-900/50 border border-red-700 p-4 text-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Informações do Capítulo</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Novel *
                            </label>
                            <select
                                name="novelId"
                                required
                                value={selectedNovel}
                                onChange={(e) => setSelectedNovel(e.target.value)}
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">Selecione uma novel</option>
                                {novels.map((novel) => (
                                    <option key={novel.id} value={novel.id}>
                                        {novel.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Número do Capítulo *
                            </label>
                            <input
                                type="number"
                                name="chapterNumber"
                                required
                                min="1"
                                value={nextChapterNumber}
                                onChange={(e) => setNextChapterNumber(parseInt(e.target.value))}
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Título do Capítulo
                            </label>
                            <input
                                type="text"
                                name="title"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Título opcional do capítulo"
                            />
                        </div>
                    </div>
                </div>

                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Conteúdo</h2>

                    <textarea
                        name="content"
                        required
                        rows={20}
                        className="w-full rounded-lg bg-gray-700 border border-gray-600 px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                        placeholder="Conteúdo do capítulo..."
                    />
                </div>

                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Configurações de Publicação</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Status
                            </label>
                            <select
                                name="isPublished"
                                defaultValue="true"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="true">Publicado</option>
                                <option value="false">Rascunho</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tipo de Acesso
                            </label>
                            <select
                                name="isPremium"
                                defaultValue="false"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="false">Gratuito</option>
                                <option value="true">Premium</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/bko/chapters"
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
                        {isLoading ? 'Salvando...' : 'Criar Capítulo'}
                    </button>
                </div>
            </form>
        </div>
    );
}
