import { z } from "zod";

// Novel Summary Schema
export const NovelSummarySchema = z.object({
  link: z.string().url().optional(),
  cap: z.number().default(0),
  imagem: z.string().url(),
  resumo: z.array(z.string()),
  genero: z.array(z.string()).optional(),
});

export type NovelSummary = z.infer<typeof NovelSummarySchema>;

// Novels List Schema
export const NovelsListSchema = z.record(z.string(), NovelSummarySchema);

export type NovelsList = z.infer<typeof NovelsListSchema>;

// Chapter Links Schema
export const ChapterLinksSchema = z.record(
  z.string(),
  z.record(z.string(), z.string())
);

export type ChapterLinks = z.infer<typeof ChapterLinksSchema>;

// Chapter Content Schema
export const ChapterContentSchema = z.record(z.string(), z.array(z.string()));

export type ChapterContent = z.infer<typeof ChapterContentSchema>;

// Reading Progress Schema
export const ReadingProgressSchema = z.object({
  novelName: z.string(),
  chapterIndex: z.number(),
  lastRead: z.date(),
  progress: z.number().min(0).max(100).optional(),
});

export type ReadingProgress = z.infer<typeof ReadingProgressSchema>;

// User Settings Schema
export const UserSettingsSchema = z.object({
  theme: z.enum(["light", "dark"]).default("light"),
  fontSize: z.number().min(12).max(32).default(18),
  lineHeight: z.number().min(1).max(3).default(1.8),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;

// Search Query Schema
export const SearchQuerySchema = z.object({
  query: z.string().min(1).max(100),
  filters: z.object({
    genre: z.array(z.string()).optional(),
    status: z.enum(["all", "reading", "completed"]).optional(),
  }).optional(),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;
