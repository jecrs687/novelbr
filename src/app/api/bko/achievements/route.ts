import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const achievements = await prisma.achievement.findMany({
            orderBy: { points: 'desc' },
            include: {
                _count: {
                    select: { users: true },
                },
            },
        });

        return NextResponse.json(achievements);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return NextResponse.json({ error: 'Error fetching achievements' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // Validate required fields
        if (!data.name || !data.slug || !data.requirement) {
            return NextResponse.json(
                { error: 'Nome, slug e requisito são obrigatórios' },
                { status: 400 }
            );
        }

        // Check if slug already exists
        const existing = await prisma.achievement.findUnique({
            where: { slug: data.slug },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Slug já existe' },
                { status: 400 }
            );
        }

        const achievement = await prisma.achievement.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description || '',
                icon: data.icon || null,
                points: parseInt(data.points) || 0,
                requirement: data.requirement,
                threshold: parseInt(data.threshold) || 1,
            },
        });

        return NextResponse.json(achievement, { status: 201 });
    } catch (error) {
        console.error('Error creating achievement:', error);
        return NextResponse.json({ error: 'Error creating achievement' }, { status: 500 });
    }
}
