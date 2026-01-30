import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NovelBR - Leia Novels Online",
  description:
    "Leia suas light novels e web novels favoritas traduzidas para o português. Uma experiência de leitura moderna e confortável.",
  keywords: ["novel", "light novel", "web novel", "português", "leitura online"],
  authors: [{ name: "NovelBR" }],
  openGraph: {
    title: "NovelBR - Leia Novels Online",
    description: "Leia suas light novels e web novels favoritas traduzidas para o português.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('novelbr-theme');
                  if (stored) {
                    var parsed = JSON.parse(stored);
                    var theme = parsed.state?.theme || 'dark';
                    document.documentElement.classList.add(theme);
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ToastProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1 lg:ml-72 min-h-screen">
                <div className="p-4 lg:p-8 lg:pt-6">
                  {children}
                </div>
              </main>
            </div>
            <ScrollToTop />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
