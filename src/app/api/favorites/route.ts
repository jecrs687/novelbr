import { NextRequest, NextResponse } from "next/server";
import { getUserFavorites, toggleFavorite } from "@/lib/db";

// GET /api/favorites?userId=xxx
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

        const favorites = await getUserFavorites(userId);

        return NextResponse.json({
            success: true,
            data: favorites,
            count: favorites.length,
        });
    } catch (error) {
        console.error("Error fetching favorites:", error);
        return NextResponse.json(
            { error: "Failed to fetch favorites" },
            { status: 500 }
        );
    }
}

// POST /api/favorites
// Body: { userId: string, novelId: string }
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, novelId } = body;

        if (!userId || !novelId) {
            return NextResponse.json(
                { error: "userId and novelId are required" },
                { status: 400 }
            );
        }

        const result = await toggleFavorite(userId, novelId);

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error toggling favorite:", error);
        return NextResponse.json(
            { error: "Failed to toggle favorite" },
            { status: 500 }
        );
    }
}
