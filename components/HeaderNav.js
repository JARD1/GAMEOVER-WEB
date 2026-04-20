"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// --- AQUÍ ESTÁ EL CAMBIO: Agregamos "Experiencias" al arreglo ---
const navigation = [
  { label: "Inicio", href: "/" },
  {
    label: "Nintendo Switch",
    items: [
      { label: "Packs", href: "/packs/nintendo" },
      { label: "Individual", href: "/individuales/nintendo" }
    ]
  },
  {
    label: "PS5",
    items: [{ label: "Individual", href: "/individuales/ps5" }]
  },
  {
    label: "PS4",
    items: [{ label: "Individual", href: "/individuales/ps4" }]
  },
  { label: "Experiencias", href: "/experiencias" }, // <-- NUEVO ENLACE
  { label: "Contacto", href: "/contacto" }
];

export default function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null);

  // Evita que el menú móvil se quede bugueado si giras la tablet o agrandas la pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
        setActiveMobileSubmenu(null);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSubmenu = (label) => {
    setActiveMobileSubmenu(activeMobileSubmenu === label ? null : label);
  };

  const closeAll = () => {
    setIsOpen(false);
    setActiveMobileSubmenu(null);
  };

  return (
    <div className="w-full md:w-auto">
      {/* HEADER MÓVIL: Botón de Toggle */}
      <div className="flex items-center justify-end md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center justify-center border border-neon/50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-neon transition-all hover:bg-neon/10 active:scale-95"
          aria-expanded={isOpen}
        >
          <span className="relative z-10">{isOpen ? "Cerrar [X]" : "Menú ☰"}</span>
          <div className="absolute inset-0 bg-neon opacity-0 blur-md transition-opacity group-hover:opacity-20" />
        </button>
      </div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <nav
        className={`
          ${isOpen ? "flex animate-in slide-in-from-top-2 opacity-100" : "hidden"} 
          absolute left-0 top-[100%] w-full flex-col gap-2 border-b border-white/10 bg-background/95 px-6 py-6 shadow-2xl backdrop-blur-xl transition-all
          md:static md:!flex md:w-auto md:flex-row md:items-center md:gap-8 md:border-none md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none
        `}
      >
        {navigation.map((item) =>
          item.items ? (
            <div key={item.label} className="group relative">
              {/* Botón que despliega el submenú */}
              <button
                type="button"
                onClick={() => toggleSubmenu(item.label)}
                className="flex w-full items-center justify-between gap-2 py-3 text-left text-[12px] font-bold uppercase tracking-[0.2em] text-text transition-colors hover:text-neon md:w-auto md:py-0 md:text-sm lg:text-[13px]"
              >
                <span>{item.label}</span>
                <span
                  className={`text-[9px] text-neonSoft transition-transform duration-300 md:group-hover:rotate-180 ${
                    activeMobileSubmenu === item.label ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* CONTENEDOR DEL SUBMENÚ */}
              <div
                className={`
                  ${activeMobileSubmenu === item.label ? "flex" : "hidden"} 
                  mb-2 flex-col gap-1 border-l-2 border-white/5 pl-4 pt-2
                  md:absolute md:left-0 md:top-[calc(100%+1rem)] md:-ml-4 md:!flex md:min-w-[220px] md:flex-col md:gap-0 md:border md:border-white/10 md:bg-background/95 md:p-2 md:opacity-0 md:invisible md:shadow-neon md:backdrop-blur-xl md:transition-all md:duration-300 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-hover:visible
                `}
              >
                {/* Puente invisible para que el mouse no pierda el hover al bajar en PC */}
                <div className="hidden md:block absolute -top-5 left-0 right-0 h-6" />

                {item.items.map((subitem, index) => (
                  <Link
                    key={`${subitem.href}-${index}`}
                    href={subitem.href}
                    onClick={closeAll}
                    className="group/item flex items-center justify-between py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted transition-all hover:text-neon md:px-3 md:hover:bg-white/5"
                  >
                    <span>{subitem.label}</span>
                    <span className="text-neon opacity-0 transition-opacity group-hover/item:opacity-100 md:-translate-x-2 md:transition-all md:group-hover/item:translate-x-0">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* ENLACE SIMPLE (Sin submenú) */
            <Link
              key={item.href}
              href={item.href}
              onClick={closeAll}
              className="py-3 text-[12px] font-bold uppercase tracking-[0.2em] text-text transition-all hover:text-neon hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] md:py-0 md:text-sm lg:text-[13px]"
            >
              {item.label}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}