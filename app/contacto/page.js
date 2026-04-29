"use client";

import PageHero from "@/components/PageHero";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import Link from "next/link";

export default function ContactoPage() {
  const generalContactLink = buildWhatsAppLink("584242518228", {
    title: "Catálogo General de GameOver"
  });
  
  // 🔴 AQUÍ DEBES PONER TUS LINKS REALES DE REDES SOCIALES
  const facebookLink = "https://www.facebook.com/"; 
  const instagramLink = "https://www.instagram.com/";

  return (
    <main className="min-h-screen bg-black overflow-hidden relative">
      
      {/* Luz de fondo sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10">
        <PageHero
          eyebrow="Soporte y Ventas"
          title="CONECTA CON NOSOTROS"
          description="¿Listo para jugar? Nuestro equipo está online para procesar tu pedido, coordinar instalaciones y resolver dudas técnicas al instante."
          primaryAction={{ href: generalContactLink, label: "Chat de Ventas" }}
          secondaryAction={{ href: "/", label: "Volver al Inicio" }}
        />
      </div>

      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-24 -mt-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* COLUMNA IZQUIERDA: CANALES DE CONTACTO OFICIALES */}
          <div className="flex flex-col space-y-6">
            
            <h2 className="font-display text-xl md:text-2xl uppercase tracking-widest text-white mb-2">
              Nuestros Canales
            </h2>

            {/* 1. TARJETA WHATSAPP */}
            <div className="group relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-500 overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <p className="font-display text-sm uppercase tracking-[0.3em] text-green-400 font-bold">WhatsApp Business</p>
                  </div>
                  <h3 className="text-3xl font-bold text-white tracking-wider">+58 424 251 8228</h3>
                  <p className="mt-2 text-sm text-gray-400">Atención directa, rápida y sin intermediarios.</p>
                </div>
                
                <Link 
                  href={generalContactLink}
                  target="_blank"
                  className="w-full md:w-auto flex items-center justify-center gap-3 bg-green-600/20 border border-green-500 hover:bg-green-600 px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884 0 2.225.569 3.807 1.595 5.428l-.999 3.652 3.893-.981z"/>
                  </svg>
                  Escribir
                </Link>
              </div>
            </div>

            {/* 2. TARJETA INSTAGRAM */}
            <div className="group relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-pink-500/50 transition-all duration-500 overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <p className="font-display text-sm uppercase tracking-[0.3em] text-pink-400 font-bold mb-2">Social</p>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider">Instagram</h3>
                  <p className="mt-2 text-sm text-gray-400">Nuestro día a día, clientes felices, historias y promociones relámpago.</p>
                </div>
                
                <Link 
                  href={instagramLink}
                  target="_blank"
                  className="w-full md:w-auto flex items-center justify-center gap-3 bg-pink-600/20 border border-pink-500 hover:bg-pink-600 px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  Seguir Perfil
                </Link>
              </div>
            </div>

            {/* 3. TARJETA FACEBOOK */}
            <div className="group relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-500 overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <p className="font-display text-sm uppercase tracking-[0.3em] text-blue-400 font-bold mb-2">Comunidad</p>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-wider">Facebook Oficial</h3>
                  <p className="mt-2 text-sm text-gray-400">Síguenos para sorteos, anuncios oficiales y referencias de clientes.</p>
                </div>
                
                <Link 
                  href={facebookLink}
                  target="_blank"
                  className="w-full md:w-auto flex items-center justify-center gap-3 bg-blue-600/20 border border-blue-500 hover:bg-blue-600 px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
                >
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Visitar Página
                </Link>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: RECOMENDACIONES */}
          <div className="space-y-6 pt-2">
            <h3 className="font-display text-xl uppercase tracking-widest text-white px-2">Antes de contactar</h3>
            
            <div className="grid gap-4">
              {[
                { 
                  title: "Almacenamiento", 
                  desc: "Verifica que tu consola tenga el espacio necesario para el juego que deseas instalar." 
                },
                { 
                  title: "Conexión", 
                  desc: "Recomendamos tener una conexión estable a internet para una descarga rápida y sin errores." 
                },
                { 
                  title: "Horarios", 
                  desc: "Atendemos solicitudes todos los días. Las instalaciones se coordinan inmediatamente tras el pago." 
                }
              ].map((item, i) => (
                <div key={i} className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/5 border-l-2 border-l-purple-500 hover:border-white/20 hover:border-l-purple-400 transition-colors">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-purple-400 mb-2">{item.title}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* SECCIÓN DE SEGURIDAD */}
            <div className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 flex items-start gap-4">
              <span className="text-3xl">🛡️</span>
              <div>
                <h4 className="font-display text-sm uppercase tracking-widest text-white mb-2">Compra Segura</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Todos nuestros juegos cuentan con garantía de estabilidad. Al comprar, aceptas nuestros términos y condiciones de uso para cuentas digitales.
                </p>
              </div>
            </div>
            
          </div>

        </div>
      </section>
    </main>
  );
}