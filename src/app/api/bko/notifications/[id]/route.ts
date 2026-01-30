import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

interface Params {
    params: Promise<{ id: string }>;
}

export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const { id } = await params;

        await prisma.notification.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting notification:', error);
        return NextResponse.json({ error: 'Error deleting notification' }, { status: 500 });
    }
}
