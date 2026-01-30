import prisma from '@/lib/prisma';
import {
    Users,
    BookOpen,
    FileText,
    Eye,
    TrendingUp,
    Clock,
    Star,
    MessageSquare,
    Calendar,
    BarChart3,
    Activity,
} from 'lucide-react';

async function getStats() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
        totalUsers,
        totalNovels,
        totalChapters,
        totalViews,
        totalReviews,
        totalComments,
        totalRatings,
        newUsersThisMonth,
        newUsersThisWeek,
        newChaptersThisMonth,
        topNovels,
        topGenres,
        dailyStats,
        recentReadingSessions,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.novel.count(),
        prisma.chapter.count(),
        prisma.novel.aggregate({ _sum: { totalViews: true } }),
        prisma.review.count(),
        prisma.comment.count(),
        prisma.rating.count(),
        prisma.user.count({
            where: { createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.user.count({
            where: { createdAt: { gte: sevenDaysAgo } },
        }),
        prisma.chapter.count({
            where: { createdAt: { gte: thirtyDaysAgo } },
        }),
        prisma.novel.findMany({
            take: 10,
            orderBy: { totalViews: 'desc' },
            select: {
                id: true,
                title: true,
                slug: true,
                totalViews: true,
                averageRating: true,
                totalFavorites: true,
            },
        }),
        prisma.novelGenre.groupBy({
            by: ['genreId'],
            _count: true,
            orderBy: { _count: { genreId: 'desc' } },
            take: 10,
        }),
        prisma.dailyStats.findMany({
            orderBy: { date: 'desc' },
            take: 30,
        }),
        prisma.readingSession.aggregate({
            _sum: { duration: true, wordsRead: true },
            _count: true,
            where: { startedAt: { gte: thirtyDaysAgo } },
        }),
    ]);

    // Get genre names
    const genreIds = topGenres.map(g => g.genreId);
    const genres = await prisma.genre.findMany({
        where: { id: { in: genreIds } },
        select: { id: true, name: true, color: true },
    });

    const topGenresWithNames = topGenres.map(g => ({
        ...g,
        genre: genres.find(genre => genre.id === g.genreId),
    }));

    return {
        totalUsers,
        totalNovels,
        totalChapters,
        totalViews: totalViews._sum.totalViews || 0,
        totalReviews,
        totalComments,
        totalRatings,
        newUsersThisMonth,
        newUsersThisWeek,
        newChaptersThisMonth,
        topNovels,
        topGenres: topGenresWithNames,
        dailyStats,
        readingSessions: {
            count: recentReadingSessions._count,
            totalDuration: recentReadingSessions._sum.duration || 0,
            totalWords: recentReadingSessions._sum.wordsRead || 0,
        },
    };
}

function StatCard({
    title,
    value,
    subValue,
    icon: Icon,
    color = 'indigo'
}: {
    title: string;
    value: number | string;
    subValue?: string;
    icon: React.ElementType;
    color?: string;
}) {
    const colors: Record<string, string> = {
        indigo: 'bg-indigo-600/20 text-indigo-400',
        green: 'bg-green-600/20 text-green-400',
        yellow: 'bg-yellow-600/20 text-yellow-400',
        red: 'bg-red-600/20 text-red-400',
        blue: 'bg-blue-600/20 text-blue-400',
        purple: 'bg-purple-600/20 text-purple-400',
    };

    return (
        <div className="rounded-xl bg-gray-800 p-6 border border-gray-700">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-white">
                        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
                    </p>
                    {subValue && (
                        <p className="mt-1 text-sm text-gray-400">{subValue}</p>
                    )}
                </div>
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}

export default async function StatsPage() {
    const stats = await getStats();

    const avgReadingTime = stats.readingSessions.count > 0
        ? Math.round(stats.readingSessions.totalDuration / stats.readingSessions.count / 60)
        : 0;

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Estatísticas</h1>
                <p className="text-gray-400 mt-1">Visão analítica completa do sistema</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total de Usuários"
                    value={stats.totalUsers}
                    subValue={`+${stats.newUsersThisMonth} este mês`}
                    icon={Users}
                    color="indigo"
                />
                <StatCard
                    title="Total de Novels"
                    value={stats.totalNovels}
                    icon={BookOpen}
                    color="green"
                />
                <StatCard
                    title="Total de Capítulos"
                    value={stats.totalChapters}
                    subValue={`+${stats.newChaptersThisMonth} este mês`}
                    icon={FileText}
                    color="yellow"
                />
                <StatCard
                    title="Total de Visualizações"
                    value={stats.totalViews}
                    icon={Eye}
                    color="blue"
                />
            </div>

            {/* Engagement Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Reviews"
                    value={stats.totalReviews}
                    icon={Star}
                    color="yellow"
                />
                <StatCard
                    title="Comentários"
                    value={stats.totalComments}
                    icon={MessageSquare}
                    color="blue"
                />
                <StatCard
                    title="Avaliações"
                    value={stats.totalRatings}
                    icon={TrendingUp}
                    color="purple"
                />
                <StatCard
                    title="Sessões de Leitura"
                    value={stats.readingSessions.count}
                    subValue={`Média de ${avgReadingTime} min`}
                    icon={Clock}
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Novels */}
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-5 w-5 text-indigo-400" />
                        <h2 className="text-lg font-semibold text-white">Top 10 Novels por Visualizações</h2>
                    </div>
                    <div className="space-y-4">
                        {stats.topNovels.map((novel, index) => (
                            <div key={novel.id} className="flex items-center gap-4">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-400'
                                    }`}>
                                    {index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{novel.title}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span>{novel.totalViews.toLocaleString('pt-BR')} views</span>
                                        <span>★ {novel.averageRating.toFixed(1)}</span>
                                        <span>❤️ {novel.totalFavorites}</span>
                                    </div>
                                </div>
                                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-600 rounded-full"
                                        style={{
                                            width: `${(novel.totalViews / (stats.topNovels[0]?.totalViews || 1)) * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Genres */}
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="h-5 w-5 text-green-400" />
                        <h2 className="text-lg font-semibold text-white">Gêneros Mais Populares</h2>
                    </div>
                    <div className="space-y-4">
                        {stats.topGenres.map((item, index) => (
                            <div key={item.genreId} className="flex items-center gap-4">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-400'
                                    }`}>
                                    {index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white">{item.genre?.name || 'Unknown'}</p>
                                    <p className="text-xs text-gray-400">{item._count} novels</p>
                                </div>
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: item.genre?.color || '#6366f1' }}
                                />
                                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${(item._count / (stats.topGenres[0]?._count || 1)) * 100}%`,
                                            backgroundColor: item.genre?.color || '#6366f1',
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reading Stats */}
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-yellow-400" />
                        <h2 className="text-lg font-semibold text-white">Leitura (Últimos 30 dias)</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-gray-700">
                            <p className="text-2xl font-bold text-white">
                                {Math.round(stats.readingSessions.totalDuration / 60).toLocaleString('pt-BR')}
                            </p>
                            <p className="text-sm text-gray-400">Minutos lidos</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-700">
                            <p className="text-2xl font-bold text-white">
                                {stats.readingSessions.totalWords.toLocaleString('pt-BR')}
                            </p>
                            <p className="text-sm text-gray-400">Palavras lidas</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-700">
                            <p className="text-2xl font-bold text-white">
                                {stats.readingSessions.count.toLocaleString('pt-BR')}
                            </p>
                            <p className="text-sm text-gray-400">Sessões de leitura</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-700">
                            <p className="text-2xl font-bold text-white">{avgReadingTime}</p>
                            <p className="text-sm text-gray-400">Minutos por sessão</p>
                        </div>
                    </div>
                </div>

                {/* Growth Stats */}
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-purple-400" />
                        <h2 className="text-lg font-semibold text-white">Crescimento</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                            <div>
                                <p className="text-sm text-gray-400">Novos usuários (7 dias)</p>
                                <p className="text-xl font-bold text-white">{stats.newUsersThisWeek}</p>
                            </div>
                            <Users className="h-8 w-8 text-indigo-400" />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                            <div>
                                <p className="text-sm text-gray-400">Novos usuários (30 dias)</p>
                                <p className="text-xl font-bold text-white">{stats.newUsersThisMonth}</p>
                            </div>
                            <Users className="h-8 w-8 text-green-400" />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                            <div>
                                <p className="text-sm text-gray-400">Novos capítulos (30 dias)</p>
                                <p className="text-xl font-bold text-white">{stats.newChaptersThisMonth}</p>
                            </div>
                            <FileText className="h-8 w-8 text-yellow-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Stats Chart Placeholder */}
            {stats.dailyStats.length > 0 && (
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        <h2 className="text-lg font-semibold text-white">Estatísticas Diárias (Últimos 30 dias)</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Data</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Views</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Visitantes</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Novos Usuários</th>
                                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Capítulos Lidos</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {stats.dailyStats.slice(0, 10).map((day) => (
                                    <tr key={day.id} className="hover:bg-gray-750">
                                        <td className="px-4 py-2 text-sm text-white">
                                            {new Date(day.date).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-right text-gray-300">
                                            {day.totalViews.toLocaleString('pt-BR')}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-right text-gray-300">
                                            {day.uniqueVisitors.toLocaleString('pt-BR')}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-right text-gray-300">
                                            {day.newUsers}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-right text-gray-300">
                                            {day.chaptersRead.toLocaleString('pt-BR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
