import { SkeletonChapter, SkeletonText, Skeleton } from "@/components/ui/skeleton";

export default function NovelDetailLoading() {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative -mx-4 -mt-6 lg:-mx-8 lg:-mt-6 px-4 lg:px-8 py-8 lg:py-12 bg-gradient-to-b from-card to-background">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Cover */}
                    <Skeleton className="w-48 lg:w-64 aspect-[3/4] rounded-2xl mx-auto lg:mx-0" />

                    {/* Info */}
                    <div className="flex-1 space-y-6">
                        {/* Title */}
                        <Skeleton className="h-10 w-3/4" />

                        {/* Author & Meta */}
                        <div className="flex flex-wrap gap-4">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-28" />
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="w-6 h-6" rounded="full" />
                            ))}
                            <Skeleton className="h-5 w-16 ml-2" />
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-20" rounded="full" />
                            ))}
                        </div>

                        {/* Description */}
                        <SkeletonText lines={4} />

                        {/* Actions */}
                        <div className="flex gap-4 pt-4">
                            <Skeleton className="h-12 w-40" rounded="xl" />
                            <Skeleton className="h-12 w-32" rounded="xl" />
                            <Skeleton className="h-12 w-12" rounded="xl" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chapters */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-10 w-32" />
                </div>

                <div className="space-y-3">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <SkeletonChapter key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
