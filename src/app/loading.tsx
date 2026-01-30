import { SkeletonNovelCard } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="space-y-8">
            {/* Hero Skeleton */}
            <div className="relative h-[500px] bg-muted rounded-3xl overflow-hidden animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                    <div className="h-8 w-32 bg-primary/20 rounded-full" />
                    <div className="h-12 w-2/3 bg-muted-foreground/20 rounded-lg" />
                    <div className="h-4 w-1/2 bg-muted-foreground/20 rounded-lg" />
                    <div className="flex gap-4 mt-6">
                        <div className="h-12 w-40 bg-primary/20 rounded-xl" />
                        <div className="h-12 w-32 bg-muted-foreground/20 rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Section Header Skeleton */}
            <div className="flex justify-between items-center">
                <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
                <div className="h-10 w-24 bg-muted rounded-lg animate-pulse" />
            </div>

            {/* Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                {Array.from({ length: 10 }).map((_, i) => (
                    <SkeletonNovelCard key={i} />
                ))}
            </div>
        </div>
    );
}
