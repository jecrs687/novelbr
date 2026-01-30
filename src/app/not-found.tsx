import Link from "next/link";
import { Home, BookOpen, BookX, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-[150px] lg:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-primary via-accent to-secondary opacity-20">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-6 bg-card border border-border rounded-3xl shadow-xl">
              <BookX className="text-primary" size={64} />
            </div>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
          Página não encontrada
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
          Ops! Parece que esta página se perdeu em outro mundo.
          Talvez esteja em uma novel que ainda não lemos.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            <Home size={20} />
            Página Inicial
          </Link>
          <Link
            href="/novels"
            className="flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground rounded-xl font-semibold hover:bg-muted transition-colors"
          >
            <Search size={20} />
            Explorar Novels
          </Link>
        </div>
      </div>
    </div>
  );
}
