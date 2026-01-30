import { NovelCard } from "@/components/novel/novel-card";
import type { NovelsList } from "@/lib/schemas";

interface NovelGridProps {
  novels: NovelsList;
  title?: string;
  subtitle?: string;
  limit?: number;
  variant?: "default" | "compact";
}

export function NovelGrid({
  novels,
  title,
  subtitle,
  limit,
  variant = "default",
}: NovelGridProps) {
  const entries = Object.entries(novels);
  const displayEntries = limit ? entries.slice(0, limit) : entries;

  return (
    <section className="mb-12">
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      )}
      <div
        className={
          variant === "compact"
            ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
            : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6"
        }
      >
        {displayEntries.map(([name, novel]) => (
          <NovelCard
            key={name}
            name={name}
            novel={novel}
            variant={variant}
          />
        ))}
      </div>
    </section>
  );
}
