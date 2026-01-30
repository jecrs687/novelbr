import { NextRequest, NextResponse } from "next/server";
import { rateNovel, getUserRating, getNovelRating } from "@/lib/db";

// GET /api/ratings?novelId=xxx&userId=xxx (optional userId)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const novelId = searchParams.get("novelId");
        const userId = searchParams.get("userId");

        if (!novelId) {
            return NextResponse.json(
                { error: "novelId is required" },
                { status: 400 }
            );
        }

        // Get overall rating
        const overall = await getNovelRating(novelId);

        // Get user rating if userId provided
        let userRating = null;
        if (userId) {
            userRating = await getUserRating(userId, novelId);
        }

        return NextResponse.json({
            success: true,
            data: {
                average: overall.average,
                count: overall.count,
                userRating: userRating?.score || null,
            },
        });
    } catch (error) {
        console.error("Error fetching ratings:", error);
        return NextResponse.json(
            { error: "Failed to fetch ratings" },
            { status: 500 }
        );
    }
}

// POST /api/ratings
// Body: { userId: string, novelId: string, score: number (1-5) }
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, novelId, score } = body;

        if (!userId || !novelId || score === undefined) {
            return NextResponse.json(
                { error: "userId, novelId, and score are required" },
                { status: 400 }
            );
        }

        if (score < 1 || score > 5) {
            return NextResponse.json(
                { error: "score must be between 1 and 5" },
                { status: 400 }
            );
        }

        const rating = await rateNovel(userId, novelId, score);

        // Get updated overall rating
        const overall = await getNovelRating(novelId);

        return NextResponse.json({
            success: true,
            data: {
                rating,
                average: overall.average,
                count: overall.count,
            },
        });
    } catch (error) {
        console.error("Error creating rating:", error);
        return NextResponse.json(
            { error: "Failed to create rating" },
            { status: 500 }
        );
    }
}
