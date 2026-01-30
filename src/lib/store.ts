import { create } from "zustand";
import { persist } from "zustand/middleware";

// Theme Store
interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "novelbr-theme",
    }
  )
);

// Reader Settings Store
interface ReaderSettings {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
}

interface ReaderState extends ReaderSettings {
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setFontFamily: (family: string) => void;
  resetSettings: () => void;
}

const defaultReaderSettings: ReaderSettings = {
  fontSize: 18,
  lineHeight: 1.8,
  fontFamily: "Georgia, serif",
};

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      ...defaultReaderSettings,
      increaseFontSize: () =>
        set((state) => ({
          fontSize: Math.min(state.fontSize + 2, 32),
        })),
      decreaseFontSize: () =>
        set((state) => ({
          fontSize: Math.max(state.fontSize - 2, 12),
        })),
      setFontSize: (size) =>
        set({ fontSize: Math.max(12, Math.min(32, size)) }),
      setLineHeight: (height) =>
        set({ lineHeight: Math.max(1, Math.min(3, height)) }),
      setFontFamily: (family) => set({ fontFamily: family }),
      resetSettings: () => set(defaultReaderSettings),
    }),
    {
      name: "novelbr-reader",
    }
  )
);

// Reading Progress Store
interface ReadingProgressEntry {
  novelName: string;
  chapterIndex: number;
  lastRead: string;
  scrollPosition?: number;
}

interface ReadingProgressState {
  progress: Record<string, ReadingProgressEntry>;
  favorites: string[];
  getProgress: (novelName: string) => ReadingProgressEntry | undefined;
  updateProgress: (entry: ReadingProgressEntry) => void;
  toggleFavorite: (novelName: string) => void;
  isFavorite: (novelName: string) => boolean;
  clearProgress: (novelName: string) => void;
  clearAllProgress: () => void;
}

export const useReadingProgressStore = create<ReadingProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      favorites: [],
      getProgress: (novelName) => get().progress[novelName],
      updateProgress: (entry) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [entry.novelName]: entry,
          },
        })),
      toggleFavorite: (novelName) =>
        set((state) => ({
          favorites: state.favorites.includes(novelName)
            ? state.favorites.filter((n) => n !== novelName)
            : [...state.favorites, novelName],
        })),
      isFavorite: (novelName) => get().favorites.includes(novelName),
      clearProgress: (novelName) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [novelName]: _removed, ...rest } = state.progress;
          return { progress: rest };
        }),
      clearAllProgress: () => set({ progress: {}, favorites: [] }),
    }),
    {
      name: "novelbr-progress",
    }
  )
);

// Search Store
interface SearchState {
  query: string;
  recentSearches: string[];
  setQuery: (query: string) => void;
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      query: "",
      recentSearches: [],
      setQuery: (query) => set({ query }),
      addRecentSearch: (search) =>
        set((state) => {
          const filtered = state.recentSearches.filter((s) => s !== search);
          return {
            recentSearches: [search, ...filtered].slice(0, 10),
          };
        }),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "novelbr-search",
    }
  )
);

// UI Store (non-persisted)
interface UIState {
  isSidebarOpen: boolean;
  isReaderMenuOpen: boolean;
  toggleSidebar: () => void;
  toggleReaderMenu: () => void;
  setSidebarOpen: (open: boolean) => void;
  setReaderMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isReaderMenuOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleReaderMenu: () =>
    set((state) => ({ isReaderMenuOpen: !state.isReaderMenuOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setReaderMenuOpen: (open) => set({ isReaderMenuOpen: open }),
}));

// Favorites Store (dedicated store for favorites management)
interface FavoritesState {
  favorites: string[];
  addFavorite: (novelName: string) => void;
  removeFavorite: (novelName: string) => void;
  toggleFavorite: (novelName: string) => void;
  isFavorite: (novelName: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (novelName) =>
        set((state) => ({
          favorites: state.favorites.includes(novelName)
            ? state.favorites
            : [...state.favorites, novelName],
        })),
      removeFavorite: (novelName) =>
        set((state) => ({
          favorites: state.favorites.filter((n) => n !== novelName),
        })),
      toggleFavorite: (novelName) =>
        set((state) => ({
          favorites: state.favorites.includes(novelName)
            ? state.favorites.filter((n) => n !== novelName)
            : [...state.favorites, novelName],
        })),
      isFavorite: (novelName) => get().favorites.includes(novelName),
      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: "novelbr-favorites",
    }
  )
);

// User Store (for authentication)
interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Demo user for development - remove in production with real auth
const DEMO_USER: User = {
  id: "demo-user-001",
  email: "demo@novelbr.com",
  username: "leitor_demo",
  displayName: "Leitor Demo",
  avatarUrl: undefined,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: DEMO_USER, // Start with demo user for development
      isAuthenticated: true, // Demo mode starts authenticated
      isLoading: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "novelbr-user",
    }
  )
);
