import PageHero from "@/components/PageHero";
import ProductCarousel from "@/components/ProductCarousel";
import SectionHeader from "@/components/SectionHeader";
import HowItWorks from "@/components/HowItWorks";
import CategoryCards from "@/components/CategoryCards";
import BackgroundParticles from "@/components/BackgroundParticles";
import { getAllGames } from "@/lib/catalog";

export const dynamic = "force-dynamic";

/**
 * Lógica para filtrar juegos destacados configurados desde el AdminDashboard.
 */
function getFeaturedGames(games) {
  const featured = games.filter(g => g.isFeatured === true);
  
  if (featured.length === 0) {
    return games.slice(-5);
  }
  
  return featured;
}

export default async function HomePage() {
  const games = await getAllGames();
  const featuredGames = getFeaturedGames(games);

  return (
    <main className="min-h-screen bg-black selection:bg-purple-500/30 overflow-hidden relative">
      
      {/* FONDO ANIMADO DE CHAMPIÑONES */}
      <BackgroundParticles />

      {/* 1. HERO CON GLOW MÁGICO DE FONDO */}
      <div className="relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-purple-900/30 blur-[120px] rounded-full pointer-events-none" />
        
        <PageHero
          eyebrow="¡ PRESS START !"
          title="TU PORTAL DE JUEGOS DIGITALES"
          description="Olvida los discos y las esperas. Accede a los estrenos más brutales de PS4, PS5 y Switch con entrega inmediata. Tu próxima aventura a un WhatsApp de distancia."
          primaryAction={{ href: "/packs/nintendo", label: "Explorar Switch" }}
          secondaryAction={{ href: "/individuales/ps5", label: "Catálogo PS5" }}
        />

        {/* 🔥 TRUST BADGES (NUEVO DISEÑO: TARJETAS FLOTANTES) 🔥 */}
        <div className="relative z-20 max-w-6xl mx-auto px-6 -mt-8 md:-mt-12 mb-20 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Tarjeta 1: Entrega Inmediata (Amarillo) */}
            <div className="group relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 hover:border-yellow-500/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(250,204,21,0.1)] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all duration-500">
                  ⚡
                </div>
                <div>
                  <h4 className="text-white font-display uppercase tracking-widest text-sm md:text-base font-bold mb-2">Entrega Inmediata</h4>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">Tu juego listo en cuestión de minutos. Sin largas esperas ni descargas complicadas.</p>
                </div>
              </div>
            </div>

            {/* Tarjeta 2: Soporte Activo (Azul/Morado) */}
            <div className="group relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(168,85,247,0.1)] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-500">
                  🎮
                </div>
                <div>
                  <h4 className="text-white font-display uppercase tracking-widest text-sm md:text-base font-bold mb-2">Soporte Activo</h4>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">Atención personalizada y directa vía WhatsApp para resolver cualquier duda.</p>
                </div>
              </div>
            </div>

            {/* Tarjeta 3: 100% Garantizado (Verde) */}
            <div className="group relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 hover:border-green-500/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col items-start gap-5">
                <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(34,197,94,0.1)] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-500">
                  🔒
                </div>
                <div>
                  <h4 className="text-white font-display uppercase tracking-widest text-sm md:text-base font-bold mb-2">100% Garantizado</h4>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">Cuentas seguras, originales y estables. Tu inversión está totalmente protegida.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. CATÁLOGO DESTACADO */}
      <section className="relative py-20 border-y border-white/5 bg-black/40 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <SectionHeader
            eyebrow="TENDENCIAS"
            title="DESTACADOS DE LA SEMANA"
            description="Los títulos que están rompiendo récords. No te quedes fuera de la conversación."
          />
        </div>
        <div className="mt-12 relative z-20">
          <ProductCarousel products={featuredGames} />
        </div>
      </section>

      {/* 3. CÓMO COMPRAR */}
      <div className="relative z-10 bg-black/80 backdrop-blur-md pt-10">
        <HowItWorks />
      </div>

      {/* 4. NAVEGACIÓN POR CATEGORÍAS */}
      <section className="py-24 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <CategoryCards />
        </div>
      </section>
      
    </main>
  );
}