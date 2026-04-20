"use client";

import { useEffect, useState, useCallback, useMemo } from "react";

// 1. Añadimos los campos de promoción al estado vacío
const emptyForm = {
  title: "",
  type: "Individual",
  platform: "PS5",
  description: "",
  price: "",
  imageUrl: "",
  isFeatured: false,
  isOnSale: false,
  originalPrice: ""
};

export default function AdminDashboard() {
  const [games, setGames] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ message: "Cargando catálogo...", type: "info" });
  const [loading, setLoading] = useState(true);

  // --- ESTADOS DE FILTRADO ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [filterType, setFilterType] = useState("All");

  const loadGames = useCallback(async () => {
    try {
      const response = await fetch("/api/games", { cache: "no-store" });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Error al conectar");

      setGames(data.games || []);
      setStatus({
        message: data.firebaseConfigured 
          ? "Sincronizado con Firebase Cloud" 
          : "Modo Local: Firebase no detectado",
        type: data.firebaseConfigured ? "success" : "warning"
      });
    } catch (error) {
      setStatus({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // --- LÓGICA DE FILTRADO ---
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesName = game.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = filterPlatform === "All" || game.platform === filterPlatform;
      const matchesType = filterType === "All" || game.type === filterType;
      return matchesName && matchesPlatform && matchesType;
    });
  }, [games, searchTerm, filterPlatform, filterType]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/games/${editingId}` : "/api/games";

    // Preparamos los datos asegurándonos de que los precios sean números correctos
    const payload = {
      ...form,
      price: parseFloat(form.price),
      originalPrice: form.isOnSale && form.originalPrice ? parseFloat(form.originalPrice) : null
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error en la operación");
      }

      setForm(emptyForm);
      setEditingId(null);
      setStatus({ 
        message: editingId ? "¡Juego actualizado!" : "¡Juego añadido!", 
        type: "success" 
      });
      await loadGames();
    } catch (error) {
      setStatus({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este juego?")) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/games/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Error al eliminar");
      setStatus({ message: "Eliminado con éxito.", type: "success" });
      await loadGames();
    } catch (error) {
      setStatus({ message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (game) => {
    // 2. Cargamos los datos de promoción al editar
    setForm({ 
      ...game, 
      price: String(game.price),
      originalPrice: game.originalPrice ? String(game.originalPrice) : "",
      isFeatured: game.isFeatured || false,
      isOnSale: game.isOnSale || false
    });
    setEditingId(game.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* HEADER & STATS */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="panel p-8 md:col-span-2">
          <p className="font-display text-[10px] uppercase tracking-[0.4em] text-purple-400">Control Center</p>
          <h1 className="mt-2 font-display text-4xl tracking-tighter text-white">GAME OVER ADMIN</h1>
          <div className="mt-8 flex gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Total</p>
              <p className="text-3xl font-bold text-neon">{games.length}</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Destacados</p>
              <p className="text-3xl font-bold text-yellow-500">
                {games.filter(g => g.isFeatured).length}
              </p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">En Oferta</p>
              <p className="text-3xl font-bold text-red-500">
                {games.filter(g => g.isOnSale).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className={`panel border-l-4 p-8 flex flex-col justify-center ${
          status.type === 'success' ? 'border-l-green-500' : status.type === 'error' ? 'border-l-red-500' : 'border-l-yellow-500'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Estatus</span>
          <p className="mt-2 text-sm leading-relaxed text-white/90">{status.message}</p>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        {/* FORMULARIO */}
        <div className="relative">
          <form onSubmit={handleSubmit} className={`panel sticky top-24 space-y-5 p-8 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="font-display text-xl uppercase tracking-widest border-b border-white/5 pb-4">
              {editingId ? "Editar Entrada" : "Nuevo Ingreso"}
            </h2>

            <div className="space-y-4">
              <label className="block">
                <span className="text-[10px] uppercase font-bold text-muted">Título</span>
                <input required name="title" value={form.title} onChange={handleChange}
                  className="mt-1 w-full bg-black/40 border border-white/10 px-4 py-3 text-sm focus:border-neon outline-none" />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] uppercase font-bold text-muted">Consola</span>
                  <select name="platform" value={form.platform} onChange={handleChange}
                    className="mt-1 w-full bg-black/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-neon">
                    <option value="PS4">PlayStation 4</option>
                    <option value="PS5">PlayStation 5</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                    <option value="PS4 / PS5">PS4 / PS5 Dual</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase font-bold text-muted">Tipo</span>
                  <select name="type" value={form.type} onChange={handleChange}
                    className="mt-1 w-full bg-black/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-neon">
                    <option value="Individual">Individual</option>
                    <option value="Pack">Pack</option>
                  </select>
                </label>
              </div>

              {/* 3. BLOQUE DE PRECIOS CONDICIONAL */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] uppercase font-bold text-muted">Precio Actual/Oferta ($)</span>
                  <input required type="number" step="0.01" name="price" value={form.price} onChange={handleChange}
                    className="mt-1 w-full bg-black/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-neon" />
                </label>
                
                {form.isOnSale ? (
                  <label className="block animate-in fade-in slide-in-from-top-2">
                    <span className="text-[10px] uppercase font-bold text-red-400">Precio Anterior Tachado ($)</span>
                    <input required type="number" step="0.01" name="originalPrice" value={form.originalPrice} onChange={handleChange}
                      className="mt-1 w-full bg-red-900/20 border border-red-500/50 text-red-100 px-4 py-3 text-sm outline-none focus:border-red-500" />
                  </label>
                ) : (
                  <label className="block opacity-50 cursor-not-allowed">
                    <span className="text-[10px] uppercase font-bold text-muted">Precio Anterior ($)</span>
                    <input disabled type="text" className="mt-1 w-full bg-black/20 border border-white/5 px-4 py-3 text-sm outline-none" placeholder="Inactivo" />
                  </label>
                )}
              </div>

              <label className="block">
                <span className="text-[10px] uppercase font-bold text-muted">Imagen URL</span>
                <input required type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange}
                  className="mt-1 w-full bg-black/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-neon" />
              </label>

              <label className="block">
                <span className="text-[10px] uppercase font-bold text-muted">Descripción</span>
                <textarea required name="description" value={form.description} onChange={handleChange} rows="2"
                  className="mt-1 w-full bg-black/40 border border-white/10 px-4 py-3 text-sm outline-none focus:border-neon" />
              </label>

              {/* 4. CHECKBOXES DE CONFIGURACIÓN */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center justify-center gap-3 cursor-pointer p-3 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-purple-500" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Destacar Inicio</span>
                </label>

                <label className="flex items-center justify-center gap-3 cursor-pointer p-3 bg-red-500/10 border border-red-500/30 rounded hover:bg-red-500/20 transition-colors">
                  <input type="checkbox" name="isOnSale" checked={form.isOnSale} onChange={handleChange} className="w-4 h-4 accent-red-500" />
                  <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">En Oferta</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 btn-neon py-3 text-xs uppercase font-bold tracking-widest">
                {editingId ? "Actualizar" : "Publicar"}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}
                  className="px-4 border border-white/10 text-[10px] uppercase font-bold hover:bg-white/10">X</button>
              )}
            </div>
          </form>
        </div>

        {/* LISTADO CON FILTROS */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl uppercase tracking-widest px-2">Inventario</h2>
            
            {/* FILTROS DINÁMICOS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-2">
              <input type="text" placeholder="Buscar nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/60 border border-white/10 px-3 py-2 text-xs outline-none focus:border-neon" />
              <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}
                className="bg-black/60 border border-white/10 px-3 py-2 text-xs outline-none">
                <option value="All">Todas las Consolas</option>
                <option value="PS4">PS4</option>
                <option value="PS5">PS5</option>
                <option value="Nintendo Switch">Switch</option>
              </select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                className="bg-black/60 border border-white/10 px-3 py-2 text-xs outline-none">
                <option value="All">Todos los Tipos</option>
                <option value="Individual">Individual</option>
                <option value="Pack">Packs</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4">
            {filteredGames.length === 0 && !loading && (
              <div className="panel p-10 text-center opacity-50 italic text-sm">Sin resultados...</div>
            )}
            
            {filteredGames.map((game) => (
              <div key={game.id} className={`group panel p-4 transition-all bg-black/20 ${game.isOnSale ? 'hover:border-red-500/40' : 'hover:border-purple-500/40'}`}>
                <div className="flex items-start gap-4">
                  <div className="h-20 w-14 bg-white/5 flex-none relative border border-white/10 overflow-hidden">
                    {game.isFeatured && <div className="absolute top-0 right-0 bg-yellow-500 text-[8px] p-0.5 z-10">⭐</div>}
                    <img src={game.imageUrl} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-display text-base truncate pr-2 uppercase flex items-center gap-2">
                        {game.title}
                        {/* 5. Etiqueta visual de SALE en el inventario */}
                        {game.isOnSale && <span className="bg-red-600 text-white px-1.5 py-0.5 text-[8px] tracking-widest animate-pulse">SALE</span>}
                      </h3>
                      
                      {/* 6. Lógica de precio tachado en el inventario */}
                      <div className="text-right">
                        {game.isOnSale && (
                          <span className="block text-[10px] text-muted line-through font-medium">${game.originalPrice}</span>
                        )}
                        <span className={`font-bold ${game.isOnSale ? 'text-red-400' : 'text-neon'}`}>${game.price}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-1">
                      <span className="text-[8px] px-1.5 py-0.5 border border-purple-500/30 text-purple-400 font-bold uppercase">{game.platform}</span>
                      <span className="text-[8px] px-1.5 py-0.5 border border-white/10 text-muted font-bold uppercase">{game.type}</span>
                    </div>
                    
                    <div className="mt-3 flex gap-3">
                      <button onClick={() => startEditing(game)} className="text-[9px] font-bold text-white hover:text-neon tracking-widest">[EDITAR]</button>
                      <button onClick={() => handleDelete(game.id)} className="text-[9px] font-bold text-red-500 hover:text-red-400 tracking-widest">[BORRAR]</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}