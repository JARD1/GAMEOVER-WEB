"use client";

import Link from "next/link";

export default function ProductCard({ product }) {
  // Buscamos algo como "🔥 6 Juegos x 26€ 🔥"
  const bannerMatch = product.description?.match(/🔥.*?🔥/);
  const bannerText = bannerMatch ? bannerMatch[0] : null;

  const mensajeWhatsapp = encodeURIComponent(
    `🎮 *¡Hola, GameOver!* \n\n` +
    `Me interesa adquirir el siguiente título/pack:\n` +
    `📦 *${product.title}*\n` +
    `💰 *Precio:* ${product.price}€\n\n` +
    `¿Está disponible?`
  );

  return (
    <div className="group relative flex h-full flex-col overflow-hidden border border-white/10 bg-black/40 transition-all hover:border-purple-500/50 hover:bg-white/5 rounded-xl shadow-2xl">
      
      {/* ETIQUETAS SUPERIORES */}
      <div className="absolute left-2 md:left-3 top-2 md:top-3 z-10 flex flex-col gap-1 md:gap-1.5">
        <span className="bg-black/70 backdrop-blur-sm px-2 md:px-2.5 py-0.5 md:py-1 text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] text-white shadow-xl rounded-sm border border-white/10">
          {product.platform}
        </span>
        
        {product.isOnSale && (
          <span className="bg-red-600 px-2 md:px-2.5 py-0.5 md:py-1 text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] text-white shadow-xl rounded-sm animate-pulse">
            Oferta
          </span>
        )}
      </div>

      {/* IMAGEN DE PORTADA 1:1 */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-900 border-b border-white/5">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent opacity-100" />
        
        {/* BANNER FLOTANTE EFECTO CRISTAL MORADO */}
        {bannerText && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[96%] bg-purple-600/30 backdrop-blur-md py-1 text-center z-20 border border-purple-400/40 rounded-xl shadow-[0_8px_32px_0_rgba(109,40,217,0.4)] transition-transform duration-300 group-hover:-translate-y-1">
            <span className="text-[11px] sm:text-[14px] md:text-2xl font-black tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,165,0,1)] whitespace-nowrap overflow-hidden text-overflow-ellipsis block px-1">
              {bannerText}
            </span>
          </div>
        )}
      </div>

      {/* CONTENIDO Y DESCRIPCIÓN */}
      <div className="flex flex-1 flex-col justify-between p-3 md:p-5 space-y-3 md:space-y-4">
        <div className="space-y-2 md:space-y-3">
          {/* TÍTULO */}
          <h3 className="font-display text-sm md:text-lg leading-tight uppercase tracking-tighter text-white group-hover:text-purple-400 transition-colors">
            {product.title}
          </h3>
          
          <div className="h-px w-8 md:w-12 bg-purple-500/50" />
          
          {/* DESCRIPCIÓN */}
          <div className="text-xs md:text-sm leading-relaxed text-gray-300 whitespace-pre-wrap h-16 md:h-28 overflow-y-auto scrollbar-thin pr-1 md:pr-2">
            {product.description}
          </div>
        </div>

        {/* ZONA DE PRECIO Y COMPRA */}
        <div className="mt-auto pt-3 md:pt-4 border-t border-white/5 flex flex-col gap-3">
          
          {/* Bloque del Precio Gigante */}
          <div className="flex items-end justify-between px-1">
            <span className="text-[9px] md:text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
              Precio Total
            </span>
            
            <div className="flex flex-col items-end">
              {/* Si está en oferta, mostramos el precio viejo tachado */}
              {product.isOnSale && product.originalPrice && (
                <span className="text-[10px] md:text-xs text-red-500 line-through font-bold mb-[-4px]">
                  {product.originalPrice}€
                </span>
              )}
              {/* 🔥 PRECIO BLANCO CON AURA VERDE 🔥 */}
              <span className="text-2xl md:text-3xl font-display font-black text-white drop-shadow-[0_0_12px_rgba(57,255,20,0.9)]">
                {product.price}€
              </span>
            </div>
          </div>

          {/* Botón de Compra Independiente */}
          <Link 
            href={`https://wa.me/584242518228?text=${mensajeWhatsapp}`} 
            target="_blank"
            className="inline-flex w-full items-center justify-center gap-2 border-2 border-neon bg-neon/10 px-3 md:px-6 py-2.5 md:py-3 text-[10px] md:text-[11px] font-black uppercase tracking-widest text-neon transition-all hover:bg-neon hover:text-black hover:shadow-[0_0_15px_rgba(57,255,20,0.6)] rounded-sm"
          >
            Adquirir Ahora
          </Link>
        </div>
      </div>
    </div>
  );
}