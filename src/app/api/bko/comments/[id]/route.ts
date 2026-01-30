import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
    params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;
        const data = await req.json();

        const comment = await prisma.comment.update({
            where: { id },
            data: {
                isApproved: data.isApproved,
                content: data.content,
            },
        });

        return NextResponse.json(comment);
    } catch (error) {
        console.error('Error updating comment:', error);
        return NextResponse.json({ error: 'Error updating comment' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        await prisma.comment.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json({ error: 'Error deleting comment' }, { status: 500 });
    }
}
