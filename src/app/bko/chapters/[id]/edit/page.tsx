'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Chapter {
    id: string;
    novelId: string;
    chapterNumber: number;
    title: string | null;
    content: string;
    wordCount: number;
    isPublished: boolean;
    isPremium: boolean;
    novel: { id: string; title: string; slug: string };
}

export default function EditChapterPage() {
    const router = useRouter();
    const params = useParams();
    const chapterId = params.id as string;

    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [wordCount, setWordCount] = useState(0);

    useEffect(() => {
        async function fetchChapter() {
            try {
                const res = await fetch(`/api/bko/chapters/${chapterId}`);
                if (!res.ok) throw new Error('Capítulo não encontrado');
                const data = await res.json();
                setChapter(data);
                setWordCount(data.wordCount);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar capítulo');
            } finally {
                setIsLoading(false);
            }
        }

        fetchChapter();
    }, [chapterId]);

    function handleContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const text = e.target.value;
        const words = text.split(/\s+/).filter(word => word.length > 0).length;
        setWordCount(words);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title') || null,
            content: formData.get('content'),
            isPublished: formData.get('isPublished') === 'on',
            isPremium: formData.get('isPremium') === 'on',
        };

        try {
            const response = await fetch(`/api/bko/chapters/${chapterId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Erro ao atualizar capítulo');
            }

            router.push('/bko/chapters');
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

    if (!chapter) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400">{error || 'Capítulo não encontrado'}</p>
                <Link href="/bko/chapters" className="text-indigo-400 hover:underline mt-4 inline-block">
                    Voltar para capítulos
                </Link>
            </div>
        );
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
                    <h1 className="text-2xl font-bold text-white">Editar Capítulo</h1>
                    <p className="text-gray-400 mt-1">
                        {chapter.novel.title} - Capítulo {chapter.chapterNumber}
                    </p>
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-red-900/50 border border-red-700 p-4 text-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Conteúdo</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Título do Capítulo
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        defaultValue={chapter.title || ''}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Opcional"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Conteúdo *
                                        </label>
                                        <span className="text-xs text-gray-400">
                                            {wordCount.toLocaleString('pt-BR')} palavras
                                        </span>
                                    </div>
                                    <textarea
                                        name="content"
                                        required
                                        rows={20}
                                        defaultValue={chapter.content}
                                        onChange={handleContentChange}
                                        className="w-full rounded-lg bg-gray-700 border border-gray-600 px-4 py-3 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Configurações</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                                    <div>
                                        <p className="text-sm font-medium text-white">Publicado</p>
                                        <p className="text-xs text-gray-400">Visível para leitores</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isPublished"
                                            defaultChecked={chapter.isPublished}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                                    <div>
                                        <p className="text-sm font-medium text-white">Premium</p>
                                        <p className="text-xs text-gray-400">Apenas para assinantes</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isPremium"
                                            defaultChecked={chapter.isPremium}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                <Save className="h-4 w-4" />
                                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                            <Link
                                href="/bko/chapters"
                                className="w-full text-center px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
