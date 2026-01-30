import { SkeletonNovelCard } from "@/components/ui/skeleton";

export default function NovelsLoading() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <div className="h-10 w-64 bg-muted rounded-lg animate-pulse" />
                <div className="h-5 w-96 bg-muted-foreground/20 rounded-lg animate-pulse" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 w-24 bg-muted rounded-lg animate-pulse" />
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                {Array.from({ length: 20 }).map((_, i) => (
                    <SkeletonNovelCard key={i} />
                ))}
            </div>
        </div>
    );
}
