import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        const chapter = await prisma.chapter.findUnique({
            where: { id },
            include: {
                novel: { select: { id: true, title: true, slug: true } },
                comments: {
                    take: 20,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: { select: { id: true, username: true, displayName: true } },
                    },
                },
                _count: {
                    select: {
                        comments: true,
                        bookmarks: true,
                        readingProgress: true,
                    },
                },
            },
        });

        if (!chapter) {
            return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
        }

        return NextResponse.json(chapter);
    } catch (error) {
        console.error('Error fetching chapter:', error);
        return NextResponse.json({ error: 'Error fetching chapter' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await req.json();

        const content = data.content || '';
        const wordCount = content.split(/\s+/).filter((word: string) => word.length > 0).length;

        const chapter = await prisma.chapter.update({
            where: { id },
            data: {
                title: data.title,
                content: content,
                wordCount: wordCount,
                isPublished: data.isPublished,
                isPremium: data.isPremium,
                publishedAt: data.isPublished && !data.publishedAt ? new Date() : data.publishedAt,
            },
            include: {
                novel: { select: { id: true, title: true, slug: true } },
            },
        });

        return NextResponse.json(chapter);
    } catch (error) {
        console.error('Error updating chapter:', error);
        return NextResponse.json({ error: 'Error updating chapter' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        const chapter = await prisma.chapter.findUnique({
            where: { id },
            select: { novelId: true },
        });

        if (!chapter) {
            return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
        }

        await prisma.chapter.delete({
            where: { id },
        });

        // Update novel's chapter count
        await prisma.novel.update({
            where: { id: chapter.novelId },
            data: {
                totalChapters: { decrement: 1 },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting chapter:', error);
        return NextResponse.json({ error: 'Error deleting chapter' }, { status: 500 });
    }
}
