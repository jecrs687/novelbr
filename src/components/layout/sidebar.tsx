"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  Heart,
  Search,
  Settings,
  Menu,
  X,
  Moon,
  Sun,
  Sparkles,
  TrendingUp,
  Clock,
  Library,
  Trophy,
  History,
  Tags,
  User,
  LogIn,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useThemeStore, useUserStore } from "@/lib/store";

const mainNavItems = [
  { href: "/", icon: Home, label: "Início" },
  { href: "/novels", icon: Library, label: "Biblioteca" },
  { href: "/genres", icon: Tags, label: "Gêneros" },
  { href: "/favorites", icon: Heart, label: "Favoritos" },
  { href: "/search", icon: Search, label: "Buscar" },
];

const secondaryNavItems = [
  { href: "/rankings", icon: Trophy, label: "Rankings" },
  { href: "/trending", icon: TrendingUp, label: "Em Alta" },
  { href: "/recent", icon: Clock, label: "Recentes" },
  { href: "/recommendations", icon: Sparkles, label: "Para Você" },
];

const userNavItems = [
  { href: "/profile", icon: User, label: "Meu Perfil" },
  { href: "/history", icon: History, label: "Histórico" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useThemeStore();
  const { user, logout } = useUserStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  const previousPathname = pathname;
  if (isMobileMenuOpen && previousPathname !== pathname) {
    setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsMobileMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-72 bg-card/80 backdrop-blur-xl border-r border-border z-50">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
                <BookOpen className="text-white" size={24} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">NovelBR</h1>
              <p className="text-xs text-muted-foreground">Sua biblioteca de novels</p>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-6 px-4 overflow-y-auto no-scrollbar">
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${active
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {active && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-primary-foreground" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="my-6">
            <div className="divider" />
          </div>

          <div className="mb-3">
            <span className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Descobrir
            </span>
          </div>
          <div className="space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${active
                      ? "bg-accent/15 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="my-6">
            <div className="divider" />
          </div>

          <div className="mb-3">
            <span className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Minha Conta
            </span>
          </div>
          <div className="space-y-1">
            {user ? (
              <>
                {userNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${active
                          ? "bg-secondary/15 text-secondary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-destructive hover:bg-destructive/10 transition-all duration-200"
                >
                  <LogOut size={20} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive("/login")
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <LogIn size={20} />
                  <span>Entrar</span>
                </Link>
                <Link
                  href="/register"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive("/register")
                      ? "bg-accent/15 text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <UserPlus size={20} />
                  <span>Criar Conta</span>
                </Link>
              </>
            )}
          </div>

          {/* User Profile Card (when logged in) */}
          {user && (
            <div className="mt-8 p-4 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl border border-border">
              <Link href="/profile" className="flex items-center gap-3 group">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.displayName || user.username}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <User className="text-white" size={18} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {user.displayName || user.username}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
                </div>
              </Link>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-8 p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-primary" />
              <span className="font-semibold text-sm text-foreground">Estatísticas</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-2 bg-card/50 rounded-xl">
                <div className="text-lg font-bold text-foreground">87+</div>
                <div className="text-xs text-muted-foreground">Novels</div>
              </div>
              <div className="text-center p-2 bg-card/50 rounded-xl">
                <div className="text-lg font-bold text-foreground">5k+</div>
                <div className="text-xs text-muted-foreground">Capítulos</div>
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted font-medium transition-all"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === "dark" ? "Modo Claro" : "Modo Escuro"}</span>
          </button>
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive("/settings")
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
          >
            <Settings size={20} />
            <span>Configurações</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-card/95 backdrop-blur-xl shadow-lg" : "bg-transparent"
          }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
              <BookOpen className="text-white" size={20} />
            </div>
            <span className="text-lg font-bold text-foreground">NovelBR</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-muted/50 text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2.5 rounded-xl bg-muted/50 text-foreground hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card z-50 shadow-2xl animate-slideInRight">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-lg font-bold text-foreground">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <X size={24} className="text-foreground" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${active
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    <Icon size={22} />
                    <span className="text-base">{item.label}</span>
                  </Link>
                );
              })}

              <div className="my-4">
                <div className="divider" />
              </div>

              {secondaryNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${active
                        ? "bg-accent/15 text-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    <Icon size={22} />
                    <span className="text-base">{item.label}</span>
                  </Link>
                );
              })}

              <div className="my-4">
                <div className="divider" />
              </div>

              {user ? (
                <>
                  {userNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${active
                            ? "bg-secondary/15 text-secondary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                      >
                        <Icon size={22} />
                        <span className="text-base">{item.label}</span>
                      </Link>
                    );
                  })}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl font-medium text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <LogOut size={22} />
                    <span className="text-base">Sair</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${isActive("/login")
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    <LogIn size={22} />
                    <span className="text-base">Entrar</span>
                  </Link>
                  <Link
                    href="/register"
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${isActive("/register")
                        ? "bg-accent/15 text-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                  >
                    <UserPlus size={22} />
                    <span className="text-base">Criar Conta</span>
                  </Link>
                </>
              )}

              <div className="my-4">
                <div className="divider" />
              </div>

              <Link
                href="/settings"
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${isActive("/settings")
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                <Settings size={22} />
                <span className="text-base">Configurações</span>
              </Link>
            </nav>
          </div>
        </>
      )}

      {/* Spacer for mobile */}
      <div className="lg:hidden h-16" />
    </>
  );
}
