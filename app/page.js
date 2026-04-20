import PageHero from "@/components/PageHero";
import ProductCarousel from "@/components/ProductCarousel";
import SectionHeader from "@/components/SectionHeader";
import HowItWorks from "@/components/HowItWorks";
import CategoryCards from "@/components/CategoryCards";
import { getAllGames } from "@/lib/catalog";

export const dynamic = "force-dynamic";

/**
 * Lógica para filtrar juegos destacados configurados desde el AdminDashboard.
 */
function getFeaturedGames(games) {
  const featured = games.filter(g => g.isFeatured === true);
  
  // UX Fallback: Si no hay destacados, mostramos los últimos 5.
  if (featured.length === 0) {
    return games.slice(-5);
  }
  
  return featured;
}

export default async function HomePage() {
  // Cargamos los datos reales de Firebase
  const games = await getAllGames();
  const featuredGames = getFeaturedGames(games);

  return (
    <>
      {/* 1. HERO: El primer impacto visual */}
      <PageHero
        eyebrow="¡ Level Up !"
        title="JUEGOS DIGITALES"
        description="Olvida los discos. Accede a los estrenos más brutales de PS4, PS5 y Switch con entrega inmediata. Tu próxima aventura comienza con un mensaje de WhatsApp."
        primaryAction={{ href: "/packs/nintendo", label: "Explorar Packs Switch" }}
        secondaryAction={{ href: "/individuales/ps5", label: "Catálogo PS5" }}
      />

      {/* 2. CATÁLOGO DESTACADO: Ahora de primero para incentivar la compra inmediata */}
      <section className="py-16 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <SectionHeader
            eyebrow="Novedades y Más Vendidos"
            title="Catálogo Destacado"
            description="Los títulos que están rompiendo récords esta semana."
          />
        </div>
        
        <ProductCarousel products={featuredGames} />
      </section>

      {/* 3. CÓMO COMPRAR: Explicación del proceso después de ver los juegos */}
      <HowItWorks />

      {/* 4. NAVEGACIÓN POR CATEGORÍAS: El cierre de la página */}
      <CategoryCards />
    </>
  );
}