"use client";

import { useState } from "react";
import { useReaderStore, useThemeStore } from "@/lib/store";
import {
  Settings,
  Plus,
  Minus,
  Sun,
  Moon,
  RotateCcw,
  X,
  Type,
  AlignJustify,
  Palette,
} from "lucide-react";

export function ReaderControls() {
  const [isOpen, setIsOpen] = useState(false);
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
  const { theme, toggleTheme } = useThemeStore();

  const fontFamilies = [
    { value: "Georgia, serif", label: "Georgia" },
    { value: "'Times New Roman', serif", label: "Times" },
    { value: "system-ui, sans-serif", label: "System" },
    { value: "'Merriweather', serif", label: "Merriweather" },
    { value: "'Lora', serif", label: "Lora" },
  ];

  const lineHeights = [
    { value: 1.5, label: "Compacto" },
    { value: 1.8, label: "Normal" },
    { value: 2.0, label: "Confortável" },
    { value: 2.2, label: "Espaçoso" },
  ];

  return (
    <div className="mb-8">
      {/* Toggle Button */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${isOpen
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
              : "bg-card border border-border hover:border-primary/50 hover:bg-card-hover"
            }`}
        >
          <Settings size={18} className={isOpen ? "animate-spin" : ""} />
          <span>Configurações</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-3 bg-card border border-border rounded-xl hover:border-primary/50 transition-all"
          title={theme === "dark" ? "Modo claro" : "Modo escuro"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Settings Panel */}
      {isOpen && (
        <div className="mt-6 animate-fadeInDown">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Palette size={18} className="text-primary" />
                Personalizar Leitura
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetSettings}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  title="Restaurar padrões"
                >
                  <RotateCcw size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-6">
              {/* Font Size */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Type size={16} className="text-muted-foreground" />
                    Tamanho do Texto
                  </label>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    {fontSize}px
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseFontSize}
                    disabled={fontSize <= 12}
                    className="p-2.5 bg-muted rounded-xl hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                      style={{ width: `${((fontSize - 12) / 20) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={increaseFontSize}
                    disabled={fontSize >= 32}
                    className="p-2.5 bg-muted rounded-xl hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Line Height */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlignJustify size={16} className="text-muted-foreground" />
                  <label className="text-sm font-medium text-foreground">
                    Espaçamento entre Linhas
                  </label>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {lineHeights.map((lh) => (
                    <button
                      key={lh.value}
                      onClick={() => setLineHeight(lh.value)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${lineHeight === lh.value
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {lh.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Type size={16} className="text-muted-foreground" />
                  <label className="text-sm font-medium text-foreground">
                    Fonte
                  </label>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {fontFamilies.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setFontFamily(font.value)}
                      className={`px-3 py-2 rounded-xl text-sm transition-all ${fontFamily === font.value
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      style={{ fontFamily: font.value }}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Toggle */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette size={16} className="text-muted-foreground" />
                  <label className="text-sm font-medium text-foreground">
                    Tema
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => theme !== "light" && toggleTheme()}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${theme === "light"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Sun size={18} />
                    Claro
                  </button>
                  <button
                    onClick={() => theme !== "dark" && toggleTheme()}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${theme === "dark"
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Moon size={18} />
                    Escuro
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
