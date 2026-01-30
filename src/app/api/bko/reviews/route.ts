import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const approved = searchParams.get('approved');
        const spoiler = searchParams.get('spoiler');
        const novelId = searchParams.get('novelId');

        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        if (approved === 'true') {
            where.isApproved = true;
        } else if (approved === 'false') {
            where.isApproved = false;
        }

        if (spoiler === 'true') {
            where.isSpoiler = true;
        } else if (spoiler === 'false') {
            where.isSpoiler = false;
        }

        if (novelId) {
            where.novelId = novelId;
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
                    novel: { select: { id: true, title: true, slug: true, coverImage: true } },
                },
            }),
            prisma.review.count({ where }),
        ]);

        return NextResponse.json({
            reviews,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json({ error: 'Error fetching reviews' }, { status: 500 });
    }
}
