import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '30');
        const type = searchParams.get('type');
        const read = searchParams.get('read');
        const userId = searchParams.get('userId');

        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        if (type) {
            where.type = type;
        }

        if (read === 'true') {
            where.isRead = true;
        } else if (read === 'false') {
            where.isRead = false;
        }

        if (userId) {
            where.userId = userId;
        }

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, username: true, displayName: true } },
                },
            }),
            prisma.notification.count({ where }),
        ]);

        return NextResponse.json({
            notifications,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: 'Error fetching notifications' }, { status: 500 });
    }
}
