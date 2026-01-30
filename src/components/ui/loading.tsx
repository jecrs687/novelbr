import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 size={size} className="animate-spin text-primary" />
    </div>
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size={48} />
      <p className="text-muted-foreground animate-pulse">Carregando...</p>
    </div>
  );
}

export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded-xl ${className}`} />
  );
}

export function NovelCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <LoadingSkeleton className="aspect-[3/4]" />
      <div className="p-4 space-y-3">
        <LoadingSkeleton className="h-5 w-3/4" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function NovelGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <NovelCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSliderSkeleton() {
  return (
    <div className="relative h-[60vh] min-h-[400px] max-h-[600px] rounded-3xl overflow-hidden mb-12">
      <LoadingSkeleton className="absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl space-y-4">
            <LoadingSkeleton className="h-6 w-32" />
            <LoadingSkeleton className="h-12 w-3/4" />
            <LoadingSkeleton className="h-6 w-full" />
            <LoadingSkeleton className="h-6 w-2/3" />
            <LoadingSkeleton className="h-14 w-48 mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
