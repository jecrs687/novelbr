import { NextResponse } from "next/server";
import { getTrendingNovels, getRecentlyUpdatedNovels } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "trending";
    const limit = parseInt(searchParams.get("limit") || "10");

    try {
        const novels = type === "recent"
            ? await getRecentlyUpdatedNovels(limit)
            : await getTrendingNovels(limit);

        return NextResponse.json(novels);
    } catch (error) {
        console.error("Error fetching featured novels:", error);
        return NextResponse.json({ error: "Failed to fetch novels" }, { status: 500 });
    }
}
