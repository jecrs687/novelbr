import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,

    BookOpen,
    CheckCircle,
    XCircle,
} from 'lucide-react';

interface PageProps {
    searchParams: Promise<{ page?: string; search?: string; novel?: string; published?: string }>;
}

async function getChapters(page: number, search?: string, novelId?: string, published?: string) {
    const limit = 30;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
        ];
    }

    if (novelId) {
        where.novelId = novelId;
    }

    if (published === 'true') {
        where.isPublished = true;
    } else if (published === 'false') {
        where.isPublished = false;
    }

    const [chapters, total, novels] = await Promise.all([
        prisma.chapter.findMany({
            where,
            skip,
            take: limit,
            orderBy: [{ novelId: 'asc' }, { chapterNumber: 'desc' }],
            include: {
                novel: { select: { id: true, title: true, slug: true } },
            },
        }),
        prisma.chapter.count({ where }),
        prisma.novel.findMany({
            select: { id: true, title: true },
            orderBy: { title: 'asc' },
        }),
    ]);

    return { chapters, total, totalPages: Math.ceil(total / limit), novels };
}

export default async function ChaptersPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const search = params.search;
    const novelId = params.novel;
    const published = params.published;

    const { chapters, total, totalPages, novels } = await getChapters(page, search, novelId, published);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Capítulos</h1>
                    <p className="text-gray-400 mt-1">Gerenciar todos os capítulos das novels</p>
                </div>
                <Link
                    href="/bko/chapters/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Novo Capítulo
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
                        placeholder="Buscar por título ou conteúdo..."
                        className="w-full h-10 rounded-lg bg-gray-800 border border-gray-700 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </form>
                <select
                    defaultValue={novelId || ''}
                    className="h-10 rounded-lg bg-gray-800 border border-gray-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Todas as novels</option>
                    {novels.map((novel) => (
                        <option key={novel.id} value={novel.id}>
                            {novel.title}
                        </option>
                    ))}
                </select>
                <select
                    defaultValue={published || ''}
                    className="h-10 rounded-lg bg-gray-800 border border-gray-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Todos</option>
                    <option value="true">Publicados</option>
                    <option value="false">Não publicados</option>
                </select>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-400">
                Mostrando {chapters.length} de {total} capítulos
            </div>

            {/* Table */}
            <div className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Novel
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Capítulo
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Título
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Palavras
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Views
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Data
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {chapters.map((chapter) => (
                                <tr key={chapter.id} className="hover:bg-gray-750">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-gray-400" />
                                            <Link
                                                href={`/bko/novels/${chapter.novel.id}`}
                                                className="text-sm text-indigo-400 hover:underline truncate max-w-[200px]"
                                            >
                                                {chapter.novel.title}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-white">
                                            #{chapter.chapterNumber}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-300 truncate max-w-[200px]">
                                            {chapter.title || 'Sem título'}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-300">
                                            {chapter.wordCount.toLocaleString('pt-BR')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-300">
                                            {chapter.views.toLocaleString('pt-BR')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {chapter.isPublished ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-900/50 text-green-400 text-xs">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Publicado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-900/50 text-yellow-400 text-xs">
                                                    <XCircle className="h-3 w-3" />
                                                    Rascunho
                                                </span>
                                            )}
                                            {chapter.isPremium && (
                                                <span className="px-2 py-1 rounded bg-purple-900/50 text-purple-400 text-xs">
                                                    Premium
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-gray-400">
                                            {new Date(chapter.createdAt).toLocaleDateString('pt-BR')}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/novel/${chapter.novel.slug}/chapter/${chapter.chapterNumber}`}
                                                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                                                title="Visualizar"
                                                target="_blank"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                href={`/bko/chapters/${chapter.id}/edit`}
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
                                href={`/bko/chapters?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ''}${novelId ? `&novel=${novelId}` : ''}${published ? `&published=${published}` : ''}`}
                                className={`px-3 py-1 rounded-lg text-sm ${page === 1
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                    }`}
                            >
                                Anterior
                            </Link>
                            <Link
                                href={`/bko/chapters?page=${Math.min(totalPages, page + 1)}${search ? `&search=${search}` : ''}${novelId ? `&novel=${novelId}` : ''}${published ? `&published=${published}` : ''}`}
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
