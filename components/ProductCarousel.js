"use client";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ products }) {
  if (!products || products.length === 0) return null;

  // Triplicamos la lista para asegurar el bucle infinito en PC.
  // En móvil, la gente simplemente deslizará por un catálogo largo.
  const repeatedProducts = [...products, ...products, ...products];

  return (
    <div className="relative w-full py-16 -my-8">
      
      {/* Gradientes laterales.
          En móvil (w-6) son más pequeños para no estorbar visualmente, 
          en PC (md:w-64) son grandes y dramáticos.
      */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-6 md:w-64 bg-gradient-to-r from-black via-black/80 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-6 md:w-64 bg-gradient-to-l from-black via-black/80 to-transparent z-20" />

      {/* CONTENEDOR PRINCIPAL HÍBRIDO 
          Móvil: overflow-x-auto, snap-x (deslizamiento magnético) y barra de scroll oculta.
          PC: animate-marquee y overflow-visible.
      */}
      <div className="flex w-full md:w-max overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none items-stretch gap-4 md:gap-8 px-8 md:px-6 pb-8 md:pb-0 
                      animate-none md:animate-marquee md:hover:[animation-play-state:paused] 
                      [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {repeatedProducts.map((product, index) => (
          <div 
            key={`${product.id}-${index}`} 
            /* En móvil: snap-center (se centra como un imán) y es un poco más delgado (w-[260px])
               En PC: md:w-[320px] y tiene el efecto de levitar en hover */
            className="w-[260px] md:w-[320px] relative group shrink-0 snap-center transition-all duration-500 md:hover:-translate-y-6 md:hover:z-30"
          >
            {/* AURA DE NEÓN TRASERA (Solo PC) */}
            <div className="hidden md:block absolute -inset-1 bg-gradient-to-b from-purple-600 via-blue-500 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            
            {/* Contenedor de la tarjeta: En móvil se encoge un poquito al tocarlo (active:scale-[0.98]) para dar sensación de botón real */}
            <div className="relative h-full w-full transition-transform duration-300 active:scale-[0.98] md:active:scale-100">
              <ProductCard product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}