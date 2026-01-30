import { NextRequest, NextResponse } from "next/server";
import { startReadingSession, endReadingSession, getUserReadingStats } from "@/lib/db";

// GET /api/reading-sessions/stats?userId=xxx
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

        const stats = await getUserReadingStats(userId);

        return NextResponse.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("Error fetching reading stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch reading stats" },
            { status: 500 }
        );
    }
}

// POST /api/reading-sessions
// Body: { userId: string, novelId: string, chapterId: string }
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, novelId, chapterId } = body;

        if (!userId || !novelId || !chapterId) {
            return NextResponse.json(
                { error: "userId, novelId, and chapterId are required" },
                { status: 400 }
            );
        }

        const session = await startReadingSession(userId, novelId, chapterId);

        return NextResponse.json({
            success: true,
            data: session,
        });
    } catch (error) {
        console.error("Error starting reading session:", error);
        return NextResponse.json(
            { error: "Failed to start reading session" },
            { status: 500 }
        );
    }
}

// PUT /api/reading-sessions
// Body: { sessionId: string, wordsRead: number }
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionId, wordsRead } = body;

        if (!sessionId) {
            return NextResponse.json(
                { error: "sessionId is required" },
                { status: 400 }
            );
        }

        const session = await endReadingSession(sessionId, wordsRead || 0);

        return NextResponse.json({
            success: true,
            data: session,
        });
    } catch (error) {
        console.error("Error ending reading session:", error);
        return NextResponse.json(
            { error: "Failed to end reading session" },
            { status: 500 }
        );
    }
}
