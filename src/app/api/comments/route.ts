import { NextRequest, NextResponse } from "next/server";
import { getChapterComments, createComment } from "@/lib/db";

// GET /api/comments?chapterId=xxx&page=1&limit=20
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const chapterId = searchParams.get("chapterId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        if (!chapterId) {
            return NextResponse.json(
                { error: "chapterId is required" },
                { status: 400 }
            );
        }

        const result = await getChapterComments(chapterId, page, limit);

        return NextResponse.json({
            success: true,
            data: result.comments,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: Math.ceil(result.total / result.limit),
            },
        });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: "Failed to fetch comments" },
            { status: 500 }
        );
    }
}

// POST /api/comments
// Body: { userId: string, chapterId: string, content: string, parentId?: string }
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, chapterId, content, parentId } = body;

        if (!userId || !chapterId || !content) {
            return NextResponse.json(
                { error: "userId, chapterId, and content are required" },
                { status: 400 }
            );
        }

        if (content.length < 1 || content.length > 2000) {
            return NextResponse.json(
                { error: "Comment must be between 1 and 2000 characters" },
                { status: 400 }
            );
        }

        const comment = await createComment(userId, chapterId, content, parentId);

        return NextResponse.json({
            success: true,
            data: comment,
        });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
        );
    }
}
