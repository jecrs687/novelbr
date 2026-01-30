"use client";

import { useReaderStore } from "@/lib/store";
import type { ChapterContent } from "@/lib/schemas";

interface ReaderContentProps {
  content: ChapterContent;
}

export function ReaderContent({ content }: ReaderContentProps) {
  const { fontSize, lineHeight, fontFamily } = useReaderStore();

  // Get all paragraphs from the content
  const paragraphs = Object.values(content).flat();

  return (
    <article
      className="reader-content bg-card rounded-2xl border border-border p-6 lg:p-10"
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        fontFamily: fontFamily,
      }}
    >
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="text-card-foreground mb-6 last:mb-0"
          style={{
            textIndent: paragraph.trim().length > 0 ? "2em" : 0,
          }}
        >
          {paragraph}
        </p>
      ))}
    </article>
  );
}
