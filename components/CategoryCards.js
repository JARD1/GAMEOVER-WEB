import Link from "next/link";

export default function CategoryCards() {
  const categories = [
    {
      title: "PlayStation 5",
      subtitle: "Juegos Individuales",
      href: "/individuales/ps5",
      borderGlow: "group-hover:border-blue-500/60",
      bgGlow: "group-hover:bg-blue-900/20",
      shadowGlow: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]",
      textGlow: "group-hover:text-blue-400",
      lineColor: "bg-blue-500",
      shortName: "PS5"
    },
    {
      title: "Nintendo Switch",
      subtitle: "Packs Digitales",
      href: "/packs/nintendo",
      borderGlow: "group-hover:border-red-500/60",
      bgGlow: "group-hover:bg-red-900/20",
      shadowGlow: "group-hover:shadow-[0_0_40px_rgba(239,68,68,0.3)]",
      textGlow: "group-hover:text-red-400",
      lineColor: "bg-red-500",
      shortName: "NSW"
    },
    {
      title: "PlayStation 4",
      subtitle: "Juegos Individuales",
      href: "/individuales/ps4",
      borderGlow: "group-hover:border-indigo-500/60",
      bgGlow: "group-hover:bg-indigo-900/20",
      shadowGlow: "group-hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]",
      textGlow: "group-hover:text-indigo-400",
      lineColor: "bg-indigo-500",
      shortName: "PS4"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      
      {/* Título de la Sección */}
      <div className="text-center mb-16">
        <span className="font-display text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500 border border-white/10 px-4 py-1.5 rounded-full">
          Explorar Catálogo
        </span>
        <h2 className="mt-6 font-display text-3xl md:text-5xl uppercase tracking-tighter text-white drop-shadow-md">
          Elige tu Plataforma
        </h2>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {categories.map((cat, index) => (
          <Link href={cat.href} key={index} className="group outline-none">
            <div className={`relative overflow-hidden rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md p-8 md:p-10 transition-all duration-500 h-full flex flex-col items-center text-center ${cat.borderGlow} ${cat.bgGlow} ${cat.shadowGlow} hover:-translate-y-2`}>
              
              {/* Marca de agua de fondo (Nombre corto de la consola gigante) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-white/[0.02] group-hover:text-white/[0.05] transition-colors duration-500 pointer-events-none select-none z-0">
                {cat.shortName}
              </div>
              
              {/* Contenido Frontal */}
              <div className="relative z-10 flex flex-col items-center w-full h-full">
                
                {/* Título y Subtítulo */}
                <h3 className={`font-display text-2xl md:text-3xl uppercase tracking-widest text-white transition-colors duration-300 ${cat.textGlow}`}>
                  {cat.title}
                </h3>
                
                {/* Línea divisoria de color */}
                <div className={`h-[2px] w-12 ${cat.lineColor} my-4 transition-all duration-500 group-hover:w-24 opacity-50 group-hover:opacity-100`} />
                
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 group-hover:text-white/80 transition-colors">
                  {cat.subtitle}
                </span>

                {/* Botón fantasma inferior */}
                <div className="mt-auto pt-10 opacity-50 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <span className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-white border-b border-white/30 pb-1 group-hover:border-white transition-colors">
                    Ingresar <span className="text-lg leading-none">→</span>
                  </span>
                </div>
                
              </div>
            </div>
          </Link>
        ))}
      </div>
      
    </div>
  );
}