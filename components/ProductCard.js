"use client";

import Link from "next/link";

export default function ProductCard({ product }) {
  // 1. Solo extraemos/copiamos la línea del banner para usarla arriba, sin borrarla de abajo
  // Buscamos algo como "🔥 6 Juegos x 26€ 🔥"
  const bannerMatch = product.description?.match(/🔥.*?🔥/);
  const bannerText = bannerMatch ? bannerMatch[0] : null;

  const mensajeWhatsapp = encodeURIComponent(
    `🎮 *¡Hola, GameOver!* \n\n` +
    `Me interesa adquirir el siguiente pack:\n` +
    `📦 *${product.title}*\n` +
    `💰 *Precio:* ${product.price}€\n\n` +
    `¿Está disponible?`
  );

  return (
    <div className="group relative flex h-full flex-col overflow-hidden border border-white/10 bg-black/40 transition-all hover:border-purple-500/50 hover:bg-white/5 rounded-xl shadow-2xl">
      
      {/* ETIQUETAS SUPERIORES */}
      <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
        <span className="bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-white shadow-xl rounded-sm border border-white/10">
          {product.platform}
        </span>
        
        {product.isOnSale && (
          <span className="bg-red-600 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-white shadow-xl rounded-sm animate-pulse">
            Oferta
          </span>
        )}
      </div>

      {/* IMAGEN DE PORTADA 1:1 CON BANNER FLOTANTE GRANDE */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-900 border-b border-white/5">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Degradado negro inferior intenso para contraste del banner */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent opacity-100" />
        
        {/* BANNER FLOTANTE EFECTO CRISTAL MORADO - TEXTO GRANDE Y MÁXIMO ANCHO */}
        {bannerText && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[96%] bg-purple-600/30 backdrop-blur-md py-1 px-1 text-center z-20 border border-purple-400/40 rounded-xl shadow-[0_8px_32px_0_rgba(109,40,217,0.4)] transition-transform duration-300 group-hover:-translate-y-1">
            <span className="text-[22px] md:text-2xl font-black tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,165,0,1)] whitespace-nowrap overflow-hidden text-overflow-ellipsis block">
              {bannerText}
            </span>
          </div>
        )}
      </div>

      {/* CONTENIDO Y DESCRIPCIÓN */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-3">
          <h3 className="font-display text-lg leading-tight uppercase tracking-tighter text-white group-hover:text-purple-400 transition-colors line-clamp-1">
            {product.title}
          </h3>
          
          <div className="h-px w-12 bg-purple-500/50" />
          
          {/* DESCRIPCIÓN INTACTA (Incluye todo el texto tal como viene) */}
          <div className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap h-36 overflow-y-auto scrollbar-thin pr-2">
            {product.description}
          </div>
        </div>

        {/* ZONA DE COMPRA */}
        <div className="mt-auto pt-4 border-t border-white/5 text-center">
          <Link 
            href={`https://wa.me/584242518228?text=${mensajeWhatsapp}`} 
            target="_blank"
            className="inline-flex w-full items-center justify-center gap-2 border-2 border-neon bg-neon/5 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-neon transition-all hover:bg-neon hover:text-black hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] rounded-sm"
          >
            Adquirir por {product.price}€
          </Link>
        </div>
      </div>
    </div>
  );
}