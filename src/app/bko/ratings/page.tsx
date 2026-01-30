import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
    Star,
    BookOpen,
    User,
    Clock,
} from 'lucide-react';

interface PageProps {
    searchParams: Promise<{ page?: string; novel?: string; score?: string }>;
}

async function getRatings(page: number, novelId?: string, score?: string) {
    const limit = 30;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (novelId) {
        where.novelId = novelId;
    }

    if (score) {
        where.score = parseInt(score);
    }

    const [ratings, total, novels, stats] = await Promise.all([
        prisma.rating.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, username: true, displayName: true } },
                novel: { select: { id: true, title: true, slug: true } },
            },
        }),
        prisma.rating.count({ where }),
        prisma.novel.findMany({
            select: { id: true, title: true },
            orderBy: { title: 'asc' },
        }),
        prisma.rating.groupBy({
            by: ['score'],
            _count: true,
            orderBy: { score: 'desc' },
        }),
    ]);

    return { ratings, total, totalPages: Math.ceil(total / limit), novels, stats };
}

export default async function RatingsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const novelId = params.novel;
    const score = params.score;

    const { ratings, total, totalPages, novels, stats } = await getRatings(page, novelId, score);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Avaliações</h1>
                <p className="text-gray-400 mt-1">Visualizar todas as avaliações dos usuários</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-4">
                {[5, 4, 3, 2, 1].map((s) => {
                    const stat = stats.find((st) => st.score === s);
                    return (
                        <div key={s} className="rounded-lg bg-gray-800 border border-gray-700 p-4 text-center">
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {Array.from({ length: s }).map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="text-2xl font-bold text-white">{stat?._count || 0}</p>
                            <p className="text-xs text-gray-400">avaliações</p>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <select
                    defaultValue={novelId || ''}
                    className="h-10 rounded-lg bg-gray-800 border border-gray-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Todas as novels</option>
                    {novels.map((novel) => (
                        <option key={novel.id} value={novel.id}>
                            {novel.title}
                        </option>
                    ))}
                </select>
                <select
                    defaultValue={score || ''}
                    className="h-10 rounded-lg bg-gray-800 border border-gray-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Todas as notas</option>
                    <option value="5">5 estrelas</option>
                    <option value="4">4 estrelas</option>
                    <option value="3">3 estrelas</option>
                    <option value="2">2 estrelas</option>
                    <option value="1">1 estrela</option>
                </select>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-400">
                Mostrando {ratings.length} de {total} avaliações
            </div>

            {/* Table */}
            <div className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Usuário
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Novel
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Nota
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Data
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {ratings.map((rating) => (
                                <tr key={rating.id} className="hover:bg-gray-750">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            href={`/bko/users/${rating.user.id}`}
                                            className="flex items-center gap-2 text-sm text-white hover:text-indigo-400"
                                        >
                                            <User className="h-4 w-4 text-gray-400" />
                                            {rating.user.displayName || rating.user.username}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link
                                            href={`/bko/novels/${rating.novel.id}`}
                                            className="flex items-center gap-2 text-sm text-indigo-400 hover:underline"
                                        >
                                            <BookOpen className="h-4 w-4" />
                                            <span className="truncate max-w-[300px]">{rating.novel.title}</span>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: rating.score }).map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                            {Array.from({ length: 5 - rating.score }).map((_, i) => (
                                                <Star key={i} className="h-4 w-4 text-gray-600" />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1 text-sm text-gray-400">
                                            <Clock className="h-4 w-4" />
                                            {new Date(rating.createdAt).toLocaleDateString('pt-BR')}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
                        <p className="text-sm text-gray-400">
                            Página {page} de {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/bko/ratings?page=${Math.max(1, page - 1)}${novelId ? `&novel=${novelId}` : ''}${score ? `&score=${score}` : ''}`}
                                className={`px-3 py-1 rounded-lg text-sm ${page === 1
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                    }`}
                            >
                                Anterior
                            </Link>
                            <Link
                                href={`/bko/ratings?page=${Math.min(totalPages, page + 1)}${novelId ? `&novel=${novelId}` : ''}${score ? `&score=${score}` : ''}`}
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
        </div>
    );
}
