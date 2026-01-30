import {
    Users,
    BookOpen,
    FileText,
    Eye,
    TrendingUp,
    Clock,
    Star,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/prisma';

async function getStats() {
    const [
        totalUsers,
        totalNovels,
        totalChapters,
        totalViews,
        totalReviews,
        totalComments,
        recentUsers,
        recentNovels,
        topNovels,
        recentActivity,
    ] = await Promise.all([
        prisma.user.count(),
        prisma.novel.count(),
        prisma.chapter.count(),
        prisma.novel.aggregate({ _sum: { totalViews: true } }),
        prisma.review.count(),
        prisma.comment.count(),
        prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, username: true, displayName: true, avatarUrl: true, createdAt: true },
        }),
        prisma.novel.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: { id: true, title: true, slug: true, coverImage: true, createdAt: true, totalViews: true },
        }),
        prisma.novel.findMany({
            take: 5,
            orderBy: { totalViews: 'desc' },
            select: { id: true, title: true, slug: true, totalViews: true, averageRating: true },
        }),
        prisma.chapter.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: { novel: { select: { title: true, slug: true } } },
        }),
    ]);

    return {
        totalUsers,
        totalNovels,
        totalChapters,
        totalViews: totalViews._sum.totalViews || 0,
        totalReviews,
        totalComments,
        recentUsers,
        recentNovels,
        topNovels,
        recentActivity,
    };
}

function StatCard({
    title,
    value,
    icon: Icon,
    change,
    changeType
}: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    change?: string;
    changeType?: 'positive' | 'negative';
}) {
    return (
        <div className="rounded-xl bg-gray-800 p-6 border border-gray-700">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-400">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-white">
                        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
                    </p>
                    {change && (
                        <div className={`mt-2 flex items-center text-sm ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {changeType === 'positive' ? (
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            {change}
                        </div>
                    )}
                </div>
                <div className="h-12 w-12 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-indigo-400" />
                </div>
            </div>
        </div>
    );
}

export default async function BkoDashboard() {
    const stats = await getStats();

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Visão geral do sistema NovelBR</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard
                    title="Total de Usuários"
                    value={stats.totalUsers}
                    icon={Users}
                    change="+12% este mês"
                    changeType="positive"
                />
                <StatCard
                    title="Total de Novels"
                    value={stats.totalNovels}
                    icon={BookOpen}
                    change="+5 esta semana"
                    changeType="positive"
                />
                <StatCard
                    title="Total de Capítulos"
                    value={stats.totalChapters}
                    icon={FileText}
                />
                <StatCard
                    title="Visualizações"
                    value={stats.totalViews}
                    icon={Eye}
                    change="+23% este mês"
                    changeType="positive"
                />
                <StatCard
                    title="Reviews"
                    value={stats.totalReviews}
                    icon={Star}
                />
                <StatCard
                    title="Comentários"
                    value={stats.totalComments}
                    icon={MessageSquare}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Novels */}
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Novels Mais Populares</h2>
                        <Link href="/bko/novels" className="text-sm text-indigo-400 hover:text-indigo-300">
                            Ver todas
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {stats.topNovels.map((novel, index) => (
                            <div key={novel.id} className="flex items-center gap-4">
                                <span className="w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center text-xs font-medium text-indigo-400">
                                    {index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{novel.title}</p>
                                    <p className="text-xs text-gray-400">
                                        {novel.totalViews.toLocaleString('pt-BR')} views • ★ {novel.averageRating.toFixed(1)}
                                    </p>
                                </div>
                                <TrendingUp className="h-4 w-4 text-green-400" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Usuários Recentes</h2>
                        <Link href="/bko/users" className="text-sm text-indigo-400 hover:text-indigo-300">
                            Ver todos
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {stats.recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.username} className="h-full w-full rounded-full object-cover" />
                                    ) : (
                                        <span className="text-sm font-medium text-white">
                                            {user.displayName?.[0] || user.username[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        {user.displayName || user.username}
                                    </p>
                                    <p className="text-xs text-gray-400">@{user.username}</p>
                                </div>
                                <p className="text-xs text-gray-400">
                                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Novels */}
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Novels Recentes</h2>
                        <Link href="/bko/novels" className="text-sm text-indigo-400 hover:text-indigo-300">
                            Ver todas
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {stats.recentNovels.map((novel) => (
                            <div key={novel.id} className="flex items-center gap-4">
                                <div className="h-12 w-9 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                                    {novel.coverImage ? (
                                        <img src={novel.coverImage} alt={novel.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <BookOpen className="h-4 w-4 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{novel.title}</p>
                                    <p className="text-xs text-gray-400">
                                        {novel.totalViews.toLocaleString('pt-BR')} visualizações
                                    </p>
                                </div>
                                <p className="text-xs text-gray-400">
                                    {new Date(novel.createdAt).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Atividade Recente</h2>
                        <Link href="/bko/chapters" className="text-sm text-indigo-400 hover:text-indigo-300">
                            Ver todos
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {stats.recentActivity.map((chapter) => (
                            <div key={chapter.id} className="flex items-center gap-4">
                                <div className="h-8 w-8 rounded-lg bg-green-600/20 flex items-center justify-center flex-shrink-0">
                                    <FileText className="h-4 w-4 text-green-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">
                                        Cap. {chapter.chapterNumber} - {chapter.title || 'Sem título'}
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">{chapter.novel.title}</p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Clock className="h-3 w-3" />
                                    {new Date(chapter.createdAt).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Ações Rápidas</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    <Link
                        href="/bko/novels/new"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                        <BookOpen className="h-6 w-6 text-indigo-400" />
                        <span className="text-sm text-white">Nova Novel</span>
                    </Link>
                    <Link
                        href="/bko/genres/new"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                        <Star className="h-6 w-6 text-yellow-400" />
                        <span className="text-sm text-white">Novo Gênero</span>
                    </Link>
                    <Link
                        href="/bko/tags/new"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                        <FileText className="h-6 w-6 text-green-400" />
                        <span className="text-sm text-white">Nova Tag</span>
                    </Link>
                    <Link
                        href="/bko/achievements/new"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                        <FileText className="h-6 w-6 text-purple-400" />
                        <span className="text-sm text-white">Nova Conquista</span>
                    </Link>
                    <Link
                        href="/bko/comments"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                        <MessageSquare className="h-6 w-6 text-blue-400" />
                        <span className="text-sm text-white">Moderar</span>
                    </Link>
                    <Link
                        href="/bko/stats"
                        className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                    >
                        <TrendingUp className="h-6 w-6 text-red-400" />
                        <span className="text-sm text-white">Estatísticas</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
