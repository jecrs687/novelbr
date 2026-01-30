import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '30');
        const approved = searchParams.get('approved');
        const chapterId = searchParams.get('chapterId');

        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        if (approved === 'true') {
            where.isApproved = true;
        } else if (approved === 'false') {
            where.isApproved = false;
        }

        if (chapterId) {
            where.chapterId = chapterId;
        }

        const [comments, total] = await Promise.all([
            prisma.comment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
                    chapter: {
                        select: {
                            id: true,
                            title: true,
                            chapterNumber: true,
                            novel: { select: { id: true, title: true, slug: true } },
                        }
                    },
                },
            }),
            prisma.comment.count({ where }),
        ]);

        return NextResponse.json({
            comments,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Error fetching comments' }, { status: 500 });
    }
}
