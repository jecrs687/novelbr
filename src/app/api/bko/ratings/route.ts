import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '30');
        const novelId = searchParams.get('novelId');

        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        if (novelId) {
            where.novelId = novelId;
        }

        const [ratings, total, distribution] = await Promise.all([
            prisma.rating.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
                    novel: { select: { id: true, title: true, slug: true, coverImage: true } },
                },
            }),
            prisma.rating.count({ where }),
            prisma.rating.groupBy({
                by: ['score'],
                _count: true,
                where,
                orderBy: { score: 'asc' },
            }),
        ]);

        // Format distribution as a more usable object
        const ratingDistribution: Record<number, number> = {};
        for (let i = 1; i <= 5; i++) {
            const found = distribution.find(d => d.score === i);
            ratingDistribution[i] = found ? found._count : 0;
        }

        return NextResponse.json({
            ratings,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            distribution: ratingDistribution,
        });
    } catch (error) {
        console.error('Error fetching ratings:', error);
        return NextResponse.json({ error: 'Error fetching ratings' }, { status: 500 });
    }
}
