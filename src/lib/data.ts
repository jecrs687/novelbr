import type { NovelsList, ChapterLinks, ChapterContent } from "./schemas";

const GITHUB_RAW_BASE =
  "https://raw.githubusercontent.com/jecrs687/novelbr/master";

// Fetch novels list
export async function fetchNovelsList(): Promise<NovelsList> {
  const response = await fetch(`${GITHUB_RAW_BASE}/list.json`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error("Failed to fetch novels list");
  }

  return response.json();
}

// Fetch chapter links
export async function fetchChapterLinks(): Promise<ChapterLinks> {
  const response = await fetch(`${GITHUB_RAW_BASE}/links.json`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chapter links");
  }

  return response.json();
}

// Fetch chapter content
export async function fetchChapterContent(
  novelName: string,
  chapterIndex: number
): Promise<ChapterContent> {
  const encodedName = encodeURIComponent(novelName);
  const response = await fetch(
    `${GITHUB_RAW_BASE}/noveis/${encodedName}/${chapterIndex}.json`,
    {
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch chapter content");
  }

  return response.json();
}

// Get novel by name
export async function getNovelByName(name: string) {
  const novels = await fetchNovelsList();
  const links = await fetchChapterLinks();

  const novel = novels[name];
  const chapters = links[name];

  if (!novel) {
    return null;
  }

  return {
    name,
    ...novel,
    chapters: chapters ? Object.entries(chapters).map(([title, link]) => ({ title, link })) : [],
  };
}

// Search novels
export function searchNovels(novels: NovelsList, query: string): NovelsList {
  if (!query.trim()) return novels;

  const lowerQuery = query.toLowerCase();

  return Object.fromEntries(
    Object.entries(novels).filter(([name, data]) => {
      const nameMatch = name.toLowerCase().includes(lowerQuery);
      const summaryMatch = data.resumo.some((text) =>
        text.toLowerCase().includes(lowerQuery)
      );
      const genreMatch = data.genero?.some((genre) =>
        genre.toLowerCase().includes(lowerQuery)
      );

      return nameMatch || summaryMatch || genreMatch;
    })
  );
}

// Format novel name for URL
export function formatNovelNameForUrl(name: string): string {
  return encodeURIComponent(name.replace(/\s+/g, "-").toLowerCase());
}

// Parse novel name from URL
export function parseNovelNameFromUrl(urlName: string): string {
  return decodeURIComponent(urlName.replace(/-/g, " "));
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// Get random items from array
export function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Format chapter number
export function formatChapterNumber(index: number): string {
  return `Capítulo ${index + 1}`;
}

// Calculate reading time (words per minute)
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Get reading time estimate from chapter content
export function getReadingTime(content: ChapterContent): number {
  const text = Object.values(content).flat().join(" ");
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / 200);
}
