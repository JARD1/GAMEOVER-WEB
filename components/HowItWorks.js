import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function HowItWorks() {
  const whatsappLink = buildWhatsAppLink("584242518228", {
    title: "Información de Compra"
  });

  return (
    <section className="py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-12">
          <p className="font-display text-sm uppercase tracking-[0.35em] text-neonSoft">Proceso Simple</p>
          <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.14em] text-text">¿Cómo Comprar?</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Paso 1 */}
          <div className="glass-panel p-8 text-center rounded-lg border border-white/10 hover:border-neon/50 transition-colors">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neon/20 border border-neon text-2xl font-bold text-neon mb-6">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Elige tu Juego</h3>
            <p className="text-muted text-sm leading-relaxed">Navega por nuestro catálogo actualizado y selecciona el juego o pack que deseas.</p>
          </div>

          {/* Paso 2 */}
          <div className="glass-panel p-8 text-center rounded-lg border border-white/10 hover:border-neon/50 transition-colors">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neon/20 border border-neon text-2xl font-bold text-neon mb-6">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Contáctanos</h3>
            <p className="text-muted text-sm leading-relaxed">Envíanos un mensaje directo por WhatsApp para confirmar disponibilidad y método de pago.</p>
          </div>

          {/* Paso 3 */}
          <div className="glass-panel p-8 text-center rounded-lg border border-white/10 hover:border-neon/50 transition-colors">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neon/20 border border-neon text-2xl font-bold text-neon mb-6">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-3">¡A Jugar!</h3>
            <p className="text-muted text-sm leading-relaxed">Recibe los datos y las instrucciones paso a paso para descargar y jugar inmediatamente.</p>
          </div>
        </div>

        <div className="mt-12 text-center">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block border border-green-500 bg-green-500/10 px-8 py-3 text-sm font-bold uppercase tracking-[0.2em] text-green-400 transition hover:bg-green-500 hover:text-white">
                Contactar a Soporte
            </a>
        </div>
      </div>
    </section>
  );
}