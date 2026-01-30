import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const search = searchParams.get('search') || '';
        const role = searchParams.get('role');

        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { username: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { displayName: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role) {
            where.role = role;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    displayName: true,
                    avatarUrl: true,
                    createdAt: true,
                    lastLoginAt: true,
                    _count: {
                        select: {
                            favorites: true,
                            reviews: true,
                            comments: true,
                        },
                    },
                },
            }),
            prisma.user.count({ where }),
        ]);

        return NextResponse.json({
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // Validate required fields
        if (!data.username || !data.email || !data.password) {
            return NextResponse.json(
                { error: 'Username, email e senha são obrigatórios' },
                { status: 400 }
            );
        }

        // Check if username or email already exists
        const existing = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: data.username },
                    { email: data.email },
                ],
            },
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Username ou email já existe' },
                { status: 400 }
            );
        }

        // In a real app, you'd hash the password here
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                passwordHash: data.password, // Should be hashed!
                displayName: data.displayName || null,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
    }
}
