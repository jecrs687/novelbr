import { NextRequest, NextResponse } from "next/server";
import { getUserById, getUserReadingStats } from "@/lib/db";
import prisma from "@/lib/prisma";

// GET /api/auth/me?userId=xxx
// Returns full user profile with stats
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        // Get user data
        const user = await getUserById(userId);
        if (!user) {
            return NextResponse.json(
                { error: "Usuário não encontrado" },
                { status: 404 }
            );
        }

        // Get reading stats
        const readingStats = await getUserReadingStats(userId);

        // Get additional stats
        const [
            reviewsCount,
            commentsCount,
            bookmarksCount,
            listsCount,
            achievementsCount,
        ] = await Promise.all([
            prisma.review.count({ where: { userId } }),
            prisma.comment.count({ where: { userId } }),
            prisma.bookmark.count({ where: { userId } }),
            prisma.readingList.count({ where: { userId } }),
            prisma.userAchievement.count({ where: { userId, unlockedAt: { not: null } } }),
        ]);

        // Get recent reading activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentSessions = await prisma.readingSession.findMany({
            where: {
                userId,
                startedAt: { gte: sevenDaysAgo },
            },
            select: {
                startedAt: true,
                duration: true,
                wordsRead: true,
            },
            orderBy: { startedAt: "asc" },
        });

        // Group by day for activity chart
        const activityByDay: Record<string, { sessions: number; duration: number; words: number }> = {};
        const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

        // Initialize all 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayName = dayNames[date.getDay()];
            activityByDay[dayName] = { sessions: 0, duration: 0, words: 0 };
        }

        // Fill in actual data
        recentSessions.forEach((session) => {
            const dayName = dayNames[new Date(session.startedAt).getDay()];
            if (activityByDay[dayName]) {
                activityByDay[dayName].sessions += 1;
                activityByDay[dayName].duration += session.duration || 0;
                activityByDay[dayName].words += session.wordsRead || 0;
            }
        });

        const weeklyActivity = Object.entries(activityByDay).map(([day, data]) => ({
            day,
            chapters: data.sessions,
            duration: data.duration,
            words: data.words,
        }));

        // Calculate streak
        const allSessions = await prisma.readingSession.findMany({
            where: { userId },
            select: { startedAt: true },
            orderBy: { startedAt: "desc" },
            take: 100,
        });

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let lastDate: Date | null = null;

        const sessionDates = [...new Set(
            allSessions.map((s) => new Date(s.startedAt).toDateString())
        )];

        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        for (let i = 0; i < sessionDates.length; i++) {
            const dateStr = sessionDates[i];
            const date = new Date(dateStr);

            if (i === 0) {
                if (dateStr === today || dateStr === yesterday) {
                    tempStreak = 1;
                } else {
                    break;
                }
            } else if (lastDate) {
                const diffDays = Math.floor((lastDate.getTime() - date.getTime()) / 86400000);
                if (diffDays === 1) {
                    tempStreak++;
                } else {
                    break;
                }
            }

            lastDate = date;
        }
        currentStreak = tempStreak;
        longestStreak = Math.max(currentStreak, longestStreak);

        return NextResponse.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    displayName: user.displayName,
                    avatarUrl: user.avatarUrl,
                    bio: user.bio,
                    createdAt: user.createdAt,
                },
                stats: {
                    ...readingStats,
                    reviewsCount,
                    commentsCount,
                    bookmarksCount,
                    listsCount,
                    achievementsCount,
                    currentStreak,
                    longestStreak,
                },
                weeklyActivity,
            },
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json(
            { error: "Erro ao carregar perfil" },
            { status: 500 }
        );
    }
}
