import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { novels: true },
                },
            },
        });

        return NextResponse.json(tags);
    } catch (error) {
        console.error('Error fetching tags:', error);
        return NextResponse.json({ error: 'Error fetching tags' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // Validate required fields
        if (!data.name || !data.slug) {
            return NextResponse.json(
                { error: 'Nome e slug são obrigatórios' },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const existing = await prisma.tag.findUnique({
            where: { slug: data.slug },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Slug já existe' },
                { status: 400 }
            );
        }

        const tag = await prisma.tag.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description || null,
            },
        });

        return NextResponse.json(tag, { status: 201 });
    } catch (error) {
        console.error('Error creating tag:', error);
        return NextResponse.json({ error: 'Error creating tag' }, { status: 500 });
    }
}
