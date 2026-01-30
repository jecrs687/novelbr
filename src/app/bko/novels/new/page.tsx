'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';

interface Genre {
    id: string;
    name: string;
    slug: string;
}

interface Tag {
    id: string;
    name: string;
    slug: string;
}

export default function NewNovelPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [alternativeTitles, setAlternativeTitles] = useState<string[]>([]);

    useEffect(() => {
        async function loadData() {
            const [genresRes, tagsRes] = await Promise.all([
                fetch('/api/bko/genres'),
                fetch('/api/bko/tags'),
            ]);
            const genresData = await genresRes.json();
            const tagsData = await tagsRes.json();
            setGenres(genresData.genres || []);
            setTags(tagsData.tags || []);
        }
        loadData();
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title'),
            slug: formData.get('slug'),
            originalTitle: formData.get('originalTitle') || null,
            alternativeTitles,
            description: formData.get('description'),
            coverImage: formData.get('coverImage') || null,
            bannerImage: formData.get('bannerImage') || null,
            author: formData.get('author') || null,
            artist: formData.get('artist') || null,
            publisher: formData.get('publisher') || null,
            releaseYear: formData.get('releaseYear') ? parseInt(formData.get('releaseYear') as string) : null,
            status: formData.get('status'),
            type: formData.get('type'),
            genreIds: selectedGenres,
            tagIds: selectedTags,
        };

        try {
            const response = await fetch('/api/bko/novels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Erro ao criar novel');
            }

            router.push('/bko/novels');
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    }

    function generateSlug(title: string) {
        return title
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
                    href="/bko/novels"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Nova Novel</h1>
                    <p className="text-gray-400 mt-1">Adicionar uma nova novel ao sistema</p>
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-red-900/50 border border-red-700 p-4 text-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Informações Básicas</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Título *
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                onChange={(e) => {
                                    const slugInput = document.querySelector('input[name="slug"]') as HTMLInputElement;
                                    if (slugInput && !slugInput.dataset.edited) {
                                        slugInput.value = generateSlug(e.target.value);
                                    }
                                }}
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Título da novel"
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
                                placeholder="titulo-da-novel"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Título Original
                            </label>
                            <input
                                type="text"
                                name="originalTitle"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Título em chinês/japonês/coreano"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Títulos Alternativos
                            </label>
                            <div className="space-y-2">
                                {alternativeTitles.map((title, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => {
                                                const newTitles = [...alternativeTitles];
                                                newTitles[index] = e.target.value;
                                                setAlternativeTitles(newTitles);
                                            }}
                                            className="flex-1 h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setAlternativeTitles(alternativeTitles.filter((_, i) => i !== index))}
                                            className="p-2 rounded-lg text-red-400 hover:bg-gray-700 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setAlternativeTitles([...alternativeTitles, ''])}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-indigo-400 hover:bg-gray-700 transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Adicionar título
                                </button>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Descrição *
                            </label>
                            <textarea
                                name="description"
                                required
                                rows={6}
                                className="w-full rounded-lg bg-gray-700 border border-gray-600 px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Sinopse da novel..."
                            />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Imagens</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                URL da Capa
                            </label>
                            <input
                                type="url"
                                name="coverImage"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="https://..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                URL do Banner
                            </label>
                            <input
                                type="url"
                                name="bannerImage"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Detalhes</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Autor
                            </label>
                            <input
                                type="text"
                                name="author"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Nome do autor"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Artista
                            </label>
                            <input
                                type="text"
                                name="artist"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Nome do artista"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Editora
                            </label>
                            <input
                                type="text"
                                name="publisher"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Nome da editora"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Ano de Lançamento
                            </label>
                            <input
                                type="number"
                                name="releaseYear"
                                min="1900"
                                max="2100"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="2024"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Status *
                            </label>
                            <select
                                name="status"
                                required
                                defaultValue="ONGOING"
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
                                Tipo *
                            </label>
                            <select
                                name="type"
                                required
                                defaultValue="WEB_NOVEL"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="WEB_NOVEL">Web Novel</option>
                                <option value="LIGHT_NOVEL">Light Novel</option>
                                <option value="PUBLISHED_NOVEL">Novel Publicada</option>
                                <option value="FAN_FICTION">Fan Fiction</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Genres & Tags */}
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Gêneros e Tags</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Gêneros
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {genres.map((genre) => (
                                    <button
                                        key={genre.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedGenres(
                                                selectedGenres.includes(genre.id)
                                                    ? selectedGenres.filter((id) => id !== genre.id)
                                                    : [...selectedGenres, genre.id]
                                            );
                                        }}
                                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${selectedGenres.includes(genre.id)
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {genre.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedTags(
                                                selectedTags.includes(tag.id)
                                                    ? selectedTags.filter((id) => id !== tag.id)
                                                    : [...selectedTags, tag.id]
                                            );
                                        }}
                                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${selectedTags.includes(tag.id)
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/bko/novels"
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
                        {isLoading ? 'Salvando...' : 'Criar Novel'}
                    </button>
                </div>
            </form>
        </div>
    );
}
