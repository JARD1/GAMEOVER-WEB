import Link from 'next/link';

export default function CategoryCards() {
  const categories = [
    {
      title: "Nintendo Switch Packs",
      desc: "Combos de juegos para máximo ahorro.",
      link: "/packs/nintendo",
      color: "border-red-500/30",
      hover: "hover:border-red-500"
    },
    {
      title: "PlayStation 5",
      desc: "Títulos de nueva generación.",
      link: "/individuales/ps5",
      color: "border-blue-500/30",
      hover: "hover:border-blue-500"
    },
    {
      title: "Nintendo Switch",
      desc: "Juegos individuales destacados.",
      link: "/individuales/nintendo",
      color: "border-red-500/30",
      hover: "hover:border-red-500"
    },
    {
      title: "PlayStation 4",
      desc: "Clásicos y novedades para PS4.",
      link: "/individuales/ps4",
      color: "border-blue-500/30",
      hover: "hover:border-blue-500"
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="text-center mb-12">
          <p className="font-display text-sm uppercase tracking-[0.35em] text-neonSoft">Explora</p>
          <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.14em] text-text">Nuestras Plataformas</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((cat, index) => (
            <Link key={index} href={cat.link} className="block group">
              <div className={`glass-panel p-8 rounded-xl border ${cat.color} ${cat.hover} transition-all duration-300 h-full flex flex-col justify-between`}>
                <div>
                  <h3 className="text-2xl font-display uppercase tracking-wider text-white mb-2">{cat.title}</h3>
                  <p className="text-muted">{cat.desc}</p>
                </div>
                <div className="mt-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 group-hover:text-white transition-colors">
                    Explorar Catálogo →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}