import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

// ==================== NOVEL SERVICES ====================

export async function getNovelBySlug(slug: string) {
    return prisma.novel.findUnique({
        where: { slug },
        include: {
            genres: { include: { genre: true } },
            tags: { include: { tag: true } },
            chapters: {
                orderBy: { chapterNumber: "asc" },
                select: { id: true, chapterNumber: true, title: true, wordCount: true, publishedAt: true },
            },
        },
    });
}

export async function getNovels(options: {
    page?: number;
    limit?: number;
    status?: string;
    genre?: string;
    orderBy?: "latest" | "popular" | "rating" | "chapters";
    search?: string;
}) {
    const { page = 1, limit = 20, status, genre, orderBy = "latest", search } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.NovelWhereInput = {};

    if (status) {
        where.status = status as Prisma.EnumNovelStatusFilter["equals"];
    }

    if (genre) {
        where.genres = { some: { genre: { slug: genre } } };
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { author: { contains: search, mode: "insensitive" } },
        ];
    }

    const orderByMap: Record<string, Prisma.NovelOrderByWithRelationInput> = {
        latest: { lastChapterAt: "desc" },
        popular: { totalViews: "desc" },
        rating: { averageRating: "desc" },
        chapters: { totalChapters: "desc" },
    };

    const orderByClause = orderByMap[orderBy] || { createdAt: "desc" };

    const [novels, total] = await Promise.all([
        prisma.novel.findMany({
            where,
            skip,
            take: limit,
            orderBy: orderByClause,
            include: {
                genres: { include: { genre: true } },
            },
        }),
        prisma.novel.count({ where }),
    ]);

    return {
        novels,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}

export async function getTrendingNovels(limit = 10) {
    return prisma.novel.findMany({
        take: limit,
        orderBy: { totalViews: "desc" },
        include: {
            genres: { include: { genre: true } },
        },
    });
}

export async function getRecentlyUpdatedNovels(limit = 10) {
    return prisma.novel.findMany({
        take: limit,
        orderBy: { lastChapterAt: "desc" },
        include: {
            genres: { include: { genre: true } },
        },
    });
}

export async function incrementNovelViews(novelId: string) {
    return prisma.novel.update({
        where: { id: novelId },
        data: { totalViews: { increment: 1 } },
    });
}

// ==================== CHAPTER SERVICES ====================

export async function getChapter(novelId: string, chapterNumber: number) {
    return prisma.chapter.findUnique({
        where: { novelId_chapterNumber: { novelId, chapterNumber } },
        include: {
            novel: {
                select: { id: true, slug: true, title: true, totalChapters: true },
            },
        },
    });
}

export async function getChapterById(chapterId: string) {
    return prisma.chapter.findUnique({
        where: { id: chapterId },
        include: {
            novel: {
                select: { id: true, slug: true, title: true, totalChapters: true },
            },
        },
    });
}

export async function incrementChapterViews(chapterId: string) {
    return prisma.chapter.update({
        where: { id: chapterId },
        data: { views: { increment: 1 } },
    });
}

// ==================== USER SERVICES ====================

export async function getUserById(userId: string) {
    return prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            bio: true,
            theme: true,
            fontSize: true,
            lineHeight: true,
            fontFamily: true,
            createdAt: true,
        },
    });
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
    });
}

export async function createUser(data: {
    email: string;
    username: string;
    displayName?: string;
    passwordHash?: string;
    googleId?: string;
    githubId?: string;
}) {
    return prisma.user.create({ data });
}

export async function updateUserSettings(
    userId: string,
    data: {
        theme?: string;
        fontSize?: number;
        lineHeight?: number;
        fontFamily?: string;
    }
) {
    return prisma.user.update({
        where: { id: userId },
        data,
    });
}

// ==================== FAVORITES SERVICES ====================

export async function getUserFavorites(userId: string) {
    return prisma.favorite.findMany({
        where: { userId },
        include: {
            novel: {
                include: {
                    genres: { include: { genre: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function toggleFavorite(userId: string, novelId: string) {
    const existing = await prisma.favorite.findUnique({
        where: { userId_novelId: { userId, novelId } },
    });

    if (existing) {
        await prisma.favorite.delete({
            where: { id: existing.id },
        });
        await prisma.novel.update({
            where: { id: novelId },
            data: { totalFavorites: { decrement: 1 } },
        });
        return { action: "removed" as const };
    } else {
        await prisma.favorite.create({
            data: { userId, novelId },
        });
        await prisma.novel.update({
            where: { id: novelId },
            data: { totalFavorites: { increment: 1 } },
        });
        return { action: "added" as const };
    }
}

export async function isFavorite(userId: string, novelId: string) {
    const favorite = await prisma.favorite.findUnique({
        where: { userId_novelId: { userId, novelId } },
    });
    return !!favorite;
}

// ==================== READING PROGRESS SERVICES ====================

export async function getReadingProgress(userId: string, novelId: string) {
    return prisma.readingProgress.findUnique({
        where: { userId_novelId: { userId, novelId } },
        include: {
            chapter: {
                select: { id: true, chapterNumber: true, title: true },
            },
        },
    });
}

export async function getUserReadingHistory(userId: string, limit = 10) {
    return prisma.readingProgress.findMany({
        where: { userId },
        include: {
            novel: {
                include: {
                    genres: { include: { genre: true } },
                },
            },
            chapter: {
                select: { id: true, chapterNumber: true, title: true },
            },
        },
        orderBy: { lastReadAt: "desc" },
        take: limit,
    });
}

export async function updateReadingProgress(
    userId: string,
    novelId: string,
    chapterId: string,
    data: {
        chapterNumber: number;
        scrollPosition?: number;
        progress?: number;
    }
) {
    return prisma.readingProgress.upsert({
        where: { userId_novelId: { userId, novelId } },
        update: {
            chapterId,
            chapterNumber: data.chapterNumber,
            scrollPosition: data.scrollPosition,
            progress: data.progress,
        },
        create: {
            userId,
            novelId,
            chapterId,
            chapterNumber: data.chapterNumber,
            scrollPosition: data.scrollPosition || 0,
            progress: data.progress || 0,
        },
    });
}

// ==================== BOOKMARK SERVICES ====================

export async function getUserBookmarks(userId: string, novelId?: string) {
    const where: Prisma.BookmarkWhereInput = { userId };
    if (novelId) where.novelId = novelId;

    return prisma.bookmark.findMany({
        where,
        include: {
            novel: { select: { id: true, slug: true, title: true } },
            chapter: { select: { id: true, chapterNumber: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function createBookmark(
    userId: string,
    novelId: string,
    chapterId: string,
    data: { title?: string; note?: string; position?: number }
) {
    return prisma.bookmark.create({
        data: {
            userId,
            novelId,
            chapterId,
            ...data,
        },
    });
}

export async function deleteBookmark(bookmarkId: string, userId: string) {
    return prisma.bookmark.deleteMany({
        where: { id: bookmarkId, userId },
    });
}

// ==================== RATING SERVICES ====================

export async function getNovelRating(novelId: string) {
    const result = await prisma.rating.aggregate({
        where: { novelId },
        _avg: { score: true },
        _count: { score: true },
    });
    return {
        average: result._avg.score || 0,
        count: result._count.score,
    };
}

export async function getUserRating(userId: string, novelId: string) {
    return prisma.rating.findUnique({
        where: { userId_novelId: { userId, novelId } },
    });
}

export async function rateNovel(userId: string, novelId: string, score: number) {
    const rating = await prisma.rating.upsert({
        where: { userId_novelId: { userId, novelId } },
        update: { score },
        create: { userId, novelId, score },
    });

    // Update novel's average rating
    const { average, count } = await getNovelRating(novelId);
    await prisma.novel.update({
        where: { id: novelId },
        data: { averageRating: average, totalRatings: count },
    });

    return rating;
}

// ==================== REVIEW SERVICES ====================

export async function getNovelReviews(novelId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            where: { novelId, isApproved: true },
            include: {
                user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.review.count({ where: { novelId, isApproved: true } }),
    ]);

    return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createReview(
    userId: string,
    novelId: string,
    data: { title: string; content: string; isSpoiler?: boolean }
) {
    const review = await prisma.review.create({
        data: { userId, novelId, ...data },
    });

    await prisma.novel.update({
        where: { id: novelId },
        data: { totalReviews: { increment: 1 } },
    });

    return review;
}

// ==================== COMMENT SERVICES ====================

export async function getChapterComments(chapterId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
        prisma.comment.findMany({
            where: { chapterId, isApproved: true, parentId: null },
            include: {
                user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
                replies: {
                    include: {
                        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
                    },
                    orderBy: { createdAt: "asc" },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.comment.count({ where: { chapterId, isApproved: true, parentId: null } }),
    ]);

    return { comments, total, page, limit, totalPages: Math.ceil(total / limit) };
}

export async function createComment(
    userId: string,
    chapterId: string,
    content: string,
    parentId?: string
) {
    return prisma.comment.create({
        data: { userId, chapterId, content, parentId },
    });
}

// ==================== READING LIST SERVICES ====================

export async function getUserReadingLists(userId: string) {
    return prisma.readingList.findMany({
        where: { userId },
        include: {
            items: {
                include: { novel: true },
                orderBy: { order: "asc" },
            },
            _count: { select: { items: true } },
        },
        orderBy: { updatedAt: "desc" },
    });
}

export async function createReadingList(userId: string, data: { name: string; description?: string; isPublic?: boolean }) {
    return prisma.readingList.create({
        data: { userId, ...data },
    });
}

export async function addToReadingList(readingListId: string, novelId: string, note?: string) {
    const maxOrder = await prisma.readingListItem.aggregate({
        where: { readingListId },
        _max: { order: true },
    });

    return prisma.readingListItem.create({
        data: {
            readingListId,
            novelId,
            note,
            order: (maxOrder._max.order || 0) + 1,
        },
    });
}

export async function removeFromReadingList(readingListId: string, novelId: string) {
    return prisma.readingListItem.deleteMany({
        where: { readingListId, novelId },
    });
}

// ==================== NOTIFICATION SERVICES ====================

export async function getUserNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.notification.count({ where: { userId } }),
        prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return { notifications, total, unreadCount, page, limit };
}

export async function markNotificationsRead(userId: string, notificationIds?: string[]) {
    const where: Prisma.NotificationWhereInput = { userId };
    if (notificationIds) where.id = { in: notificationIds };

    return prisma.notification.updateMany({
        where,
        data: { isRead: true },
    });
}

// ==================== GENRE SERVICES ====================

export async function getAllGenres() {
    return prisma.genre.findMany({
        include: {
            _count: { select: { novels: true } },
        },
        orderBy: { name: "asc" },
    });
}

// ==================== READING SESSION SERVICES ====================

export async function startReadingSession(
    userId: string,
    novelId: string,
    chapterId: string,
    deviceInfo?: { device?: string; browser?: string }
) {
    return prisma.readingSession.create({
        data: {
            userId,
            novelId,
            chapterId,
            device: deviceInfo?.device,
            browser: deviceInfo?.browser,
        },
    });
}

export async function endReadingSession(sessionId: string, wordsRead: number) {
    const session = await prisma.readingSession.findUnique({
        where: { id: sessionId },
    });

    if (!session) return null;

    const duration = Math.floor((Date.now() - session.startedAt.getTime()) / 1000);

    return prisma.readingSession.update({
        where: { id: sessionId },
        data: {
            endedAt: new Date(),
            duration,
            wordsRead,
        },
    });
}

export async function getUserReadingStats(userId: string) {
    const sessions = await prisma.readingSession.aggregate({
        where: { userId },
        _sum: { duration: true, wordsRead: true },
        _count: true,
    });

    const completedNovels = await prisma.readingProgress.count({
        where: { userId, completedAt: { not: null } },
    });

    const favoriteCount = await prisma.favorite.count({
        where: { userId },
    });

    return {
        totalReadingTime: sessions._sum.duration || 0,
        totalWordsRead: sessions._sum.wordsRead || 0,
        totalSessions: sessions._count,
        completedNovels,
        favoriteCount,
    };
}

// ==================== ACHIEVEMENT SERVICES ====================

export async function getUserAchievements(userId: string) {
    return prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
        orderBy: { unlockedAt: "desc" },
    });
}

export async function checkAndUnlockAchievements(userId: string) {
    const stats = await getUserReadingStats(userId);
    const achievements = await prisma.achievement.findMany();
    const userAchievements = await prisma.userAchievement.findMany({
        where: { userId },
    });

    const unlockedIds = new Set(
        userAchievements
            .filter((ua: { unlockedAt: Date | null }) => ua.unlockedAt)
            .map((ua: { achievementId: string }) => ua.achievementId)
    );

    const newlyUnlocked: string[] = [];

    for (const achievement of achievements) {
        if (unlockedIds.has(achievement.id)) continue;

        let currentProgress = 0;

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
        }

        if (currentProgress >= achievement.threshold) {
            await prisma.userAchievement.upsert({
                where: { userId_achievementId: { userId, achievementId: achievement.id } },
                update: { progress: currentProgress, unlockedAt: new Date() },
                create: {
                    userId,
                    achievementId: achievement.id,
                    progress: currentProgress,
                    unlockedAt: new Date(),
                },
            });
            newlyUnlocked.push(achievement.id);
        }
    }

    return newlyUnlocked;
}

// ==================== PLATFORM STATS ====================

export async function getPlatformStats() {
    const [
        totalNovels,
        totalChapters,
        totalUsers,
        totalRatings,
        totalReviews,
        totalFavorites,
    ] = await Promise.all([
        prisma.novel.count(),
        prisma.chapter.count(),
        prisma.user.count(),
        prisma.rating.count(),
        prisma.review.count(),
        prisma.favorite.count(),
    ]);

    return {
        totalNovels,
        totalChapters,
        totalUsers,
        totalRatings,
        totalReviews,
        totalFavorites,
    };
}
