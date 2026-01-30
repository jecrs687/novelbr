import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        const novel = await prisma.novel.findUnique({
            where: { id },
            include: {
                genres: { include: { genre: true } },
                tags: { include: { tag: true } },
                chapters: {
                    orderBy: { chapterNumber: 'desc' },
                    take: 10,
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
        });

        if (!novel) {
            return NextResponse.json({ error: 'Novel not found' }, { status: 404 });
        }

        return NextResponse.json(novel);
    } catch (error) {
        console.error('Error fetching novel:', error);
        return NextResponse.json({ error: 'Error fetching novel' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await req.json();

        // Update genres if provided
        if (data.genreIds) {
            await prisma.novelGenre.deleteMany({ where: { novelId: id } });
            if (data.genreIds.length > 0) {
                await prisma.novelGenre.createMany({
                    data: data.genreIds.map((genreId: string) => ({ novelId: id, genreId })),
                });
            }
        }

        // Update tags if provided
        if (data.tagIds) {
            await prisma.novelTag.deleteMany({ where: { novelId: id } });
            if (data.tagIds.length > 0) {
                await prisma.novelTag.createMany({
                    data: data.tagIds.map((tagId: string) => ({ novelId: id, tagId })),
                });
            }
        }

        const novel = await prisma.novel.update({
            where: { id },
            data: {
                title: data.title,
                originalTitle: data.originalTitle,
                slug: data.slug,
                description: data.description,
                author: data.author,
                artist: data.artist,
                coverImage: data.coverImage,
                status: data.status,
                type: data.type,
                releaseYear: data.year ? parseInt(data.year) : null,
            },
            include: {
                genres: { include: { genre: true } },
                tags: { include: { tag: true } },
            },
        });

        return NextResponse.json(novel);
    } catch (error) {
        console.error('Error updating novel:', error);
        return NextResponse.json({ error: 'Error updating novel' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        // Delete related data first
        await prisma.novelGenre.deleteMany({ where: { novelId: id } });
        await prisma.novelTag.deleteMany({ where: { novelId: id } });

        await prisma.novel.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting novel:', error);
        return NextResponse.json({ error: 'Error deleting novel' }, { status: 500 });
    }
}
