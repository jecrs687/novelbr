import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const novelId = searchParams.get('novelId');
        const search = searchParams.get('search') || '';

        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        if (novelId) {
            where.novelId = novelId;
        }

        if (search) {
            where.title = { contains: search, mode: 'insensitive' };
        }

        const [chapters, total] = await Promise.all([
            prisma.chapter.findMany({
                where,
                skip,
                take: limit,
                orderBy: [
                    { novelId: 'asc' },
                    { chapterNumber: 'desc' },
                ],
                include: {
                    novel: { select: { id: true, title: true, slug: true } },
                },
            }),
            prisma.chapter.count({ where }),
        ]);

        return NextResponse.json({
            chapters,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching chapters:', error);
        return NextResponse.json({ error: 'Error fetching chapters' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // Validate required fields
        if (!data.novelId || !data.chapterNumber) {
            return NextResponse.json(
                { error: 'Novel ID e número do capítulo são obrigatórios' },
                { status: 400 }
            );
        }

        // Check if chapter number already exists for this novel
        const existing = await prisma.chapter.findUnique({
            where: {
                novelId_chapterNumber: {
                    novelId: data.novelId,
                    chapterNumber: parseInt(data.chapterNumber),
                },
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Este número de capítulo já existe para esta novel' },
                { status: 400 }
            );
        }

        const content = data.content || '';
        const wordCount = content.split(/\s+/).filter((word: string) => word.length > 0).length;

        const chapter = await prisma.chapter.create({
            data: {
                novelId: data.novelId,
                chapterNumber: parseInt(data.chapterNumber),
                title: data.title || null,
                content: content,
                wordCount: wordCount,
                isPublished: data.isPublished ?? true,
                isPremium: data.isPremium ?? false,
                publishedAt: data.isPublished ? new Date() : null,
            },
            include: {
                novel: { select: { id: true, title: true, slug: true } },
            },
        });

        // Update novel's chapter count and lastChapterAt
        await prisma.novel.update({
            where: { id: data.novelId },
            data: {
                totalChapters: { increment: 1 },
                lastChapterAt: new Date(),
            },
        });

        return NextResponse.json(chapter, { status: 201 });
    } catch (error) {
        console.error('Error creating chapter:', error);
        return NextResponse.json({ error: 'Error creating chapter' }, { status: 500 });
    }
}
