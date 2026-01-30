import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
    Search,
    Trash2,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ThumbsUp,
    ThumbsDown,
    Clock,
    BookOpen,
    AlertCircle,
} from 'lucide-react';

interface PageProps {
    searchParams: Promise<{ page?: string; search?: string; status?: string; spoiler?: string }>;
}

async function getReviews(page: number, search?: string, status?: string, spoiler?: string) {
    const limit = 15;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (status === 'approved') {
        where.isApproved = true;
    } else if (status === 'pending') {
        where.isApproved = false;
    }

    if (spoiler === 'true') {
        where.isSpoiler = true;
    } else if (spoiler === 'false') {
        where.isSpoiler = false;
    }

    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
                novel: { select: { id: true, title: true, slug: true, coverImage: true } },
            },
        }),
        prisma.review.count({ where }),
    ]);

    return { reviews, total, totalPages: Math.ceil(total / limit) };
}

export default async function ReviewsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const search = params.search;
    const status = params.status;
    const spoiler = params.spoiler;

    const { reviews, total, totalPages } = await getReviews(page, search, status, spoiler);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Reviews</h1>
                    <p className="text-gray-400 mt-1">Moderar reviews dos usuários</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <form className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="Buscar por título ou conteúdo..."
                        className="w-full h-10 rounded-lg bg-gray-800 border border-gray-700 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </form>
                <select
                    defaultValue={status || ''}
                    className="h-10 rounded-lg bg-gray-800 border border-gray-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Todos os status</option>
                    <option value="approved">Aprovados</option>
                    <option value="pending">Pendentes</option>
                </select>
                <select
                    defaultValue={spoiler || ''}
                    className="h-10 rounded-lg bg-gray-800 border border-gray-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Todos</option>
                    <option value="true">Com Spoiler</option>
                    <option value="false">Sem Spoiler</option>
                </select>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-400">
                Mostrando {reviews.length} de {total} reviews
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <div key={review.id} className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
                        <div className="p-4">
                            <div className="flex items-start gap-4">
                                {/* Novel Cover */}
                                <div className="h-20 w-14 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                                    {review.novel.coverImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={review.novel.coverImage} alt={review.novel.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <BookOpen className="h-6 w-6 text-gray-500" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <Link
                                                href={`/bko/novels/${review.novel.id}`}
                                                className="text-sm font-medium text-indigo-400 hover:underline"
                                            >
                                                {review.novel.title}
                                            </Link>
                                            <h3 className="text-lg font-semibold text-white mt-1">{review.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {review.isApproved ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-900/50 text-green-400 text-xs">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Aprovada
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-900/50 text-yellow-400 text-xs">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    Pendente
                                                </span>
                                            )}
                                            {review.isSpoiler && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-900/50 text-red-400 text-xs">
                                                    <AlertCircle className="h-3 w-3" />
                                                    Spoiler
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-300 mt-2 line-clamp-3">{review.content}</p>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center">
                                                    {review.user.avatarUrl ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={review.user.avatarUrl} alt={review.user.username} className="h-full w-full rounded-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs font-medium text-white">
                                                            {(review.user.displayName?.[0] || review.user.username[0]).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <Link
                                                    href={`/bko/users/${review.user.id}`}
                                                    className="text-xs text-gray-400 hover:text-white"
                                                >
                                                    {review.user.displayName || review.user.username}
                                                </Link>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-green-400">
                                                <ThumbsUp className="h-3 w-3" />
                                                {review.likes}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-red-400">
                                                <ThumbsDown className="h-3 w-3" />
                                                {review.dislikes}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                <Clock className="h-3 w-3" />
                                                {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {!review.isApproved && (
                                                <button className="p-2 rounded-lg text-green-400 hover:bg-gray-700 transition-colors" title="Aprovar">
                                                    <CheckCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                            {review.isApproved && (
                                                <button className="p-2 rounded-lg text-yellow-400 hover:bg-gray-700 transition-colors" title="Reprovar">
                                                    <XCircle className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button className="p-2 rounded-lg text-red-400 hover:bg-gray-700 transition-colors" title="Excluir">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
                            href={`/bko/reviews?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}${spoiler ? `&spoiler=${spoiler}` : ''}`}
                            className={`px-3 py-1 rounded-lg text-sm ${page === 1
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                        >
                            Anterior
                        </Link>
                        <Link
                            href={`/bko/reviews?page=${Math.min(totalPages, page + 1)}${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}${spoiler ? `&spoiler=${spoiler}` : ''}`}
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
