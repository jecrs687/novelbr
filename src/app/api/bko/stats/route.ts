import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
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
            readingSessions,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.novel.count(),
            prisma.chapter.count(),
            prisma.novel.aggregate({ _sum: { totalViews: true } }),
            prisma.review.count(),
            prisma.comment.count(),
            prisma.rating.count(),
            prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
            prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
            prisma.chapter.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
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

        return NextResponse.json({
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
                count: readingSessions._count,
                totalDuration: readingSessions._sum.duration || 0,
                totalWords: readingSessions._sum.wordsRead || 0,
            },
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 });
    }
}
