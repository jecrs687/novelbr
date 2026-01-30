import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
    params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await req.json();

        const review = await prisma.review.update({
            where: { id },
            data: {
                isApproved: data.isApproved,
                isSpoiler: data.isSpoiler,
                title: data.title,
                content: data.content,
            },
        });

        return NextResponse.json(review);
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ error: 'Error updating review' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        const review = await prisma.review.findUnique({
            where: { id },
            select: { novelId: true },
        });

        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        await prisma.review.delete({
            where: { id },
        });

        // Update novel's review count
        await prisma.novel.update({
            where: { id: review.novelId },
            data: {
                totalReviews: { decrement: 1 },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ error: 'Error deleting review' }, { status: 500 });
    }
}
