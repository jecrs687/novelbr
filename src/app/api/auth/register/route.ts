import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/db";
import bcrypt from "bcryptjs";

// POST /api/auth/register
// Body: { email: string, username: string, password: string, displayName?: string }
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, username, password, displayName } = body;

        // Validate required fields
        if (!email || !username || !password) {
            return NextResponse.json(
                { error: "Email, username e senha são obrigatórios" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Email inválido" },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 6) {
            return NextResponse.json(
                { error: "A senha deve ter pelo menos 6 caracteres" },
                { status: 400 }
            );
        }

        // Validate username
        if (username.length < 3 || username.length > 30) {
            return NextResponse.json(
                { error: "O nome de usuário deve ter entre 3 e 30 caracteres" },
                { status: 400 }
            );
        }

        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            return NextResponse.json(
                { error: "O nome de usuário só pode conter letras, números e underscores" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { error: "Este email já está cadastrado" },
                { status: 409 }
            );
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create user
        const user = await createUser({
            email,
            username,
            displayName: displayName || username,
            passwordHash,
        });

        // Return user without sensitive data
        return NextResponse.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Error registering user:", error);

        // Handle unique constraint errors
        if (error instanceof Error && error.message.includes("Unique constraint")) {
            if (error.message.includes("email")) {
                return NextResponse.json(
                    { error: "Este email já está cadastrado" },
                    { status: 409 }
                );
            }
            if (error.message.includes("username")) {
                return NextResponse.json(
                    { error: "Este nome de usuário já está em uso" },
                    { status: 409 }
                );
            }
        }

        return NextResponse.json(
            { error: "Erro ao criar conta. Tente novamente." },
            { status: 500 }
        );
    }
}
