import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/reviews?novelId=xxx&page=1&limit=10
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const novelId = searchParams.get("novelId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        if (!novelId) {
            return NextResponse.json(
                { error: "novelId is required" },
                { status: 400 }
            );
        }

        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { novelId },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            displayName: true,
                            avatarUrl: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.review.count({ where: { novelId } }),
        ]);

        return NextResponse.json({
            success: true,
            data: reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}

// POST /api/reviews
// Body: { userId: string, novelId: string, title: string, content: string, rating: number }
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, novelId, title, content } = body;

        if (!userId || !novelId || !title || !content) {
            return NextResponse.json(
                { error: "userId, novelId, title, and content are required" },
                { status: 400 }
            );
        }

        // Check if user already has a review for this novel
        const existingReview = await prisma.review.findFirst({
            where: { userId, novelId },
        });

        if (existingReview) {
            return NextResponse.json(
                { error: "You have already reviewed this novel" },
                { status: 400 }
            );
        }

        const review = await prisma.review.create({
            data: {
                userId,
                novelId,
                title,
                content,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        // Update novel review count
        await prisma.novel.update({
            where: { id: novelId },
            data: { totalReviews: { increment: 1 } },
        });

        return NextResponse.json({
            success: true,
            data: review,
        });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json(
            { error: "Failed to create review" },
            { status: 500 }
        );
    }
}

// PUT /api/reviews
// Body: { reviewId: string, userId: string, title?: string, content?: string, rating?: number }
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { reviewId, userId, title, content, rating } = body;

        if (!reviewId || !userId) {
            return NextResponse.json(
                { error: "reviewId and userId are required" },
                { status: 400 }
            );
        }

        // Verify ownership
        const existing = await prisma.review.findFirst({
            where: { id: reviewId, userId },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Review not found or you don't have permission to edit it" },
                { status: 404 }
            );
        }

        const review = await prisma.review.update({
            where: { id: reviewId },
            data: {
                ...(title && { title }),
                ...(content && { content }),
                ...(rating !== undefined && { rating }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            data: review,
        });
    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json(
            { error: "Failed to update review" },
            { status: 500 }
        );
    }
}

// DELETE /api/reviews?id=xxx&userId=xxx
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const reviewId = searchParams.get("id");
        const userId = searchParams.get("userId");

        if (!reviewId || !userId) {
            return NextResponse.json(
                { error: "review id and userId are required" },
                { status: 400 }
            );
        }

        // Verify ownership and get novelId
        const existing = await prisma.review.findFirst({
            where: { id: reviewId, userId },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Review not found or you don't have permission to delete it" },
                { status: 404 }
            );
        }

        await prisma.review.delete({
            where: { id: reviewId },
        });

        // Update novel review count
        await prisma.novel.update({
            where: { id: existing.novelId },
            data: { totalReviews: { decrement: 1 } },
        });

        return NextResponse.json({
            success: true,
            message: "Review deleted",
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        return NextResponse.json(
            { error: "Failed to delete review" },
            { status: 500 }
        );
    }
}
