import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/db";
import bcrypt from "bcryptjs";

// POST /api/auth/login
// Body: { email: string, password: string }
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email e senha são obrigatórios" },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await getUserByEmail(email);
        if (!user) {
            return NextResponse.json(
                { error: "Email ou senha incorretos" },
                { status: 401 }
            );
        }

        // Check if user has password (might be OAuth only)
        if (!user.passwordHash) {
            return NextResponse.json(
                { error: "Esta conta usa login social. Tente entrar com Google ou GitHub." },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Email ou senha incorretos" },
                { status: 401 }
            );
        }

        // Update last login
        // Note: You could add a function to update lastLoginAt in db.ts

        // Return user without sensitive data
        return NextResponse.json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                username: user.username,
                displayName: user.displayName,
                avatarUrl: user.avatarUrl,
                bio: user.bio,
                theme: user.theme,
                fontSize: user.fontSize,
                lineHeight: user.lineHeight,
                fontFamily: user.fontFamily,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json(
            { error: "Erro ao fazer login. Tente novamente." },
            { status: 500 }
        );
    }
}
