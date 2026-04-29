export default function PageHero({ eyebrow, title, description, variant = "auto" }) {
  // 1. Detección automática del "Tema" leyendo el título
  let activeTheme = "default";
  
  if (variant === "auto") {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("nintendo")) {
      activeTheme = "nintendo";
    } else if (titleLower.includes("ps4") || titleLower.includes("ps5") || titleLower.includes("playstation")) {
      activeTheme = "playstation";
    }
  } else {
    activeTheme = variant;
  }

  // 2. Diccionario de colores (Fondos, brillos y textos)
  const themes = {
    default: {
      bg: "from-purple-900/40 via-purple-900/5 to-black border-purple-500/20",
      glow: "bg-purple-600",
      text: "text-purple-400"
    },
    nintendo: {
      bg: "from-red-900/40 via-red-900/5 to-black border-red-500/20",
      glow: "bg-red-600",
      text: "text-red-400"
    },
    playstation: {
      bg: "from-blue-900/40 via-blue-900/5 to-black border-blue-500/20",
      glow: "bg-blue-600",
      text: "text-blue-400"
    }
  };

  const currentStyle = themes[activeTheme];

  return (
    <div className={`relative overflow-hidden border-b bg-gradient-to-b ${currentStyle.bg} py-16 md:py-24`}>
      
      {/* EFECTO DE LUZ TRASERA MÁGICA */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full blur-[100px] opacity-30 pointer-events-none">
        <div className={`w-full h-full rounded-full ${currentStyle.glow}`} />
      </div>

      {/* CONTENIDO TEXTUAL */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 text-center animate-in slide-in-from-bottom-4 fade-in duration-700">
        
        {/* Eyebrow (Texto pequeñito arriba) */}
        <span className={`inline-block font-display text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold ${currentStyle.text} mb-4 bg-black/50 px-3 py-1 rounded-full border border-white/5`}>
          {eyebrow}
        </span>
        
        {/* Título Principal */}
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl uppercase tracking-tighter text-white drop-shadow-lg">
          {title}
        </h1>
        
        {/* Descripción */}
        <p className="mt-6 max-w-2xl mx-auto text-sm md:text-base text-gray-300 leading-relaxed">
          {description}
        </p>
        
      </div>
    </div>
  );
}