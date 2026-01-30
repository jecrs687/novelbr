'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Users, User } from 'lucide-react';

interface UserOption {
    id: string;
    username: string;
    displayName: string | null;
}

export default function SendNotificationPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [sendTo, setSendTo] = useState<'all' | 'specific'>('all');
    const [users, setUsers] = useState<UserOption[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    useEffect(() => {
        if (sendTo === 'specific') {
            fetch('/api/bko/users?limit=1000')
                .then(res => res.json())
                .then(data => setUsers(data.users || []));
        }
    }, [sendTo]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const data = {
            type: formData.get('type'),
            title: formData.get('title'),
            message: formData.get('message'),
            link: formData.get('link') || null,
            sendTo,
            userIds: sendTo === 'specific' ? selectedUsers : undefined,
        };

        try {
            const response = await fetch('/api/bko/notifications/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Erro ao enviar notificação');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/bko/notifications');
                router.refresh();
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/bko/notifications"
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Enviar Notificação</h1>
                    <p className="text-gray-400 mt-1">Enviar notificação para usuários</p>
                </div>
            </div>

            {error && (
                <div className="rounded-lg bg-red-900/50 border border-red-700 p-4 text-red-200">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg bg-green-900/50 border border-green-700 p-4 text-green-200">
                    Notificação enviada com sucesso! Redirecionando...
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Destinatários</h2>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sendTo"
                                    checked={sendTo === 'all'}
                                    onChange={() => setSendTo('all')}
                                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                                />
                                <Users className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-white">Todos os usuários</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sendTo"
                                    checked={sendTo === 'specific'}
                                    onChange={() => setSendTo('specific')}
                                    className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 focus:ring-indigo-500"
                                />
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-white">Usuários específicos</span>
                            </label>
                        </div>

                        {sendTo === 'specific' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Selecione os usuários
                                </label>
                                <div className="max-h-48 overflow-y-auto rounded-lg bg-gray-700 border border-gray-600 p-2 space-y-1">
                                    {users.map((user) => (
                                        <label key={user.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedUsers([...selectedUsers, user.id]);
                                                    } else {
                                                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                                    }
                                                }}
                                                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-white">{user.displayName || user.username}</span>
                                            <span className="text-xs text-gray-400">@{user.username}</span>
                                        </label>
                                    ))}
                                </div>
                                {selectedUsers.length > 0 && (
                                    <p className="text-xs text-gray-400 mt-2">
                                        {selectedUsers.length} usuário(s) selecionado(s)
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Conteúdo</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tipo *
                            </label>
                            <select
                                name="type"
                                required
                                defaultValue="SYSTEM"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="SYSTEM">Sistema</option>
                                <option value="NEW_CHAPTER">Novo Capítulo</option>
                                <option value="ACHIEVEMENT">Conquista</option>
                                <option value="FAVORITE_UPDATE">Atualização Favorito</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Título *
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Título da notificação"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Mensagem *
                            </label>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                className="w-full rounded-lg bg-gray-700 border border-gray-600 px-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Conteúdo da notificação..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Link (opcional)
                            </label>
                            <input
                                type="text"
                                name="link"
                                className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="/novel/slug ou URL externa"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/bko/notifications"
                        className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading || (sendTo === 'specific' && selectedUsers.length === 0)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4" />
                        {isLoading ? 'Enviando...' : 'Enviar Notificação'}
                    </button>
                </div>
            </form>
        </div>
    );
}
