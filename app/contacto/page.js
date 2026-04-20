import PageHero from "@/components/PageHero";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import Link from "next/link";

export default function ContactoPage() {
  const generalContactLink = buildWhatsAppLink("584242518228", {
    title: "Catálogo General de GameOver"
  });

  return (
    <>
      <PageHero
        eyebrow="Soporte y Ventas"
        title="Atención inmediata vía WhatsApp"
        description="¿Listo para jugar? Nuestro equipo está online para procesar tu pedido, coordinar instalaciones y resolver dudas técnicas en tiempo real."
        primaryAction={{ href: generalContactLink, label: "Iniciar Chat Directo" }}
        secondaryAction={{ href: "/", label: "Explorar Juegos" }}
      />

      <section className="section-shell pt-0 pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* COLUMNA IZQUIERDA: MENSAJE Y ACCIÓN */}
          <div className="flex flex-col space-y-6">
            <div className="glass-panel panel p-8 relative overflow-hidden group">
              {/* Decoración de fondo */}
              <div className="absolute -right-10 -top-10 h-32 w-32 bg-purple-600/10 blur-3xl rounded-full transition-all group-hover:bg-purple-600/20" />
              
              <p className="font-display text-sm uppercase tracking-[0.35em] text-purple-400">Proceso VIP</p>
              <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.15em] text-white">
                Solicitud en un solo paso
              </h2>
              <p className="mt-4 text-lg text-muted leading-relaxed">
                Al elegir un juego de nuestra vitrina, se genera un enlace inteligente. Recibimos los detalles exactos para que solo tengas que confirmar el pago.
              </p>
              
              <div className="mt-8 space-y-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-muted">Ejemplo de solicitud:</p>
                <div className="border-l-2 border-purple-500 bg-white/5 p-5 text-lg italic text-purple-200">
                  "Hola GameOver, me interesa el pack de Zelda para Switch de $35"
                </div>
              </div>

              {/* EL BOTÓN DE CONTACTO PRINCIPAL */}
              <div className="mt-10">
                <Link 
                  href={generalContactLink}
                  className="inline-flex w-full items-center justify-center gap-4 bg-purple-600 px-8 py-5 text-sm font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] md:w-auto"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884 0 2.225.569 3.807 1.595 5.428l-.999 3.652 3.893-.981z"/>
                  </svg>
                  Hablar con un asesor ahora
                </Link>
                <p className="mt-4 text-center text-[10px] uppercase tracking-widest text-muted md:text-left">
                  Respuesta promedio: Menos de 5 minutos
                </p>
              </div>
            </div>

            {/* BOX DE NÚMERO DIRECTO */}
            <div className="border border-white/5 bg-black/40 p-8 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted">WhatsApp Business</p>
                <p className="text-2xl font-bold text-white">+58 424 251 8228</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: RECOMENDACIONES */}
          <div className="space-y-6">
            <h3 className="font-display text-xl uppercase tracking-widest px-2">Antes de contactar</h3>
            <div className="grid gap-4">
              {[
                { 
                  title: "Almacenamiento", 
                  desc: "Verifica que tu PS4, PS5 o Switch tenga el espacio necesario para el juego que deseas." 
                },
                { 
                  title: "Conexión", 
                  desc: "Recomendamos tener una buena conexión a internet para una descarga e instalación más rápida." 
                },
                { 
                  title: "Horarios", 
                  desc: "Atendemos solicitudes todos los días. Las instalaciones se coordinan tras el pago." 
                }
              ].map((item, i) => (
                <div key={i} className="panel bg-white/[0.02] p-6 border-l-2 border-purple-500/30 hover:border-purple-500 transition-colors">
                  <p className="text-[11px] font-bold uppercase tracking-tighter text-purple-400 mb-1">{item.title}</p>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* SECCIÓN DE SEGURIDAD */}
            <div className="panel p-8 bg-gradient-to-br from-purple-900/20 to-transparent border-purple-500/20">
              <h4 className="font-display text-sm uppercase text-white mb-2">Compra Segura</h4>
              <p className="text-xs text-muted">
                Todos nuestros juegos cuentan con garantia mediante los terminos y condiciones de uso.
              </p>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}