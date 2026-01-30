import { NextRequest, NextResponse } from "next/server";
import { getUserBookmarks, createBookmark, deleteBookmark } from "@/lib/db";

// GET /api/bookmarks?userId=xxx
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

        const bookmarks = await getUserBookmarks(userId);

        return NextResponse.json({
            success: true,
            data: bookmarks,
            count: bookmarks.length,
        });
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return NextResponse.json(
            { error: "Failed to fetch bookmarks" },
            { status: 500 }
        );
    }
}

// POST /api/bookmarks
// Body: { userId: string, novelId: string, chapterId: string, title?: string, note?: string, position?: number }
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, novelId, chapterId, title, note, position } = body;

        if (!userId || !novelId || !chapterId) {
            return NextResponse.json(
                { error: "userId, novelId, and chapterId are required" },
                { status: 400 }
            );
        }

        const bookmark = await createBookmark(userId, novelId, chapterId, { title, note, position });

        return NextResponse.json({
            success: true,
            data: bookmark,
        });
    } catch (error) {
        console.error("Error creating bookmark:", error);
        return NextResponse.json(
            { error: "Failed to create bookmark" },
            { status: 500 }
        );
    }
}

// DELETE /api/bookmarks?id=xxx&userId=xxx
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const bookmarkId = searchParams.get("id");
        const userId = searchParams.get("userId");

        if (!bookmarkId || !userId) {
            return NextResponse.json(
                { error: "bookmark id and userId are required" },
                { status: 400 }
            );
        }

        await deleteBookmark(bookmarkId, userId);

        return NextResponse.json({
            success: true,
            message: "Bookmark deleted",
        });
    } catch (error) {
        console.error("Error deleting bookmark:", error);
        return NextResponse.json(
            { error: "Failed to delete bookmark" },
            { status: 500 }
        );
    }
}
