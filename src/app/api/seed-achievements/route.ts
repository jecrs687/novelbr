import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { AchievementRequirement } from "@/generated/prisma/client";

// POST /api/seed-achievements
// Seeds default achievements (only for development)
export async function POST() {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
            { error: "Not allowed in production" },
            { status: 403 }
        );
    }

    try {
        const achievements = [
            // Reading achievements
            {
                slug: "primeiro-capitulo",
                name: "Primeiro Capítulo",
                description: "Leia seu primeiro capítulo",
                icon: "book",
                points: 10,
                requirement: AchievementRequirement.CHAPTERS_READ,
                threshold: 1,
            },
            {
                slug: "leitor-iniciante",
                name: "Leitor Iniciante",
                description: "Leia 10 capítulos",
                icon: "book",
                points: 25,
                requirement: AchievementRequirement.CHAPTERS_READ,
                threshold: 10,
            },
            {
                slug: "leitor-casual",
                name: "Leitor Casual",
                description: "Leia 50 capítulos",
                icon: "book",
                points: 50,
                requirement: AchievementRequirement.CHAPTERS_READ,
                threshold: 50,
            },
            {
                slug: "leitor-dedicado",
                name: "Leitor Dedicado",
                description: "Leia 100 capítulos",
                icon: "book",
                points: 100,
                requirement: AchievementRequirement.CHAPTERS_READ,
                threshold: 100,
            },
            {
                slug: "devorador-de-livros",
                name: "Devorador de Livros",
                description: "Leia 500 capítulos",
                icon: "book",
                points: 250,
                requirement: AchievementRequirement.CHAPTERS_READ,
                threshold: 500,
            },
            {
                slug: "mestre-leitor",
                name: "Mestre Leitor",
                description: "Leia 1000 capítulos",
                icon: "trophy",
                points: 500,
                requirement: AchievementRequirement.CHAPTERS_READ,
                threshold: 1000,
            },

            // Time-based achievements
            {
                slug: "primeira-hora",
                name: "Primeira Hora",
                description: "Leia por 1 hora",
                icon: "clock",
                points: 20,
                requirement: AchievementRequirement.READING_TIME,
                threshold: 1,
            },
            {
                slug: "maratonista",
                name: "Maratonista",
                description: "Leia por 10 horas",
                icon: "clock",
                points: 75,
                requirement: AchievementRequirement.READING_TIME,
                threshold: 10,
            },
            {
                slug: "viciado-em-leitura",
                name: "Viciado em Leitura",
                description: "Leia por 50 horas",
                icon: "clock",
                points: 200,
                requirement: AchievementRequirement.READING_TIME,
                threshold: 50,
            },
            {
                slug: "lenda-da-leitura",
                name: "Lenda da Leitura",
                description: "Leia por 100 horas",
                icon: "award",
                points: 500,
                requirement: AchievementRequirement.READING_TIME,
                threshold: 100,
            },

            // Collection achievements
            {
                slug: "colecionador-iniciante",
                name: "Colecionador Iniciante",
                description: "Adicione 5 novels aos favoritos",
                icon: "heart",
                points: 15,
                requirement: AchievementRequirement.FAVORITES_COUNT,
                threshold: 5,
            },
            {
                slug: "colecionador",
                name: "Colecionador",
                description: "Adicione 20 novels aos favoritos",
                icon: "heart",
                points: 50,
                requirement: AchievementRequirement.FAVORITES_COUNT,
                threshold: 20,
            },
            {
                slug: "curador",
                name: "Curador",
                description: "Adicione 50 novels aos favoritos",
                icon: "heart",
                points: 100,
                requirement: AchievementRequirement.FAVORITES_COUNT,
                threshold: 50,
            },

            // Completion achievements
            {
                slug: "primeira-conquista",
                name: "Primeira Conquista",
                description: "Complete sua primeira novel",
                icon: "target",
                points: 50,
                requirement: AchievementRequirement.NOVELS_COMPLETED,
                threshold: 1,
            },
            {
                slug: "finalizador",
                name: "Finalizador",
                description: "Complete 5 novels",
                icon: "target",
                points: 150,
                requirement: AchievementRequirement.NOVELS_COMPLETED,
                threshold: 5,
            },
            {
                slug: "completista",
                name: "Completista",
                description: "Complete 10 novels",
                icon: "medal",
                points: 300,
                requirement: AchievementRequirement.NOVELS_COMPLETED,
                threshold: 10,
            },

            // Streak achievements
            {
                slug: "sequencia-3-dias",
                name: "Sequência de 3 Dias",
                description: "Leia por 3 dias consecutivos",
                icon: "flame",
                points: 25,
                requirement: AchievementRequirement.DAYS_STREAK,
                threshold: 3,
            },
            {
                slug: "sequencia-7-dias",
                name: "Sequência de 7 Dias",
                description: "Leia por 7 dias consecutivos",
                icon: "flame",
                points: 50,
                requirement: AchievementRequirement.DAYS_STREAK,
                threshold: 7,
            },
            {
                slug: "sequencia-30-dias",
                name: "Sequência de 30 Dias",
                description: "Leia por 30 dias consecutivos",
                icon: "flame",
                points: 200,
                requirement: AchievementRequirement.DAYS_STREAK,
                threshold: 30,
            },
            {
                slug: "leitor-constante",
                name: "Leitor Constante",
                description: "Leia por 100 dias consecutivos",
                icon: "zap",
                points: 500,
                requirement: AchievementRequirement.DAYS_STREAK,
                threshold: 100,
            },
        ];

        let created = 0;
        let skipped = 0;

        for (const achievement of achievements) {
            const existing = await prisma.achievement.findUnique({
                where: { slug: achievement.slug },
            });

            if (!existing) {
                await prisma.achievement.create({
                    data: achievement,
                });
                created++;
            } else {
                skipped++;
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                created,
                skipped,
                total: achievements.length,
            },
        });
    } catch (error) {
        console.error("Error seeding achievements:", error);
        return NextResponse.json(
            { error: "Failed to seed achievements" },
            { status: 500 }
        );
    }
}
