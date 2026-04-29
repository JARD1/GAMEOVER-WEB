export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Elige tu Juego",
      description: "Explora nuestro catálogo filtrado por consolas y encuentra tu próximo título favorito.",
      icon: "🎯",
      glow: "group-hover:shadow-purple-500/30",
      border: "group-hover:border-purple-500/50"
    },
    {
      id: "02",
      title: "Contáctanos",
      description: "Haz clic en 'Adquirir' y el sistema armará tu pedido automáticamente vía WhatsApp.",
      icon: "💬",
      glow: "group-hover:shadow-green-500/30",
      border: "group-hover:border-green-500/50"
    },
    {
      id: "03",
      title: "Pago Seguro",
      description: "Realiza tu pago en bolívares o divisas a través de nuestros métodos verificados.",
      icon: "💳",
      glow: "group-hover:shadow-blue-500/30",
      border: "group-hover:border-blue-500/50"
    },
    {
      id: "04",
      title: "¡A Jugar!",
      description: "Recibe los datos de tu cuenta, instálala en tu consola y comienza a descargar.",
      icon: "🚀",
      glow: "group-hover:shadow-yellow-500/30",
      border: "group-hover:border-yellow-500/50"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        
        <div className="text-center mb-16">
          <span className="font-display text-[10px] uppercase tracking-[0.3em] font-bold text-neon bg-neon/10 px-3 py-1 rounded-full border border-neon/20">
            Proceso de Compra
          </span>
          <h2 className="mt-4 font-display text-3xl md:text-4xl uppercase tracking-tighter text-white">
            ¿Cómo funciona?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Línea conectora de fondo (Solo en PC) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />

          {steps.map((step) => (
            <div key={step.id} className="group relative z-10 flex flex-col items-center text-center">
              {/* Icono Flotante */}
              <div className={`w-24 h-24 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center text-4xl shadow-2xl transition-all duration-500 group-hover:-translate-y-2 ${step.border} ${step.glow}`}>
                <span className="transform transition-transform duration-500 group-hover:scale-110">{step.icon}</span>
                {/* Número flotante */}
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-black font-black text-xs flex items-center justify-center shadow-lg">
                  {step.id}
                </span>
              </div>
              
              {/* Textos */}
              <h3 className="mt-6 font-display text-lg uppercase tracking-wider text-white group-hover:text-white/80 transition-colors">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed max-w-[250px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}