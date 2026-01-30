import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/search?q=xxx&type=novels&page=1&limit=20
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");
        const type = searchParams.get("type") || "novels";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        if (!query || query.length < 2) {
            return NextResponse.json(
                { error: "Search query must be at least 2 characters" },
                { status: 400 }
            );
        }

        const skip = (page - 1) * limit;

        switch (type) {
            case "novels": {
                const [novels, total] = await Promise.all([
                    prisma.novel.findMany({
                        where: {
                            OR: [
                                { title: { contains: query, mode: "insensitive" } },
                                { description: { contains: query, mode: "insensitive" } },
                                { author: { contains: query, mode: "insensitive" } },
                            ],
                        },
                        include: {
                            genres: { include: { genre: true } },
                        },
                        skip,
                        take: limit,
                        orderBy: { totalViews: "desc" },
                    }),
                    prisma.novel.count({
                        where: {
                            OR: [
                                { title: { contains: query, mode: "insensitive" } },
                                { description: { contains: query, mode: "insensitive" } },
                                { author: { contains: query, mode: "insensitive" } },
                            ],
                        },
                    }),
                ]);

                return NextResponse.json({
                    success: true,
                    data: novels,
                    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
                });
            }

            case "genres": {
                const genres = await prisma.genre.findMany({
                    where: {
                        OR: [
                            { name: { contains: query, mode: "insensitive" } },
                            { description: { contains: query, mode: "insensitive" } },
                        ],
                    },
                    include: {
                        _count: { select: { novels: true } },
                    },
                });

                return NextResponse.json({
                    success: true,
                    data: genres,
                });
            }

            case "all": {
                const [novels, genres] = await Promise.all([
                    prisma.novel.findMany({
                        where: {
                            OR: [
                                { title: { contains: query, mode: "insensitive" } },
                                { author: { contains: query, mode: "insensitive" } },
                            ],
                        },
                        take: 5,
                        orderBy: { totalViews: "desc" },
                    }),
                    prisma.genre.findMany({
                        where: {
                            name: { contains: query, mode: "insensitive" },
                        },
                        take: 5,
                    }),
                ]);

                return NextResponse.json({
                    success: true,
                    data: { novels, genres },
                });
            }

            default:
                return NextResponse.json(
                    { error: "Invalid search type. Use 'novels', 'genres', or 'all'" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("Error searching:", error);
        return NextResponse.json(
            { error: "Failed to search" },
            { status: 500 }
        );
    }
}
