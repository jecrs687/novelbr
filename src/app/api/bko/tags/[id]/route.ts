import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        const tag = await prisma.tag.findUnique({
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

        if (!tag) {
            return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
        }

        return NextResponse.json(tag);
    } catch (error) {
        console.error('Error fetching tag:', error);
        return NextResponse.json({ error: 'Error fetching tag' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await req.json();

        const tag = await prisma.tag.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
            },
        });

        return NextResponse.json(tag);
    } catch (error) {
        console.error('Error updating tag:', error);
        return NextResponse.json({ error: 'Error updating tag' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        // First delete all novel-tag associations
        await prisma.novelTag.deleteMany({
            where: { tagId: id },
        });

        await prisma.tag.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting tag:', error);
        return NextResponse.json({ error: 'Error deleting tag' }, { status: 500 });
    }
}
