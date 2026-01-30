import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
    Trash2,
    Bell,
    CheckCircle,
    Clock,
    Send,
    User,
    BookOpen,
    MessageSquare,
    Award,
    AlertCircle,
} from 'lucide-react';

interface PageProps {
    searchParams: Promise<{ page?: string; type?: string; read?: string }>;
}

async function getNotifications(page: number, type?: string, read?: string) {
    const limit = 30;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (type) {
        where.type = type;
    }

    if (read === 'true') {
        where.isRead = true;
    } else if (read === 'false') {
        where.isRead = false;
    }

    const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, username: true, displayName: true } },
            },
        }),
        prisma.notification.count({ where }),
    ]);

    return { notifications, total, totalPages: Math.ceil(total / limit) };
}

const typeIcons: Record<string, React.ElementType> = {
    NEW_CHAPTER: BookOpen,
    REPLY: MessageSquare,
    ACHIEVEMENT: Award,
    SYSTEM: AlertCircle,
    FAVORITE_UPDATE: Bell,
};

const typeLabels: Record<string, string> = {
    NEW_CHAPTER: 'Novo Capítulo',
    REPLY: 'Resposta',
    ACHIEVEMENT: 'Conquista',
    SYSTEM: 'Sistema',
    FAVORITE_UPDATE: 'Atualização Favorito',
};

export default async function NotificationsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const type = params.type;
    const read = params.read;

    const { notifications, total, totalPages } = await getNotifications(page, type, read);

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Notificações</h1>
                    <p className="text-gray-400 mt-1">Gerenciar notificações do sistema</p>
                </div>
                <Link
                    href="/bko/notifications/send"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                >
                    <Send className="h-4 w-4" />
                    Enviar Notificação
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <select
                    defaultValue={type || ''}
                    className="h-10 rounded-lg bg-gray-800 border border-gray-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Todos os tipos</option>
                    <option value="NEW_CHAPTER">Novo Capítulo</option>
                    <option value="REPLY">Resposta</option>
                    <option value="ACHIEVEMENT">Conquista</option>
                    <option value="SYSTEM">Sistema</option>
                    <option value="FAVORITE_UPDATE">Atualização Favorito</option>
                </select>
                <select
                    defaultValue={read || ''}
                    className="h-10 rounded-lg bg-gray-800 border border-gray-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Todas</option>
                    <option value="false">Não lidas</option>
                    <option value="true">Lidas</option>
                </select>
            </div>

            {/* Stats */}
            <div className="text-sm text-gray-400">
                Mostrando {notifications.length} de {total} notificações
            </div>

            {/* Table */}
            <div className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Usuário
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Título
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                    Mensagem
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
                            {notifications.map((notification) => {
                                const Icon = typeIcons[notification.type] || Bell;
                                return (
                                    <tr key={notification.id} className="hover:bg-gray-750">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Icon className="h-4 w-4 text-indigo-400" />
                                                <span className="text-xs text-gray-300">
                                                    {typeLabels[notification.type] || notification.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link
                                                href={`/bko/users/${notification.user.id}`}
                                                className="flex items-center gap-2 text-sm text-white hover:text-indigo-400"
                                            >
                                                <User className="h-4 w-4 text-gray-400" />
                                                {notification.user.displayName || notification.user.username}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-white truncate max-w-[200px]">
                                                {notification.title}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-300 truncate max-w-[300px]">
                                                {notification.message}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {notification.isRead ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-700 text-gray-400 text-xs">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Lida
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-900/50 text-indigo-400 text-xs">
                                                    <Clock className="h-3 w-3" />
                                                    Não lida
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-gray-400">
                                                {new Date(notification.createdAt).toLocaleDateString('pt-BR')}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-700 transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
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
                                href={`/bko/notifications?page=${Math.max(1, page - 1)}${type ? `&type=${type}` : ''}${read ? `&read=${read}` : ''}`}
                                className={`px-3 py-1 rounded-lg text-sm ${page === 1
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                    }`}
                            >
                                Anterior
                            </Link>
                            <Link
                                href={`/bko/notifications?page=${Math.min(totalPages, page + 1)}${type ? `&type=${type}` : ''}${read ? `&read=${read}` : ''}`}
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
