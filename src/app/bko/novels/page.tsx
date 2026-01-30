import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    BookOpen,
    Clock,
    Star,
    Users,
    FileText,
} from 'lucide-react';

interface PageProps {
    searchParams: Promise<{ page?: string; search?: string; status?: string; sort?: string }>;
}

async function getNovels(page: number, search?: string, status?: string, sort?: string) {
    const limit = 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { author: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (status) {
        where.status = status;
    }

    const orderBy = {
        newest: { createdAt: 'desc' as const },
        oldest: { createdAt: 'asc' as const },
        popular: { totalViews: 'desc' as const },
        rating: { averageRating: 'desc' as const },
        title: { title: 'asc' as const },
    }[sort || 'newest'] || { createdAt: 'desc' as const };

    const [novels, total] = await Promise.all([
        prisma.novel.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                genres: { include: { genre: true } },
                _count: {
                    select: {
                        chapters: true,
                        favorites: true,
                        ratings: true,
                        reviews: true,
                    },
                },
            },
        }),
        prisma.novel.count({ where }),
    ]);

    return { novels, total, totalPages: Math.ceil(total / limit) };
}

const statusLabels: Record<string, { label: string; color: string }> = {
    ONGOING: { label: 'Em Andamento', color: 'bg-green-600' },
    COMPLETED: { label: 'Completo', color: 'bg-blue-600' },
    HIATUS: { label: 'Hiato', color: 'bg-yellow-600' },
    DROPPED: { label: 'Dropado', color: 'bg-red-600' },
    CANCELLED: { label: 'Cancelado', color: 'bg-gray-600' },
};

export default async function NovelsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const search = params.search;
    const status = params.status;
    const sort = params.sort;

    const { novels, total, totalPages } = await getNovels(page, search, status, sort);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Novels</h1>
                    <p className="text-gray-400 mt-1">Gerenciar todas as novels do sistema</p>
                </div>
                <Link
                    href="/bko/novels/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Nova Novel
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <form className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="Buscar por título, autor..."
                        className="w-full h-10 rounded-lg bg-gray-800 border border-gray-700 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </form>
                <select
                    defaultValue={status || ''}
                    className="h-10 rounded-lg bg-gray-800 border border-gray-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Todos os status</option>
                    <option value="ONGOING">Em Andamento</option>
                    <option value="COMPLETED">Completo</option>
                    <option value="HIATUS">Hiato</option>
                    <option value="DROPPED">Dropado</option>
                    <option value="CANCELLED">Cancelado</option>
                </select>
                <select
                    defaultValue={sort || 'newest'}
                    className="h-10 rounded-lg bg-gray-800 border border-gray-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="newest">Mais recentes</option>
                    <option value="oldest">Mais antigos</option>
                    <option value="popular">Mais populares</option>
                    <option value="rating">Melhor avaliação</option>
                    <option value="title">Título (A-Z)</option>
                </select>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-400">
                Mostrando {novels.length} de {total} novels
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {novels.map((novel) => (
                    <div key={novel.id} className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
                        <div className="flex gap-4 p-4">
                            <div className="h-32 w-24 rounded-lg bg-gray-700 overflow-hidden flex-shrink-0">
                                {novel.coverImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={novel.coverImage} alt={novel.title} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <BookOpen className="h-8 w-8 text-gray-500" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-sm font-semibold text-white line-clamp-2">{novel.title}</h3>
                                    <span className={`${statusLabels[novel.status]?.color || 'bg-gray-600'} px-2 py-0.5 rounded text-xs text-white whitespace-nowrap`}>
                                        {statusLabels[novel.status]?.label || novel.status}
                                    </span>
                                </div>
                                {novel.author && (
                                    <p className="text-xs text-gray-400 mt-1">por {novel.author}</p>
                                )}
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {novel.genres.slice(0, 3).map((g) => (
                                        <span key={g.genreId} className="px-2 py-0.5 rounded bg-gray-700 text-xs text-gray-300">
                                            {g.genre.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        {novel._count.chapters} caps
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-3 w-3" />
                                        {novel.totalViews.toLocaleString('pt-BR')}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3" />
                                        {novel.averageRating.toFixed(1)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        {novel._count.favorites}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700 bg-gray-750">
                            <p className="text-xs text-gray-400">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {new Date(novel.createdAt).toLocaleDateString('pt-BR')}
                            </p>
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/bko/novels/${novel.id}`}
                                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                    title="Visualizar"
                                >
                                    <Eye className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={`/bko/novels/${novel.id}/edit`}
                                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                    title="Editar"
                                >
                                    <Edit className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={`/bko/novels/${novel.id}/chapters`}
                                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                    title="Capítulos"
                                >
                                    <FileText className="h-4 w-4" />
                                </Link>
                                <button
                                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
                                    title="Excluir"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
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
                            href={`/bko/novels?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}${sort ? `&sort=${sort}` : ''}`}
                            className={`px-3 py-1 rounded-lg text-sm ${page === 1
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                        >
                            Anterior
                        </Link>
                        <Link
                            href={`/bko/novels?page=${Math.min(totalPages, page + 1)}${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}${sort ? `&sort=${sort}` : ''}`}
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
