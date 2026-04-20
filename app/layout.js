import "./globals.css";
import BackgroundParticles from "@/components/BackgroundParticles";
import HeaderNav from "@/components/HeaderNav";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "GameOver",
  description: "Digital Games Store",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-background font-body antialiased selection:bg-neon/30 selection:text-white">
        <div className="relative min-h-screen flex flex-col">
          
          {/* CAPA DE FONDO: Partículas + Grid + Gradiente */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <BackgroundParticles />
            <div className="absolute inset-0 bg-hero-grid bg-[length:50px_50px] opacity-[0.15]" />
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-background to-background" />
          </div>

          {/* ESTRUCTURA DE CONTENIDO */}
          <div className="relative z-10 flex flex-col min-h-screen">
            
            {/* HEADER: Glassmorphism mejorado */}
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/40 backdrop-blur-md transition-all duration-300">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between md:h-24">
                  
                  {/* LOGO AREA */}
                  <Link href="/" className="group flex items-center gap-2 md:gap-4">
                    <div className="relative flex items-center justify-center">
                      {/* Aura dinámica */}
                      <div className="absolute h-24 w-24 rounded-full bg-neon/20 blur-[30px] transition-all duration-500 group-hover:bg-neon/40 group-hover:blur-[40px]" />
                      
                      <div className="relative h-28 w-28 md:h-30 md:w-30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[5deg]">
                        <Image
                          src="/LogoWebGameOver1.png" 
                          alt="GameOver Logo"
                          fill
                          className="object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]"
                          priority
                        />
                      </div>
                    </div>

                    <div className="flex flex-col leading-none">
                      <span className="font-display text-lg md:text-xl uppercase tracking-[0.25em] text-white drop-shadow-neon">
                        GameOver
                      </span>
                      <span className="mt-1 text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-neonSoft">
                        Digital Games Store
                      </span>
                    </div>
                  </Link>

                  {/* NAVEGACIÓN */}
                  <HeaderNav />
                </div>
              </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="flex-grow relative">
              {children}
            </main>

            {/* FOOTER: Minimalista y elegante */}
            <footer className="mt-auto border-t border-white/5 bg-black/20 py-10 backdrop-blur-sm">
              <div className="mx-auto max-w-7xl px-4 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-px w-12 bg-neon/50" />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted/60">
                    © {new Date().getFullYear()} GameOver Continue • Caracas, Venezuela
                  </p>
                  <div className="flex gap-6 text-[9px] uppercase tracking-widest text-muted/40">
                    <span className="hover:text-neon transition-colors cursor-default">PS4</span>
                    <span className="hover:text-neon transition-colors cursor-default">PS5</span>
                    <span className="hover:text-neon transition-colors cursor-default">Switch</span>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}