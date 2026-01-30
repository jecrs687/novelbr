import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
} from 'lucide-react';

interface PageProps {
    searchParams: Promise<{ page?: string; search?: string; sort?: string }>;
}

async function getUsers(page: number, search?: string, sort?: string) {
    const limit = 20;
    const skip = (page - 1) * limit;

    const where = search ? {
        OR: [
            { username: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { displayName: { contains: search, mode: 'insensitive' as const } },
        ],
    } : {};

    const orderBy = {
        newest: { createdAt: 'desc' as const },
        oldest: { createdAt: 'asc' as const },
        username: { username: 'asc' as const },
    }[sort || 'newest'] || { createdAt: 'desc' as const };

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                _count: {
                    select: {
                        favorites: true,
                        reviews: true,
                        comments: true,
                        readingProgress: true,
                    },
                },
            },
        }),
        prisma.user.count({ where }),
    ]);

    return { users, total, totalPages: Math.ceil(total / limit) };
}

export default async function UsersPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const search = params.search;
    const sort = params.sort;

    const { users, total, totalPages } = await getUsers(page, search, sort);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Usuários</h1>
                    <p className="text-gray-400 mt-1">Gerenciar todos os usuários do sistema</p>
                </div>
                <Link
                    href="/bko/users/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Novo Usuário
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <form className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        name="search"
                        defaultValue={search}
                        placeholder="Buscar por nome, email ou username..."
                        className="w-full h-10 rounded-lg bg-gray-800 border border-gray-700 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </form>
                <select
                    defaultValue={sort || 'newest'}
                    className="h-10 rounded-lg bg-gray-800 border border-gray-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="newest">Mais recentes</option>
                    <option value="oldest">Mais antigos</option>
                    <option value="username">Username (A-Z)</option>
                </select>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-400">
                Mostrando {users.length} de {total} usuários
            </div>

            {/* Table */}
            <div className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Usuário
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Atividade
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Cadastro
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Último acesso
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-750">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                                                {user.avatarUrl ? (
                                                    <img
                                                        src={user.avatarUrl}
                                                        alt={user.username}
                                                        className="h-full w-full rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-medium text-white">
                                                        {(user.displayName?.[0] || user.username[0]).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    {user.displayName || user.username}
                                                </p>
                                                <p className="text-xs text-gray-400">@{user.username}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-300">{user.email}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <span>{user._count.favorites} favoritos</span>
                                            <span>{user._count.reviews} reviews</span>
                                            <span>{user._count.comments} comentários</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-300">
                                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-300">
                                            {user.lastLoginAt
                                                ? new Date(user.lastLoginAt).toLocaleDateString('pt-BR')
                                                : 'Nunca'
                                            }
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/bko/users/${user.id}`}
                                                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                href={`/bko/users/${user.id}/edit`}
                                                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
                        <p className="text-sm text-gray-400">
                            Página {page} de {totalPages}
                        </p>
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/bko/users?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ''}${sort ? `&sort=${sort}` : ''}`}
                                className={`px-3 py-1 rounded-lg text-sm ${page === 1
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                    }`}
                            >
                                Anterior
                            </Link>
                            <Link
                                href={`/bko/users?page=${Math.min(totalPages, page + 1)}${search ? `&search=${search}` : ''}${sort ? `&sort=${sort}` : ''}`}
                                className={`px-3 py-1 rounded-lg text-sm ${page === totalPages
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                    }`}
                            >
                                Próxima
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
