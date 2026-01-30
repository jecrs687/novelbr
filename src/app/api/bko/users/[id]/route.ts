import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                favorites: {
                    include: { novel: { select: { id: true, title: true, slug: true } } },
                    take: 10,
                },
                reviews: {
                    include: { novel: { select: { id: true, title: true, slug: true } } },
                    take: 10,
                },
                comments: {
                    include: { chapter: { select: { id: true, title: true } } },
                    take: 10,
                },
                readingProgress: {
                    include: { novel: { select: { id: true, title: true, slug: true } } },
                    take: 10,
                },
                achievements: {
                    include: { achievement: true },
                },
                _count: {
                    select: {
                        favorites: true,
                        reviews: true,
                        comments: true,
                        bookmarks: true,
                        ratings: true,
                        readingSessions: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await req.json();

        const user = await prisma.user.update({
            where: { id },
            data: {
                username: data.username,
                email: data.email,
                displayName: data.displayName,
                bio: data.bio,
                avatarUrl: data.avatarUrl,
                website: data.website,
                location: data.location,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
    }
}
