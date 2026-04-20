"use client";

import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden border border-white/10 bg-black/40 transition-all hover:border-purple-500/50 hover:bg-white/5">
      
      {/* ETIQUETAS SUPERIORES */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        <span className="bg-purple-600 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg">
          {product.platform}
        </span>
        
        {/* Etiqueta de Promoción (Solo se muestra si está en oferta) */}
        {product.isOnSale && (
          <span className="bg-red-600 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white shadow-lg animate-pulse">
            Oferta
          </span>
        )}
      </div>

      {/* IMAGEN DE PORTADA */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/60">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent opacity-80" />
      </div>

      {/* CONTENIDO Y PRECIOS */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="font-display text-lg uppercase tracking-tight text-white line-clamp-2">
            {product.title}
          </h3>
          <p className="mt-1 text-xs text-muted line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* ZONA DE COMPRA Y PRECIO */}
        <div className="mt-4 flex items-end justify-between">
          <div>
            {/* Lógica: Si está en oferta, muestra ambos precios. Si no, solo el actual. */}
            {product.isOnSale ? (
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-muted line-through">
                  Antes ${product.originalPrice}
                </span>
                <span className="text-xl font-black text-neon">
                  ${product.price}
                </span>
              </div>
            ) : (
              <span className="text-xl font-black text-white">
                ${product.price}
              </span>
            )}
          </div>
          
          <Link 
            // Asegúrate de cambiar el número de teléfono aquí
            href={`https://wa.me/584242518228?text=Hola,%20me%20interesa%20comprar%20el%20juego%20${encodeURIComponent(product.title)}`} 
            target="_blank"
            className="border border-neon bg-neon/10 px-3 py-2 text-[10px] font-bold uppercase text-neon transition-colors hover:bg-neon hover:text-black"
          >
            Comprar
          </Link>
        </div>
      </div>
    </div>
  );
}