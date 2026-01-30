import { NextRequest, NextResponse } from "next/server";
import { getUserNotifications, markNotificationsRead } from "@/lib/db";

// GET /api/notifications?userId=xxx&page=1&limit=20
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        const result = await getUserNotifications(userId, page, limit);

        return NextResponse.json({
            success: true,
            data: result.notifications,
            unreadCount: result.unreadCount,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
            },
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Failed to fetch notifications" },
            { status: 500 }
        );
    }
}

// PUT /api/notifications?userId=xxx&ids=xxx,xxx,xxx (optional ids, if not provided marks all as read)
export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const idsParam = searchParams.get("ids");

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        const notificationIds = idsParam ? idsParam.split(",") : undefined;
        const result = await markNotificationsRead(userId, notificationIds);

        return NextResponse.json({
            success: true,
            message: `Marked ${result.count} notifications as read`,
        });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return NextResponse.json(
            { error: "Failed to mark notifications as read" },
            { status: 500 }
        );
    }
}
