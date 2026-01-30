import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // Validate required fields
        if (!data.type || !data.title || !data.message) {
            return NextResponse.json(
                { error: 'Tipo, título e mensagem são obrigatórios' },
                { status: 400 }
            );
        }

        let userIds: string[] = [];

        if (data.sendTo === 'all') {
            // Get all users
            const users = await prisma.user.findMany({
                select: { id: true },
            });
            userIds = users.map(u => u.id);
        } else if (data.sendTo === 'specific' && data.userIds?.length > 0) {
            userIds = data.userIds;
        } else {
            return NextResponse.json(
                { error: 'Selecione pelo menos um usuário para enviar a notificação' },
                { status: 400 }
            );
        }

        // Create notifications for all selected users
        const notifications = await prisma.notification.createMany({
            data: userIds.map(userId => ({
                userId,
                type: data.type,
                title: data.title,
                message: data.message,
                link: data.link || null,
            })),
        });

        return NextResponse.json({
            success: true,
            count: notifications.count,
        }, { status: 201 });
    } catch (error) {
        console.error('Error sending notifications:', error);
        return NextResponse.json({ error: 'Error sending notifications' }, { status: 500 });
    }
}
