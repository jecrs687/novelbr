import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        const genre = await prisma.genre.findUnique({
            where: { id },
            include: {
                novels: {
                    include: {
                        novel: { select: { id: true, title: true, slug: true, coverImage: true } },
                    },
                    take: 20,
                },
                _count: {
                    select: { novels: true },
                },
            },
        });

        if (!genre) {
            return NextResponse.json({ error: 'Genre not found' }, { status: 404 });
        }

        return NextResponse.json(genre);
    } catch (error) {
        console.error('Error fetching genre:', error);
        return NextResponse.json({ error: 'Error fetching genre' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await req.json();

        const genre = await prisma.genre.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                icon: data.icon,
                color: data.color,
            },
        });

        return NextResponse.json(genre);
    } catch (error) {
        console.error('Error updating genre:', error);
        return NextResponse.json({ error: 'Error updating genre' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        // First delete all novel-genre associations
        await prisma.novelGenre.deleteMany({
            where: { genreId: id },
        });

        await prisma.genre.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting genre:', error);
        return NextResponse.json({ error: 'Error deleting genre' }, { status: 500 });
    }
}
