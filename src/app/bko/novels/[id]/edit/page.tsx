'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Novel {
    id: string;
    title: string;
    originalTitle: string | null;
    slug: string;
    description: string;
    author: string | null;
    artist: string | null;
    coverImage: string | null;
    status: string;
    type: string;
    releaseYear: number | null;
    genres: { genre: { id: string; name: string } }[];
    tags: { tag: { id: string; name: string } }[];
}

interface Genre {
    id: string;
    name: string;
}

interface Tag {
    id: string;
    name: string;
}

export default function EditNovelPage() {
    const router = useRouter();
    const params = useParams();
    const novelId = params.id as string;

    const [novel, setNovel] = useState<Novel | null>(null);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [novelRes, genresRes, tagsRes] = await Promise.all([
                    fetch(`/api/bko/novels/${novelId}`),
                    fetch('/api/bko/genres'),
                    fetch('/api/bko/tags'),
                ]);

                if (!novelRes.ok) throw new Error('Novel não encontrada');

                const novelData = await novelRes.json();
                const genresData = await genresRes.json();
                const tagsData = await tagsRes.json();

                setNovel(novelData);
                setGenres(genresData);
                setTags(tagsData);
                setSelectedGenres(novelData.genres.map((g: { genre: { id: string } }) => g.genre.id));
                setSelectedTags(novelData.tags.map((t: { tag: { id: string } }) => t.tag.id));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao carregar novel');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [novelId]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title'),
            originalTitle: formData.get('originalTitle') || null,
            slug: formData.get('slug'),
            description: formData.get('description'),
            author: formData.get('author') || null,
            artist: formData.get('artist') || null,
            coverImage: formData.get('coverImage') || null,
            status: formData.get('status'),
            type: formData.get('type'),
            year: formData.get('year') || null,
            genreIds: selectedGenres,
            tagIds: selectedTags,
        };

        try {
            const response = await fetch(`/api/bko/novels/${novelId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Erro ao atualizar novel');
            }

            router.push('/bko/novels');
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

    if (!novel) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400">{error || 'Novel não encontrada'}</p>
                <Link href="/bko/novels" className="text-indigo-400 hover:underline mt-4 inline-block">
                    Voltar para novels
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/bko/novels"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Editar Novel</h1>
                    <p className="text-gray-400 mt-1">{novel.title}</p>
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
                            <h2 className="text-lg font-semibold text-white mb-4">Informações Básicas</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Título *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        defaultValue={novel.title}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Título Original
                                    </label>
                                    <input
                                        type="text"
                                        name="originalTitle"
                                        defaultValue={novel.originalTitle || ''}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                        defaultValue={novel.slug}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={6}
                                        defaultValue={novel.description}
                                        className="w-full rounded-lg bg-gray-700 border border-gray-600 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Gêneros e Tags</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Gêneros
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {genres.map((genre) => (
                                            <label
                                                key={genre.id}
                                                className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${selectedGenres.includes(genre.id)
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={selectedGenres.includes(genre.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedGenres([...selectedGenres, genre.id]);
                                                        } else {
                                                            setSelectedGenres(selectedGenres.filter(id => id !== genre.id));
                                                        }
                                                    }}
                                                />
                                                {genre.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Tags
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <label
                                                key={tag.id}
                                                className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${selectedTags.includes(tag.id)
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="sr-only"
                                                    checked={selectedTags.includes(tag.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedTags([...selectedTags, tag.id]);
                                                        } else {
                                                            setSelectedTags(selectedTags.filter(id => id !== tag.id));
                                                        }
                                                    }}
                                                />
                                                {tag.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-white mb-4">Detalhes</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Autor
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        defaultValue={novel.author || ''}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Artista
                                    </label>
                                    <input
                                        type="text"
                                        name="artist"
                                        defaultValue={novel.artist || ''}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Ano de Lançamento
                                    </label>
                                    <input
                                        type="number"
                                        name="year"
                                        defaultValue={novel.releaseYear || ''}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        defaultValue={novel.status}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="ONGOING">Em Andamento</option>
                                        <option value="COMPLETED">Completo</option>
                                        <option value="HIATUS">Hiato</option>
                                        <option value="DROPPED">Dropado</option>
                                        <option value="CANCELLED">Cancelado</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Tipo
                                    </label>
                                    <select
                                        name="type"
                                        defaultValue={novel.type}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="WEB_NOVEL">Web Novel</option>
                                        <option value="LIGHT_NOVEL">Light Novel</option>
                                        <option value="PUBLISHED_NOVEL">Novel Publicada</option>
                                        <option value="FAN_FICTION">Fan Fiction</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        URL da Capa
                                    </label>
                                    <input
                                        type="url"
                                        name="coverImage"
                                        defaultValue={novel.coverImage || ''}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
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
                                href="/bko/novels"
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
