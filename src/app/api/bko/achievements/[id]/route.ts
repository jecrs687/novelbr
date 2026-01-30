import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        const achievement = await prisma.achievement.findUnique({
            where: { id },
            include: {
                users: {
                    include: {
                        user: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
                    },
                    take: 50,
                    orderBy: { unlockedAt: 'desc' },
                },
                _count: {
                    select: { users: true },
                },
            },
        });

        if (!achievement) {
            return NextResponse.json({ error: 'Achievement not found' }, { status: 404 });
        }

        return NextResponse.json(achievement);
    } catch (error) {
        console.error('Error fetching achievement:', error);
        return NextResponse.json({ error: 'Error fetching achievement' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await req.json();

        const achievement = await prisma.achievement.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                icon: data.icon,
                points: data.points ? parseInt(data.points) : undefined,
                requirement: data.requirement,
                threshold: data.threshold ? parseInt(data.threshold) : undefined,
            },
        });

        return NextResponse.json(achievement);
    } catch (error) {
        console.error('Error updating achievement:', error);
        return NextResponse.json({ error: 'Error updating achievement' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        // First delete all user-achievement associations
        await prisma.userAchievement.deleteMany({
            where: { achievementId: id },
        });

        await prisma.achievement.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting achievement:', error);
        return NextResponse.json({ error: 'Error deleting achievement' }, { status: 500 });
    }
}
