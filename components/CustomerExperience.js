"use client";

import { useRef } from "react";

export default function CustomerExperience({ captures, title, description }) {
  // Referencia al contenedor que va a hacer scroll
  const scrollRef = useRef(null);

  // Función para mover el carrusel
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Cabecera con Título y Botones de Navegación */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="font-display text-[10px] uppercase tracking-[0.4em] text-purple-400">{title}</p>
            <p className="text-muted text-xs mt-1 uppercase tracking-widest">{description}</p>
          </div>
          
          {/* Solo mostramos las flechas si hay imágenes para mover */}
          {captures && captures.length > 0 && (
            <div className="flex gap-2">
              <button 
                onClick={() => scroll("left")}
                className="flex items-center justify-center w-10 h-10 border border-white/10 bg-black/40 hover:bg-white/10 hover:border-purple-500 transition-all text-white/70 hover:text-white"
              >
                ←
              </button>
              <button 
                onClick={() => scroll("right")}
                className="flex items-center justify-center w-10 h-10 border border-white/10 bg-black/40 hover:bg-white/10 hover:border-purple-500 transition-all text-white/70 hover:text-white"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Contenedor del Carrusel (Ocultamos la barra con CSS pero permitimos el scroll) */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 no-scrollbar snap-x scroll-smooth hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Esconde barra en Firefox/IE
        >
          {captures && captures.map((cap, i) => {
            const platform = cap.platform?.toLowerCase() || "";
            const isWhatsApp = platform === "whatsapp";

            return (
              <div 
                key={i} 
                className={`flex-none snap-center relative overflow-hidden border border-white/10 bg-black/40 group
                  ${isWhatsApp ? 'w-[260px] h-[460px]' : 'w-[350px] h-[75px]'}
                `}
              >
                <img 
                  src={cap.imageUrl} 
                  alt="Testimonio" 
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.style.border = '2px solid red'; }}
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>
            );
          })}
          
          {(!captures || captures.length === 0) && (
            <div className="p-10 border border-dashed border-white/10 text-muted text-xs w-full text-center">
              Esperando datos de captures...
            </div>
          )}
        </div>
        
      </div>
    </section>
  );
}