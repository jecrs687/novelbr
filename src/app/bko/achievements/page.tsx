import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Award,
    Users,
    Trophy,
    Target,
} from 'lucide-react';

interface PageProps {
    searchParams: Promise<{ page?: string; search?: string }>;
}

async function getAchievements(page: number, search?: string) {
    const limit = 20;
    const skip = (page - 1) * limit;

    const where = search ? {
        OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
        ],
    } : {};

    const [achievements, total] = await Promise.all([
        prisma.achievement.findMany({
            where,
            skip,
            take: limit,
            orderBy: { points: 'desc' },
            include: {
                _count: {
                    select: { users: true },
                },
            },
        }),
        prisma.achievement.count({ where }),
    ]);

    return { achievements, total, totalPages: Math.ceil(total / limit) };
}

const requirementLabels: Record<string, string> = {
    CHAPTERS_READ: 'Capítulos Lidos',
    NOVELS_COMPLETED: 'Novels Completas',
    REVIEWS_WRITTEN: 'Reviews Escritas',
    COMMENTS_POSTED: 'Comentários Postados',
    DAYS_STREAK: 'Dias Consecutivos',
    FAVORITES_COUNT: 'Favoritos',
    READING_TIME: 'Tempo de Leitura',
};

export default async function AchievementsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const search = params.search;

    const { achievements, total, totalPages } = await getAchievements(page, search);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Conquistas</h1>
                    <p className="text-gray-400 mt-1">Gerenciar sistema de conquistas</p>
                </div>
                <Link
                    href="/bko/achievements/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Nova Conquista
                </Link>
            </div>

            {/* Filters */}
            <form className="flex-1 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="Buscar conquistas..."
                    className="w-full h-10 rounded-lg bg-gray-800 border border-gray-700 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </form>

            {/* Stats */}
            <div className="text-sm text-gray-400">
                Mostrando {achievements.length} de {total} conquistas
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                    <div key={achievement.id} className="rounded-xl bg-gray-800 border border-gray-700 p-4">
                        <div className="flex items-start justify-between mb-4">
                            <div className="h-12 w-12 rounded-lg bg-yellow-600/20 flex items-center justify-center">
                                {achievement.icon ? (
                                    <span className="text-2xl">{achievement.icon}</span>
                                ) : (
                                    <Award className="h-6 w-6 text-yellow-400" />
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                <Link
                                    href={`/bko/achievements/${achievement.id}/edit`}
                                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                >
                                    <Edit className="h-4 w-4" />
                                </Link>
                                <button className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-sm font-semibold text-white">{achievement.name}</h3>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{achievement.description}</p>

                        <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                                <Trophy className="h-3 w-3 text-yellow-400" />
                                {achievement.points} pts
                            </div>
                            <div className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {requirementLabels[achievement.requirement] || achievement.requirement}
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="font-medium text-white">{achievement.threshold}</span>
                                necessário
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-300">
                                {achievement._count.users} usuários desbloquearam
                            </span>
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
                            href={`/bko/achievements?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ''}`}
                            className={`px-3 py-1 rounded-lg text-sm ${page === 1
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                        >
                            Anterior
                        </Link>
                        <Link
                            href={`/bko/achievements?page=${Math.min(totalPages, page + 1)}${search ? `&search=${search}` : ''}`}
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
