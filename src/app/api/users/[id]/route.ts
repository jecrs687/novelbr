import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/[id]
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                username: true,
                displayName: true,
                avatarUrl: true,
                bio: true,
                theme: true,
                fontSize: true,
                lineHeight: true,
                createdAt: true,
                _count: {
                    select: {
                        favorites: true,
                        reviews: true,
                        ratings: true,
                        readingLists: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Failed to fetch user" },
            { status: 500 }
        );
    }
}

// PUT /api/users/[id]
// Body: { displayName?, bio?, avatarUrl?, theme?, fontSize?, lineHeight? }
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const { displayName, bio, avatarUrl, theme, fontSize, lineHeight } = body;

        const user = await prisma.user.update({
            where: { id },
            data: {
                ...(displayName !== undefined && { displayName }),
                ...(bio !== undefined && { bio }),
                ...(avatarUrl !== undefined && { avatarUrl }),
                ...(theme !== undefined && { theme }),
                ...(fontSize !== undefined && { fontSize }),
                ...(lineHeight !== undefined && { lineHeight }),
            },
            select: {
                id: true,
                email: true,
                username: true,
                displayName: true,
                avatarUrl: true,
                bio: true,
                theme: true,
                fontSize: true,
                lineHeight: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Failed to update user" },
            { status: 500 }
        );
    }
}
