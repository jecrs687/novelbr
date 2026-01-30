import { NextRequest, NextResponse } from "next/server";
import { getUserReadingLists, createReadingList, addToReadingList, removeFromReadingList } from "@/lib/db";

// GET /api/reading-lists?userId=xxx
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

        const lists = await getUserReadingLists(userId);

        return NextResponse.json({
            success: true,
            data: lists,
            count: lists.length,
        });
    } catch (error) {
        console.error("Error fetching reading lists:", error);
        return NextResponse.json(
            { error: "Failed to fetch reading lists" },
            { status: 500 }
        );
    }
}

// POST /api/reading-lists
// Body: { userId: string, name: string, description?: string, isPublic?: boolean }
// Or: { userId: string, listId: string, novelId: string } to add novel to list
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, name, description, isPublic, listId, novelId } = body;

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        // Add novel to existing list
        if (listId && novelId) {
            const item = await addToReadingList(listId, novelId);
            return NextResponse.json({
                success: true,
                data: item,
                message: "Novel added to list",
            });
        }

        // Create new list
        if (name) {
            const list = await createReadingList(userId, { name, description, isPublic });
            return NextResponse.json({
                success: true,
                data: list,
                message: "Reading list created",
            });
        }

        return NextResponse.json(
            { error: "Either name (for new list) or listId and novelId (to add) is required" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error creating/updating reading list:", error);
        return NextResponse.json(
            { error: "Failed to process reading list request" },
            { status: 500 }
        );
    }
}

// DELETE /api/reading-lists?listId=xxx&novelId=xxx
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const listId = searchParams.get("listId");
        const novelId = searchParams.get("novelId");

        if (!listId || !novelId) {
            return NextResponse.json(
                { error: "listId and novelId are required" },
                { status: 400 }
            );
        }

        await removeFromReadingList(listId, novelId);

        return NextResponse.json({
            success: true,
            message: "Novel removed from list",
        });
    } catch (error) {
        console.error("Error removing from reading list:", error);
        return NextResponse.json(
            { error: "Failed to remove from reading list" },
            { status: 500 }
        );
    }
}
