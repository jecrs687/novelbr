"use client";

import { useThemeStore, useReaderStore, useReadingProgressStore } from "@/lib/store";
import {
  Settings,
  Sun,
  Moon,
  Type,
  AlignLeft,
  RotateCcw,
  Trash2,
  Github,
  Heart,
  BookOpen,
  Monitor,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const {
    fontSize,
    lineHeight,
    fontFamily,
    increaseFontSize,
    decreaseFontSize,
    setLineHeight,
    setFontFamily,
    resetSettings,
  } = useReaderStore();
  const { progress, favorites, clearAllProgress } = useReadingProgressStore();

  const fontFamilies = [
    { value: "Georgia, serif", label: "Georgia" },
    { value: "'Times New Roman', serif", label: "Times New Roman" },
    { value: "system-ui, sans-serif", label: "System UI" },
    { value: "'Roboto', sans-serif", label: "Roboto" },
    { value: "'Open Sans', sans-serif", label: "Open Sans" },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Settings className="text-primary" size={28} />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Configurações
            </h1>
            <p className="text-muted-foreground">
              Personalize sua experiência de leitura
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Theme Settings */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Monitor size={22} />
            Aparência
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <Sun size={32} className={theme === "light" ? "text-primary" : ""} />
              <span className="font-medium">Claro</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <Moon size={32} className={theme === "dark" ? "text-primary" : ""} />
              <span className="font-medium">Escuro</span>
            </button>
          </div>
        </section>

        {/* Reader Settings */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <BookOpen size={22} />
            Leitura
          </h2>

          <div className="space-y-6">
            {/* Font Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                  <Type size={18} className="text-muted-foreground" />
                  Tamanho da Fonte
                </label>
                <span className="text-sm text-muted-foreground">{fontSize}px</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 12}
                  className="p-2 bg-muted rounded-lg hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  A-
                </button>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${((fontSize - 12) / 20) * 100}%` }}
                  />
                </div>
                <button
                  onClick={increaseFontSize}
                  disabled={fontSize >= 32}
                  className="p-2 bg-muted rounded-lg hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Line Height */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-medium text-card-foreground">
                  <AlignLeft size={18} className="text-muted-foreground" />
                  Espaçamento de Linha
                </label>
                <span className="text-sm text-muted-foreground">{lineHeight.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            {/* Font Family */}
            <div>
              <label className="text-sm font-medium text-card-foreground block mb-3">
                Fonte
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {fontFamilies.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => setFontFamily(font.value)}
                    className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                      fontFamily === font.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetSettings}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-border rounded-xl hover:bg-muted transition-colors text-muted-foreground"
            >
              <RotateCcw size={18} />
              <span>Restaurar Padrões</span>
            </button>
          </div>
        </section>

        {/* Data Management */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Heart size={22} />
            Dados
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <p className="font-medium text-card-foreground">
                  Progresso de Leitura
                </p>
                <p className="text-sm text-muted-foreground">
                  {Object.keys(progress).length} novels em andamento
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <p className="font-medium text-card-foreground">
                  Favoritos
                </p>
                <p className="text-sm text-muted-foreground">
                  {favorites.length} novels salvos
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (
                  confirm(
                    "Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita."
                  )
                ) {
                  clearAllProgress();
                }
              }}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors"
            >
              <Trash2 size={18} />
              <span>Limpar Todos os Dados</span>
            </button>
          </div>
        </section>

        {/* About */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">
            Sobre
          </h2>

          <div className="space-y-4">
            <p className="text-muted-foreground">
              NovelBR é uma plataforma de leitura de novels traduzidas para
              português. Este projeto foi criado para proporcionar uma
              experiência de leitura moderna e confortável.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://github.com/jecrs687/novelbr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
            </div>

            <p className="text-sm text-muted-foreground pt-4 border-t border-border">
              Versão 2.0.0 • Next.js 16.1 • Tailwind CSS
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
