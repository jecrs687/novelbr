import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    ArrowLeft,
    Edit,
    Trash2,
    Mail,
    Calendar,
    MapPin,
    Globe,
    BookOpen,
    Star,
    MessageSquare,
    Heart,
    Clock,
    Award,
} from 'lucide-react';

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getUser(id: string) {
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            favorites: {
                take: 5,
                include: { novel: { select: { id: true, title: true, slug: true, coverImage: true } } },
                orderBy: { createdAt: 'desc' },
            },
            reviews: {
                take: 5,
                include: { novel: { select: { id: true, title: true, slug: true } } },
                orderBy: { createdAt: 'desc' },
            },
            comments: {
                take: 5,
                include: { chapter: { include: { novel: { select: { title: true } } } } },
                orderBy: { createdAt: 'desc' },
            },
            readingProgress: {
                take: 5,
                include: { novel: { select: { id: true, title: true, slug: true, coverImage: true } } },
                orderBy: { lastReadAt: 'desc' },
            },
            achievements: {
                include: { achievement: true },
                orderBy: { unlockedAt: 'desc' },
            },
            _count: {
                select: {
                    favorites: true,
                    reviews: true,
                    comments: true,
                    readingProgress: true,
                    achievements: true,
                    readingSessions: true,
                },
            },
        },
    });

    return user;
}

export default async function UserDetailPage({ params }: PageProps) {
    const { id } = await params;
    const user = await getUser(id);

    if (!user) {
        notFound();
    }

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/bko/users"
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Detalhes do Usuário</h1>
                        <p className="text-gray-400 mt-1">@{user.username}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={`/bko/users/${id}/edit`}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        Editar
                    </Link>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                        <Trash2 className="h-4 w-4" />
                        Excluir
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center mb-4">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.username} className="h-full w-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold text-white">
                                        {(user.displayName?.[0] || user.username[0]).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-white">{user.displayName || user.username}</h2>
                            <p className="text-gray-400">@{user.username}</p>

                            {user.bio && (
                                <p className="mt-4 text-sm text-gray-300">{user.bio}</p>
                            )}

                            <div className="w-full mt-6 space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span>{user.email}</span>
                                </div>
                                {user.location && (
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <span>{user.location}</span>
                                    </div>
                                )}
                                {user.website && (
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Globe className="h-4 w-4 text-gray-400" />
                                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                                            {user.website}
                                        </a>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <span>Cadastrado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                                </div>
                                {user.lastLoginAt && (
                                    <div className="flex items-center gap-3 text-sm text-gray-300">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span>Último acesso: {new Date(user.lastLoginAt).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="rounded-xl bg-gray-800 border border-gray-700 p-6 mt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Estatísticas</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 rounded-lg bg-gray-700">
                                <Heart className="h-5 w-5 text-red-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-white">{user._count.favorites}</p>
                                <p className="text-xs text-gray-400">Favoritos</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-gray-700">
                                <Star className="h-5 w-5 text-yellow-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-white">{user._count.reviews}</p>
                                <p className="text-xs text-gray-400">Reviews</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-gray-700">
                                <MessageSquare className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-white">{user._count.comments}</p>
                                <p className="text-xs text-gray-400">Comentários</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-gray-700">
                                <Award className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-white">{user._count.achievements}</p>
                                <p className="text-xs text-gray-400">Conquistas</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Reading Progress */}
                    <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Lendo Atualmente</h3>
                        {user.readingProgress.length > 0 ? (
                            <div className="space-y-4">
                                {user.readingProgress.map((progress) => (
                                    <div key={progress.id} className="flex items-center gap-4">
                                        <div className="h-12 w-9 rounded bg-gray-700 overflow-hidden flex-shrink-0">
                                            {progress.novel.coverImage ? (
                                                <img src={progress.novel.coverImage} alt={progress.novel.title} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <BookOpen className="h-4 w-4 text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{progress.novel.title}</p>
                                            <p className="text-xs text-gray-400">Capítulo {progress.chapterNumber}</p>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(progress.lastReadAt).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">Nenhuma leitura em progresso</p>
                        )}
                    </div>

                    {/* Recent Reviews */}
                    <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Reviews Recentes</h3>
                        {user.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {user.reviews.map((review) => (
                                    <div key={review.id} className="p-4 rounded-lg bg-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium text-white">{review.novel.title}</p>
                                            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-indigo-400 mb-1">{review.title}</p>
                                        <p className="text-sm text-gray-300 line-clamp-2">{review.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">Nenhuma review escrita</p>
                        )}
                    </div>

                    {/* Recent Comments */}
                    <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Comentários Recentes</h3>
                        {user.comments.length > 0 ? (
                            <div className="space-y-4">
                                {user.comments.map((comment) => (
                                    <div key={comment.id} className="p-4 rounded-lg bg-gray-700">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm font-medium text-white">
                                                {comment.chapter.novel.title} - Cap. {comment.chapter.chapterNumber}
                                            </p>
                                            <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <p className="text-sm text-gray-300 line-clamp-2">{comment.content}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">Nenhum comentário feito</p>
                        )}
                    </div>

                    {/* Achievements */}
                    <div className="rounded-xl bg-gray-800 border border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Conquistas</h3>
                        {user.achievements.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {user.achievements.map((ua) => (
                                    <div key={ua.id} className="text-center p-4 rounded-lg bg-gray-700">
                                        <div className="h-12 w-12 rounded-full bg-yellow-600/20 flex items-center justify-center mx-auto mb-2">
                                            <Award className="h-6 w-6 text-yellow-400" />
                                        </div>
                                        <p className="text-sm font-medium text-white">{ua.achievement.name}</p>
                                        <p className="text-xs text-gray-400 mt-1">{ua.achievement.points} pts</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm">Nenhuma conquista desbloqueada</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
