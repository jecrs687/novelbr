'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    FileText,
    Tag,
    MessageSquare,
    Star,
    Award,
    BarChart3,
    Settings,
    Menu,
    X,
    ChevronDown,
    LogOut,
    Home,
    Bell,
    Search,
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/bko', icon: LayoutDashboard },
    { name: 'Usuários', href: '/bko/users', icon: Users },
    { name: 'Novels', href: '/bko/novels', icon: BookOpen },
    { name: 'Capítulos', href: '/bko/chapters', icon: FileText },
    {
        name: 'Categorias',
        icon: Tag,
        children: [
            { name: 'Gêneros', href: '/bko/genres' },
            { name: 'Tags', href: '/bko/tags' },
        ]
    },
    {
        name: 'Moderação',
        icon: MessageSquare,
        children: [
            { name: 'Comentários', href: '/bko/comments' },
            { name: 'Reviews', href: '/bko/reviews' },
        ]
    },
    { name: 'Avaliações', href: '/bko/ratings', icon: Star },
    { name: 'Conquistas', href: '/bko/achievements', icon: Award },
    { name: 'Estatísticas', href: '/bko/stats', icon: BarChart3 },
    { name: 'Notificações', href: '/bko/notifications', icon: Bell },
    { name: 'Configurações', href: '/bko/settings', icon: Settings },
];

function NavItem({ item, pathname }: { item: typeof navigation[0]; pathname: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = 'children' in item && item.children;
    const isActive = hasChildren
        ? item.children?.some(child => pathname === child.href)
        : pathname === item.href;

    if (hasChildren) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.name}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="ml-8 mt-1 space-y-1">
                        {item.children?.map((child) => (
                            <Link
                                key={child.href}
                                href={child.href}
                                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === child.href
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                {child.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={item.href!}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
        >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span>{item.name}</span>
        </Link>
    );
}

export default function BkoLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="bko-layout min-h-screen bg-gray-900">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between px-4 border-b border-gray-700">
                        <Link href="/bko" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">NovelBR</span>
                            <span className="text-xs bg-indigo-600 px-2 py-0.5 rounded text-white">Admin</span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {navigation.map((item) => (
                            <NavItem key={item.name} item={item} pathname={pathname} />
                        ))}
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-gray-700 p-4">
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                            <Home className="h-5 w-5" />
                            <span>Voltar ao Site</span>
                        </Link>
                        <button
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors mt-1"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Sair</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-gray-700 bg-gray-800/95 backdrop-blur px-4 lg:px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-gray-400 hover:text-white"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="h-9 w-64 rounded-lg bg-gray-700 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative text-gray-400 hover:text-white">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                                3
                            </span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                <span className="text-sm font-medium text-white">A</span>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-white">Admin</p>
                                <p className="text-xs text-gray-400">admin@novelbr.com</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
