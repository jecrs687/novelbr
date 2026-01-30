import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Tag,
    BookOpen,
    Palette,
} from 'lucide-react';

interface PageProps {
    searchParams: Promise<{ page?: string; search?: string }>;
}

async function getGenres(page: number, search?: string) {
    const limit = 20;
    const skip = (page - 1) * limit;

    const where = search ? {
        OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
        ],
    } : {};

    const [genres, total] = await Promise.all([
        prisma.genre.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { novels: true },
                },
            },
        }),
        prisma.genre.count({ where }),
    ]);

    return { genres, total, totalPages: Math.ceil(total / limit) };
}

export default async function GenresPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const search = params.search;

    const { genres, total, totalPages } = await getGenres(page, search);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gêneros</h1>
                    <p className="text-gray-400 mt-1">Gerenciar categorias de gênero das novels</p>
                </div>
                <Link
                    href="/bko/genres/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Novo Gênero
                </Link>
            </div>

            {/* Filters */}
            <form className="flex-1 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="Buscar gêneros..."
                    className="w-full h-10 rounded-lg bg-gray-800 border border-gray-700 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </form>

            {/* Stats */}
            <div className="text-sm text-gray-400">
                Mostrando {genres.length} de {total} gêneros
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {genres.map((genre) => (
                    <div key={genre.id} className="rounded-xl bg-gray-800 border border-gray-700 p-4">
                        <div className="flex items-start justify-between mb-3">
                            <div
                                className="h-10 w-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: genre.color ? `${genre.color}20` : '#4f46e520' }}
                            >
                                {genre.icon ? (
                                    <span className="text-xl">{genre.icon}</span>
                                ) : (
                                    <Tag className="h-5 w-5" style={{ color: genre.color || '#818cf8' }} />
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/bko/genres/${genre.id}/edit`}
                                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                </Link>
                                <button className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-sm font-semibold text-white">{genre.name}</h3>
                        <p className="text-xs text-gray-400 mt-1">/{genre.slug}</p>
                        {genre.description && (
                            <p className="text-xs text-gray-300 mt-2 line-clamp-2">{genre.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                            <BookOpen className="h-3 w-3" />
                            {genre._count.novels} novels
                        </div>
                        {genre.color && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                                <Palette className="h-3 w-3" />
                                <span
                                    className="w-4 h-4 rounded-full border border-gray-600"
                                    style={{ backgroundColor: genre.color }}
                                />
                                {genre.color}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                        Página {page} de {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/bko/genres?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ''}`}
                            className={`px-3 py-1 rounded-lg text-sm ${page === 1
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                        >
                            Anterior
                        </Link>
                        <Link
                            href={`/bko/genres?page=${Math.min(totalPages, page + 1)}${search ? `&search=${search}` : ''}`}
                            className={`px-3 py-1 rounded-lg text-sm ${page === totalPages
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                        >
                            Próxima
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
