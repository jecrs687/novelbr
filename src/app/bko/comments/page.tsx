import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
    Search,
    Trash2,
    CheckCircle,
    XCircle,
    AlertTriangle,
    ThumbsUp,
    Clock,
    BookOpen,
} from 'lucide-react';

interface PageProps {
    searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

async function getComments(page: number, search?: string, status?: string) {
    const limit = 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
        where.content = { contains: search, mode: 'insensitive' };
    }

    if (status === 'approved') {
        where.isApproved = true;
    } else if (status === 'pending') {
        where.isApproved = false;
    }

    const [comments, total] = await Promise.all([
        prisma.comment.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
                chapter: {
                    include: {
                        novel: { select: { id: true, title: true, slug: true } },
                    },
                },
            },
        }),
        prisma.comment.count({ where }),
    ]);

    return { comments, total, totalPages: Math.ceil(total / limit) };
}

export default async function CommentsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const search = params.search;
    const status = params.status;

    const { comments, total, totalPages } = await getComments(page, search, status);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Comentários</h1>
                    <p className="text-gray-400 mt-1">Moderar comentários dos usuários</p>
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
                        placeholder="Buscar por conteúdo..."
                        className="w-full h-10 rounded-lg bg-gray-800 border border-gray-700 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </form>
                <select
                    defaultValue={status || ''}
                    className="h-10 rounded-lg bg-gray-800 border border-gray-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Todos</option>
                    <option value="approved">Aprovados</option>
                    <option value="pending">Pendentes</option>
                </select>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-400">
                Mostrando {comments.length} de {total} comentários
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="rounded-xl bg-gray-800 border border-gray-700 p-4">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                {comment.user.avatarUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={comment.user.avatarUrl} alt={comment.user.username} className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-sm font-medium text-white">
                                        {(comment.user.displayName?.[0] || comment.user.username[0]).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/bko/users/${comment.user.id}`}
                                            className="text-sm font-medium text-white hover:text-indigo-400"
                                        >
                                            {comment.user.displayName || comment.user.username}
                                        </Link>
                                        <span className="text-xs text-gray-400">@{comment.user.username}</span>
                                        {comment.isApproved ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-900/50 text-green-400 text-xs">
                                                <CheckCircle className="h-3 w-3" />
                                                Aprovado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-900/50 text-yellow-400 text-xs">
                                                <AlertTriangle className="h-3 w-3" />
                                                Pendente
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!comment.isApproved && (
                                            <button className="p-2 rounded-lg text-green-400 hover:bg-gray-700 transition-colors" title="Aprovar">
                                                <CheckCircle className="h-4 w-4" />
                                            </button>
                                        )}
                                        {comment.isApproved && (
                                            <button className="p-2 rounded-lg text-yellow-400 hover:bg-gray-700 transition-colors" title="Reprovar">
                                                <XCircle className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button className="p-2 rounded-lg text-red-400 hover:bg-gray-700 transition-colors" title="Excluir">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-300 mb-3">{comment.content}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="h-3 w-3" />
                                            <Link
                                                href={`/bko/novels/${comment.chapter.novel.id}`}
                                                className="hover:text-indigo-400"
                                            >
                                                {comment.chapter.novel.title}
                                            </Link>
                                            <span>- Cap. {comment.chapter.chapterNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <ThumbsUp className="h-3 w-3" />
                                            {comment.likes} likes
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                    {comment.parentId && (
                                        <span className="text-xs text-indigo-400">Resposta a outro comentário</span>
                                    )}
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
                            href={`/bko/comments?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}`}
                            className={`px-3 py-1 rounded-lg text-sm ${page === 1
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                        >
                            Anterior
                        </Link>
                        <Link
                            href={`/bko/comments?page=${Math.min(totalPages, page + 1)}${search ? `&search=${search}` : ''}${status ? `&status=${status}` : ''}`}
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
