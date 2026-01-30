'use client';

import { useState } from 'react';
import {
    Settings,
    Save,
    Globe,
    Mail,
    Shield,
    Database,
    Server,

    Bell,
    Trash2,
    RefreshCw,
    AlertTriangle,
} from 'lucide-react';

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const tabs = [
        { id: 'general', label: 'Geral', icon: Settings },
        { id: 'site', label: 'Site', icon: Globe },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'security', label: 'Segurança', icon: Shield },
        { id: 'notifications', label: 'Notificações', icon: Bell },
        { id: 'maintenance', label: 'Manutenção', icon: Server },
    ];

    async function handleSave() {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Simulate saving
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess('Configurações salvas com sucesso!');
        } catch {
            setError('Erro ao salvar configurações');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleClearCache() {
        if (!confirm('Tem certeza que deseja limpar o cache?')) return;

        setIsLoading(true);
        try {
            await fetch('/api/bko/cache/clear', { method: 'POST' });
            setSuccess('Cache limpo com sucesso!');
        } catch {
            setError('Erro ao limpar cache');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Configurações</h1>
                    <p className="text-gray-400 mt-1">Gerenciar configurações do sistema</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    <Save className="h-4 w-4" />
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>

            {success && (
                <div className="rounded-lg bg-green-900/50 border border-green-700 p-4 text-green-200">
                    {success}
                </div>
            )}

            {error && (
                <div className="rounded-lg bg-red-900/50 border border-red-700 p-4 text-red-200">
                    {error}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar tabs */}
                <div className="lg:w-64 space-y-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/50'
                                        : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === 'general' && (
                        <div className="rounded-xl bg-gray-800 border border-gray-700 p-6 space-y-6">
                            <h2 className="text-lg font-semibold text-white">Configurações Gerais</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Nome do Site
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="NovelBR"
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Descrição
                                    </label>
                                    <textarea
                                        rows={3}
                                        defaultValue="Sua plataforma de leitura de novels"
                                        className="w-full rounded-lg bg-gray-700 border border-gray-600 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Idioma Padrão
                                    </label>
                                    <select className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="pt-BR">Português (Brasil)</option>
                                        <option value="en">English</option>
                                        <option value="es">Español</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Timezone
                                    </label>
                                    <select className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="America/Sao_Paulo">America/Sao_Paulo</option>
                                        <option value="UTC">UTC</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'site' && (
                        <div className="rounded-xl bg-gray-800 border border-gray-700 p-6 space-y-6">
                            <h2 className="text-lg font-semibold text-white">Configurações do Site</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                                    <div>
                                        <p className="text-sm font-medium text-white">Modo de Manutenção</p>
                                        <p className="text-xs text-gray-400">Desativar acesso público ao site</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                                    <div>
                                        <p className="text-sm font-medium text-white">Registro de Novos Usuários</p>
                                        <p className="text-xs text-gray-400">Permitir novos cadastros</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                                    <div>
                                        <p className="text-sm font-medium text-white">Comentários</p>
                                        <p className="text-xs text-gray-400">Permitir comentários nos capítulos</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Itens por Página (Padrão)
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue={20}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'email' && (
                        <div className="rounded-xl bg-gray-800 border border-gray-700 p-6 space-y-6">
                            <h2 className="text-lg font-semibold text-white">Configurações de Email</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Provedor SMTP
                                    </label>
                                    <select className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                        <option value="smtp">SMTP Custom</option>
                                        <option value="sendgrid">SendGrid</option>
                                        <option value="mailgun">Mailgun</option>
                                        <option value="ses">Amazon SES</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Host SMTP
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="smtp.example.com"
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Porta
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="587"
                                            className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Segurança
                                        </label>
                                        <select className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                            <option value="tls">TLS</option>
                                            <option value="ssl">SSL</option>
                                            <option value="none">Nenhum</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Remetente
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="noreply@novelbr.com"
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="rounded-xl bg-gray-800 border border-gray-700 p-6 space-y-6">
                            <h2 className="text-lg font-semibold text-white">Configurações de Segurança</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                                    <div>
                                        <p className="text-sm font-medium text-white">Autenticação de 2 Fatores</p>
                                        <p className="text-xs text-gray-400">Exigir 2FA para administradores</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Tempo de Expiração da Sessão (horas)
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue={24}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Máximo de Tentativas de Login
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue={5}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Tempo de Bloqueio por Falhas (minutos)
                                    </label>
                                    <input
                                        type="number"
                                        defaultValue={15}
                                        className="w-full h-10 rounded-lg bg-gray-700 border border-gray-600 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="rounded-xl bg-gray-800 border border-gray-700 p-6 space-y-6">
                            <h2 className="text-lg font-semibold text-white">Configurações de Notificações</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                                    <div>
                                        <p className="text-sm font-medium text-white">Notificações por Email</p>
                                        <p className="text-xs text-gray-400">Enviar emails para novos capítulos</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                                    <div>
                                        <p className="text-sm font-medium text-white">Push Notifications</p>
                                        <p className="text-xs text-gray-400">Enviar notificações push</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                                    <div>
                                        <p className="text-sm font-medium text-white">Digest Diário</p>
                                        <p className="text-xs text-gray-400">Enviar resumo diário de atualizações</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'maintenance' && (
                        <div className="space-y-6">
                            <div className="rounded-xl bg-gray-800 border border-gray-700 p-6 space-y-6">
                                <h2 className="text-lg font-semibold text-white">Manutenção do Sistema</h2>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                                        <div>
                                            <p className="text-sm font-medium text-white">Limpar Cache</p>
                                            <p className="text-xs text-gray-400">Remover todos os dados em cache</p>
                                        </div>
                                        <button
                                            onClick={handleClearCache}
                                            disabled={isLoading}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-colors disabled:opacity-50"
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                            Limpar
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                                        <div>
                                            <p className="text-sm font-medium text-white">Reindexar Buscas</p>
                                            <p className="text-xs text-gray-400">Reconstruir índice de busca</p>
                                        </div>
                                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                                            <Database className="h-4 w-4" />
                                            Reindexar
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-700">
                                        <div>
                                            <p className="text-sm font-medium text-white">Backup do Banco de Dados</p>
                                            <p className="text-xs text-gray-400">Criar backup completo</p>
                                        </div>
                                        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
                                            <Database className="h-4 w-4" />
                                            Backup
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-red-900/30 border border-red-700 p-6 space-y-4">
                                <div className="flex items-center gap-2 text-red-400">
                                    <AlertTriangle className="h-5 w-5" />
                                    <h2 className="text-lg font-semibold">Zona de Perigo</h2>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-red-900/20 border border-red-800">
                                    <div>
                                        <p className="text-sm font-medium text-white">Limpar Notificações Antigas</p>
                                        <p className="text-xs text-gray-400">Remover notificações com mais de 30 dias</p>
                                    </div>
                                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                        Limpar
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-red-900/20 border border-red-800">
                                    <div>
                                        <p className="text-sm font-medium text-white">Limpar Sessões de Leitura</p>
                                        <p className="text-xs text-gray-400">Remover histórico de sessões antigas</p>
                                    </div>
                                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                        Limpar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
