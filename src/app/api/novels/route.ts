import { NextResponse } from "next/server";
import { getNovels } from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || undefined;
    const genre = searchParams.get("genre") || undefined;
    const orderBy = (searchParams.get("orderBy") || "latest") as "latest" | "popular" | "rating" | "chapters";
    const search = searchParams.get("search") || undefined;

    try {
        const result = await getNovels({ page, limit, status, genre, orderBy, search });
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching novels:", error);
        return NextResponse.json({ error: "Failed to fetch novels" }, { status: 500 });
    }
}
