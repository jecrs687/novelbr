import { NextRequest, NextResponse } from "next/server";
import { getReadingProgress, updateReadingProgress } from "@/lib/db";

// GET /api/progress?userId=xxx&novelId=xxx
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const novelId = searchParams.get("novelId");

        if (!userId || !novelId) {
            return NextResponse.json(
                { error: "userId and novelId are required" },
                { status: 400 }
            );
        }

        const progress = await getReadingProgress(userId, novelId);

        return NextResponse.json({
            success: true,
            data: progress,
        });
    } catch (error) {
        console.error("Error fetching progress:", error);
        return NextResponse.json(
            { error: "Failed to fetch progress" },
            { status: 500 }
        );
    }
}

// POST /api/progress
// Body: { userId: string, novelId: string, chapterId: string, chapterNumber: number, scrollPosition?: number, progress?: number }
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, novelId, chapterId, chapterNumber, scrollPosition, progress } = body;

        if (!userId || !novelId || !chapterId || chapterNumber === undefined) {
            return NextResponse.json(
                { error: "userId, novelId, chapterId, and chapterNumber are required" },
                { status: 400 }
            );
        }

        const result = await updateReadingProgress(userId, novelId, chapterId, {
            chapterNumber,
            scrollPosition,
            progress,
        });

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error updating progress:", error);
        return NextResponse.json(
            { error: "Failed to update progress" },
            { status: 500 }
        );
    }
}
