import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function PageHero({ eyebrow, title, description, primaryAction, secondaryAction }) {
  // Generamos el link de WhatsApp dinámicamente
  const whatsappLink = buildWhatsAppLink("584242518228", {
    title: "Catálogo General"
  });

  return (
    <section className="section-shell py-20">
      <div className="glass-panel panel grid gap-10 overflow-hidden border-neon/30 p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:p-10">
        <div>
          <p className="font-display text-sm uppercase tracking-[0.35em] text-neonSoft">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl uppercase leading-none tracking-[0.14em] text-text md:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{description}</p>

          {(primaryAction || secondaryAction) && (
            <div className="mt-8 flex flex-wrap gap-4">
              {primaryAction ? (
                <a
                  href={primaryAction.href}
                  className="border border-neon bg-neon px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-background transition hover:bg-background hover:text-neon"
                >
                  {primaryAction.label}
                </a>
              ) : null}
              {secondaryAction ? (
                <a
                  href={secondaryAction.href}
                  className="border border-border px-6 py-4 text-sm font-bold uppercase tracking-[0.22em] text-text transition hover:border-neon hover:text-neon"
                >
                  {secondaryAction.label}
                </a>
              ) : null}
            </div>
          )}
        </div>

        {/* COLUMNA DE INFORMACIÓN Y REDES */}
        <div className="grid gap-4">
          
          {/* 1. SECCIÓN DE CONSOLAS (AHORA DE PRIMERO) */}
          <div className="border border-white/10 bg-background/70 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Consolas</p>
            <p className="mt-2 text-xl font-semibold text-neon">Nintendo Switch - PS4 - PS5</p>
          </div>

          {/* 2. SECCIÓN DE REDES SOCIALES */}
          <div className="border border-neon/20 bg-background/90 p-5 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neonSoft">Nuestras Redes</p>
            <div className="mt-4 flex items-center gap-6">
              {/* WhatsApp */}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" 
                 className="flex flex-col items-center gap-2 group">
                <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 transition group-hover:border-green-500 group-hover:text-green-500">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884 0 2.225.569 3.807 1.595 5.428l-.999 3.652 3.893-.981z"/></svg>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted group-hover:text-white">WA</span>
              </a>

              {/* Instagram */}
              <a href="https://www.instagram.com/gameover.continue/" target="_blank" rel="noopener noreferrer" 
                 className="flex flex-col items-center gap-2 group">
                <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 transition group-hover:border-pink-500 group-hover:text-pink-500">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c.796 0 1.441.645 1.441 1.44s-.645 1.44-1.441 1.44-1.44-.645-1.44-1.44.645-1.44 1.44-1.44z"/></svg>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted group-hover:text-white">IG</span>
              </a>

              {/* Facebook */}
              <a href="https://www.facebook.com/profile.php?id=61585993964975" target="_blank" rel="noopener noreferrer" 
                 className="flex flex-col items-center gap-2 group">
                <div className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/5 transition group-hover:border-blue-500 group-hover:text-blue-500">
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted group-hover:text-white">FB</span>
              </a>
            </div>
          </div>

          <div className="border border-white/10 bg-background/70 p-5 text-sm uppercase tracking-[0.2em] text-muted text-center">
            Atención Directa • Soporte VIP
          </div>

        </div>
      </div>
    </section>
  );
}