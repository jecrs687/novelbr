import { NextRequest, NextResponse } from "next/server";
import { getUserAchievements, checkAndUnlockAchievements, getUserReadingStats } from "@/lib/db";
import prisma from "@/lib/prisma";

// Helper to get full user stats including streak
async function getFullUserStats(userId: string) {
    const baseStats = await getUserReadingStats(userId);

    const [reviewsCount, commentsCount] = await Promise.all([
        prisma.review.count({ where: { userId } }),
        prisma.comment.count({ where: { userId } }),
    ]);

    // Calculate streak
    const allSessions = await prisma.readingSession.findMany({
        where: { userId },
        select: { startedAt: true },
        orderBy: { startedAt: "desc" },
        take: 100,
    });

    let currentStreak = 0;
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

    return {
        ...baseStats,
        reviewsCount,
        commentsCount,
        currentStreak,
    };
}

// GET /api/achievements?userId=xxx
// Gets all achievements with user progress
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        // Get all achievements
        const allAchievements = await prisma.achievement.findMany({
            orderBy: { points: "desc" },
        });

        if (!userId) {
            // Return just the achievements without user progress
            return NextResponse.json({
                success: true,
                data: {
                    achievements: allAchievements.map((a) => ({
                        id: a.id,
                        slug: a.slug,
                        name: a.name,
                        description: a.description,
                        icon: a.icon,
                        points: a.points,
                        requirement: a.requirement,
                        threshold: a.threshold,
                        progress: 0,
                        unlockedAt: null,
                    })),
                    stats: { total: allAchievements.length, unlocked: 0, points: 0 },
                },
            });
        }

        // Get user achievements
        const userAchievements = await getUserAchievements(userId);
        const userAchievementMap = new Map(
            userAchievements.map((ua) => [ua.achievementId, ua])
        );

        // Get full user stats for progress calculations
        const stats = await getFullUserStats(userId);

        // Combine achievements with user progress
        const achievementsWithProgress = allAchievements.map((achievement) => {
            const userAchievement = userAchievementMap.get(achievement.id);

            let currentProgress = 0;

            // Calculate current progress based on requirement type
            switch (achievement.requirement) {
                case "CHAPTERS_READ":
                    currentProgress = stats.totalSessions;
                    break;
                case "NOVELS_COMPLETED":
                    currentProgress = stats.completedNovels;
                    break;
                case "FAVORITES_COUNT":
                    currentProgress = stats.favoriteCount;
                    break;
                case "READING_TIME":
                    currentProgress = Math.floor(stats.totalReadingTime / 3600); // hours
                    break;
                case "DAYS_STREAK":
                    currentProgress = stats.currentStreak;
                    break;
                case "REVIEWS_WRITTEN":
                    currentProgress = stats.reviewsCount;
                    break;
                case "COMMENTS_POSTED":
                    currentProgress = stats.commentsCount;
                    break;
                default:
                    currentProgress = userAchievement?.progress || 0;
            }

            return {
                id: achievement.id,
                slug: achievement.slug,
                name: achievement.name,
                description: achievement.description,
                icon: achievement.icon,
                points: achievement.points,
                requirement: achievement.requirement,
                threshold: achievement.threshold,
                progress: Math.min(currentProgress, achievement.threshold),
                unlockedAt: userAchievement?.unlockedAt || null,
            };
        });

        // Calculate total stats
        const unlockedAchievements = achievementsWithProgress.filter((a) => a.unlockedAt);
        const totalPoints = unlockedAchievements.reduce((sum, a) => sum + a.points, 0);

        return NextResponse.json({
            success: true,
            data: {
                achievements: achievementsWithProgress,
                stats: {
                    total: allAchievements.length,
                    unlocked: unlockedAchievements.length,
                    points: totalPoints,
                },
                readingStats: stats,
            },
        });
    } catch (error) {
        console.error("Error fetching achievements:", error);
        return NextResponse.json(
            { error: "Failed to fetch achievements" },
            { status: 500 }
        );
    }
}

// POST /api/achievements/check?userId=xxx
// Check and unlock achievements for user
export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        const newlyUnlocked = await checkAndUnlockAchievements(userId);

        return NextResponse.json({
            success: true,
            data: {
                newlyUnlocked,
                count: newlyUnlocked.length,
            },
        });
    } catch (error) {
        console.error("Error checking achievements:", error);
        return NextResponse.json(
            { error: "Failed to check achievements" },
            { status: 500 }
        );
    }
}
