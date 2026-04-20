"use client";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ products }) {
  // Validación de seguridad: si no hay productos, no renderiza el carrusel
  if (!products || products.length === 0) return null;

  // Duplicamos la lista para crear el efecto de bucle infinito sin saltos
  const doubleProducts = [...products, ...products];

  return (
    <div className="relative w-full overflow-hidden py-10">
      {/* Contenedor de la animación */}
      <div className="flex w-max animate-marquee pause-hover">
        {doubleProducts.map((product, index) => (
          <div 
            key={`${product.id}-${index}`} 
            className="w-[280px] px-3 md:w-[320px] transition-transform duration-300 hover:scale-105"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Gradientes laterales para suavizar la entrada/salida */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#050508] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#050508] to-transparent z-10" />
    </div>
  );
}