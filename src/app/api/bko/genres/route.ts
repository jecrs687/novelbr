import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const genres = await prisma.genre.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { novels: true },
                },
            },
        });

        return NextResponse.json(genres);
    } catch (error) {
        console.error('Error fetching genres:', error);
        return NextResponse.json({ error: 'Error fetching genres' }, { status: 500 });
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
        const existing = await prisma.genre.findUnique({
            where: { slug: data.slug },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Slug já existe' },
                { status: 400 }
            );
        }

        const genre = await prisma.genre.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description || null,
                icon: data.icon || null,
                color: data.color || null,
            },
        });

        return NextResponse.json(genre, { status: 201 });
    } catch (error) {
        console.error('Error creating genre:', error);
        return NextResponse.json({ error: 'Error creating genre' }, { status: 500 });
    }
}
