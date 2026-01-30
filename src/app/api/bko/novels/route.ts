import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status');
        const genreId = searchParams.get('genreId');

        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { originalTitle: { contains: search, mode: 'insensitive' } },
                { author: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (status) {
            where.status = status;
        }

        if (genreId) {
            where.genres = {
                some: { genreId },
            };
        }

        const [novels, total] = await Promise.all([
            prisma.novel.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    genres: {
                        include: { genre: { select: { id: true, name: true, color: true } } },
                    },
                    tags: {
                        include: { tag: { select: { id: true, name: true } } },
                    },
                    _count: {
                        select: {
                            chapters: true,
                            favorites: true,
                            ratings: true,
                            reviews: true,
                        },
                    },
                },
            }),
            prisma.novel.count({ where }),
        ]);

        return NextResponse.json({
            novels,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching novels:', error);
        return NextResponse.json({ error: 'Error fetching novels' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // Validate required fields
        if (!data.title || !data.slug) {
            return NextResponse.json(
                { error: 'Título e slug são obrigatórios' },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const existing = await prisma.novel.findUnique({
            where: { slug: data.slug },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Slug já existe' },
                { status: 400 }
            );
        }

        const novel = await prisma.novel.create({
            data: {
                title: data.title,
                originalTitle: data.originalTitle,
                slug: data.slug,
                description: data.description || '',
                author: data.author,
                artist: data.artist,
                coverImage: data.coverImage,
                status: data.status || 'ONGOING',
                type: data.type || 'WEB_NOVEL',
                releaseYear: data.year ? parseInt(data.year) : null,
                genres: data.genreIds?.length > 0 ? {
                    create: data.genreIds.map((genreId: string) => ({ genreId })),
                } : undefined,
                tags: data.tagIds?.length > 0 ? {
                    create: data.tagIds.map((tagId: string) => ({ tagId })),
                } : undefined,
            },
            include: {
                genres: { include: { genre: true } },
                tags: { include: { tag: true } },
            },
        });

        return NextResponse.json(novel, { status: 201 });
    } catch (error) {
        console.error('Error creating novel:', error);
        return NextResponse.json({ error: 'Error creating novel' }, { status: 500 });
    }
}
