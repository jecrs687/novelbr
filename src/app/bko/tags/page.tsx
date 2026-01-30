import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Hash,
    BookOpen,
} from 'lucide-react';

interface PageProps {
    searchParams: Promise<{ page?: string; search?: string }>;
}

async function getTags(page: number, search?: string) {
    const limit = 30;
    const skip = (page - 1) * limit;

    const where = search ? {
        OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
        ],
    } : {};

    const [tags, total] = await Promise.all([
        prisma.tag.findMany({
            where,
            skip,
            take: limit,
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { novels: true },
                },
            },
        }),
        prisma.tag.count({ where }),
    ]);

    return { tags, total, totalPages: Math.ceil(total / limit) };
}

export default async function TagsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const search = params.search;

    const { tags, total, totalPages } = await getTags(page, search);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tags</h1>
                    <p className="text-gray-400 mt-1">Gerenciar tags de classificação das novels</p>
                </div>
                <Link
                    href="/bko/tags/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Nova Tag
                </Link>
            </div>

            {/* Filters */}
            <form className="flex-1 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    name="search"
                    defaultValue={search}
                    placeholder="Buscar tags..."
                    className="w-full h-10 rounded-lg bg-gray-800 border border-gray-700 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </form>

            {/* Stats */}
            <div className="text-sm text-gray-400">
                Mostrando {tags.length} de {total} tags
            </div>

            {/* Table */}
            <div className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Tag
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Descrição
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Novels
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {tags.map((tag) => (
                                <tr key={tag.id} className="hover:bg-gray-750">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-indigo-400" />
                                            <span className="text-sm font-medium text-white">{tag.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-400">/{tag.slug}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-300 truncate max-w-[300px]">
                                            {tag.description || '-'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1 text-sm text-gray-300">
                                            <BookOpen className="h-4 w-4 text-gray-400" />
                                            {tag._count.novels}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/bko/tags/${tag.id}/edit`}
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
                                href={`/bko/tags?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ''}`}
                                className={`px-3 py-1 rounded-lg text-sm ${page === 1
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                    }`}
                            >
                                Anterior
                            </Link>
                            <Link
                                href={`/bko/tags?page=${Math.min(totalPages, page + 1)}${search ? `&search=${search}` : ''}`}
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
