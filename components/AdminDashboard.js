"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
// Importamos getDocs y where para poder buscar los packs vencidos
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, getDocs, where } from "firebase/firestore";
import { db } from "../lib/firebase"; 

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
  const [isCleaning, setIsCleaning] = useState(false); // Estado para el botón de limpieza
  
  const [pendingPacks, setPendingPacks] = useState([]);
  const [copiedId, setCopiedId] = useState(null); // Estado para el feedback visual al copiar

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

  // --- EFECTO FIREBASE ---
  useEffect(() => {
    const q = query(collection(db, "packs_pendientes"), orderBy("fecha_creacion", "desc"));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const packsData = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().estado === "pendiente") {
          packsData.push({ id: doc.id, ...doc.data() });
        }
      });
      setPendingPacks(packsData);
    }, (error) => {
      console.error("Error conectando a Firebase:", error);
      setStatus({ message: "Error al escuchar nuevos packs de Telegram", type: "error" });
    });

    return () => unsubscribe();
  }, []);

  // --- NUEVAS ACCIONES DE TELEGRAM ---

  // 1. Manejar la edición en vivo del texto del pack
  const handlePackTextChange = (packId, newText) => {
    setPendingPacks(prevPacks => 
      prevPacks.map(pack => 
        pack.id === packId ? { ...pack, texto_telegram: newText } : pack
      )
    );
  };

  // 2. Copiar al portapapeles
  const copiarPack = async (packId, texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiedId(packId);
      setTimeout(() => setCopiedId(null), 2000); // Vuelve a la normalidad después de 2s
    } catch (err) {
      console.error('Error al copiar: ', err);
      setStatus({ message: "Error al copiar al portapapeles", type: "error" });
    }
  };

  // 3. Publicar (Actualizar estado en Firebase con el texto posiblemente editado)
  const publicarPackTelegram = async (packId, textoEditado) => {
    try {
      const packRef = doc(db, "packs_pendientes", packId);
      await updateDoc(packRef, { 
          estado: "publicado",
          texto_telegram: textoEditado // Guardamos la versión editada si hubo cambios
      });
      setStatus({ message: "¡Pack de Telegram publicado en la web!", type: "success" });
    } catch (error) {
      setStatus({ message: "Error al publicar el pack", type: "error" });
    }
  };

  // 4. Eliminar Permanentemente (Rechazar)
  const eliminarPackTelegram = async (packId) => {
    if (!confirm("¿Seguro que quieres borrar este pack permanentemente?")) return;
    try {
      const packRef = doc(db, "packs_pendientes", packId);
      await deleteDoc(packRef);
      setStatus({ message: "Pack eliminado de la bandeja.", type: "success" });
    } catch (error) {
      setStatus({ message: "Error al eliminar el pack", type: "error" });
    }
  };

  // --- 5. LIMPIEZA MANUAL (+24H) ---
  const limpiarPacksVencidos = async () => {
    if (!confirm("¿Estás seguro? Esto eliminará de Firebase todos los packs (Pendientes y Publicados) que tengan más de 24 horas.")) return;
    
    setIsCleaning(true);
    setStatus({ message: "Buscando packs vencidos...", type: "info" });

    try {
      const ahora = new Date(); // Hora exacta de este momento
      
      // Buscamos todos los packs cuya fecha de expiración sea MENOR que ahora
      const q = query(
        collection(db, "packs_pendientes"),
        where("fecha_expiracion", "<", ahora)
      );
      
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setStatus({ message: "Todo limpio. No hay packs con más de 24 horas.", type: "success" });
        setIsCleaning(false);
        return;
      }

      // Creamos un arreglo de promesas para borrar todos los documentos encontrados
      const promesasDeBorrado = snapshot.docs.map(documento => 
        deleteDoc(doc(db, "packs_pendientes", documento.id))
      );

      // Ejecutamos todos los borrados al mismo tiempo
      await Promise.all(promesasDeBorrado);

      setStatus({ message: `¡Limpieza exitosa! Se eliminaron ${snapshot.size} packs vencidos.`, type: "success" });
    } catch (error) {
      console.error("Error en la limpieza:", error);
      setStatus({ message: "Error al limpiar los packs.", type: "error" });
    } finally {
      setIsCleaning(false);
    }
  };

  // --- LÓGICA DE FILTRADO (Catálogo Manual) ---
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
    <div className="space-y-10 animate-in fade-in duration-700 min-h-screen p-8">
      {/* HEADER & STATS */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="panel p-8 md:col-span-2 bg-black/40 border border-white/10 rounded-xl">
          <p className="font-display text-[10px] uppercase tracking-[0.4em] text-purple-400">Control Center</p>
          <h1 className="mt-2 font-display text-4xl tracking-tighter text-white">GAME OVER ADMIN</h1>
          <div className="mt-8 flex flex-wrap gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Total Manual</p>
              <p className="text-3xl font-bold text-neon">{games.length}</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Telegram Pendientes</p>
              <p className="text-3xl font-bold text-blue-500 animate-pulse">{pendingPacks.length}</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">Destacados</p>
              <p className="text-3xl font-bold text-yellow-500">{games.filter(g => g.isFeatured).length}</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted">En Oferta</p>
              <p className="text-3xl font-bold text-red-500">{games.filter(g => g.isOnSale).length}</p>
            </div>
          </div>
        </div>
        
        <div className={`panel rounded-xl border-l-4 p-8 flex flex-col justify-center bg-black/40 ${
          status.type === 'success' ? 'border-l-green-500' : status.type === 'error' ? 'border-l-red-500' : 'border-l-yellow-500'
        }`}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Estatus del Sistema</span>
          <p className="mt-2 text-sm leading-relaxed text-white/90">{status.message}</p>
        </div>
      </section>

      {/* BANDEJA DE ENTRADA DE TELEGRAM */}
      <section className="space-y-4 bg-blue-900/10 border border-blue-500/20 p-6 rounded-xl">
        <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl uppercase tracking-widest text-blue-400 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                {pendingPacks.length > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>}
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              Nuevos Packs de Telegram
            </h2>
            <span className="text-xs text-blue-300 font-bold bg-blue-900/50 px-3 py-1 rounded-full">
              {pendingPacks.length} Pendientes
            </span>
          </div>

          {/* BOTÓN DE LIMPIEZA MANUAL (+24H) */}
          <button 
            onClick={limpiarPacksVencidos}
            disabled={isCleaning}
            className={`flex items-center gap-2 border px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded transition-colors ${
              isCleaning 
                ? 'bg-gray-600 border-gray-500 text-gray-300 cursor-not-allowed' 
                : 'bg-red-600/20 hover:bg-red-600 border-red-500 text-red-100 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]'
            }`}
          >
            {isCleaning ? 'Limpiando...' : '🧹 Limpiar +24h'}
          </button>
        </div>

        {pendingPacks.length === 0 ? (
           <div className="text-center py-10 opacity-50 italic text-sm text-blue-300">
             No hay packs pendientes de revisión. Todo al día.
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 pt-4">
            {pendingPacks.map((pack) => (
              <div key={pack.id} className="bg-black/60 border border-white/10 rounded-lg overflow-hidden flex flex-col hover:border-blue-500/50 transition-colors shadow-lg relative group">
                
                {/* Botón Flotante para Eliminar */}
                <button 
                  onClick={() => eliminarPackTelegram(pack.id)}
                  className="absolute top-2 left-2 bg-red-600 hover:bg-red-500 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md"
                  title="Eliminar Pack"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>

                <div className="w-full aspect-square bg-gray-900 relative">
                  <img src={pack.url_imagen} alt="Portada" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/80 text-neon font-bold text-xs px-2 py-1 rounded border border-white/10">
                    {pack.cantidad_juegos} Juegos
                  </div>
                </div>
                
                <div className="p-4 flex-grow flex flex-col gap-3">
                  {/* TEXTAREA EDITABLE */}
                  <textarea 
                    value={pack.texto_telegram}
                    onChange={(e) => handlePackTextChange(pack.id, e.target.value)}
                    className="w-full text-xs text-gray-300 bg-black/40 border border-white/10 rounded p-2 overflow-y-auto h-32 scrollbar-thin outline-none focus:border-blue-500 resize-none transition-colors"
                  />
                  
                  <div className="mt-auto grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                    {/* Botón COPIAR */}
                    <button 
                      onClick={() => copiarPack(pack.id, pack.texto_telegram)}
                      className={`font-bold py-2 rounded text-[10px] uppercase tracking-wider transition-colors border ${
                        copiedId === pack.id 
                          ? 'bg-green-600 border-green-500 text-white' 
                          : 'bg-gray-800 hover:bg-gray-700 border-gray-600 text-gray-300'
                      }`}
                    >
                      {copiedId === pack.id ? '¡Copiado!' : 'Copiar'}
                    </button>
                    
                    {/* Botón PUBLICAR */}
                    <button 
                      onClick={() => publicarPackTelegram(pack.id, pack.texto_telegram)}
                      className="bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-blue-400 font-bold py-2 rounded text-[10px] uppercase tracking-wider transition-colors"
                    >
                      Publicar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FORMULARIO E INVENTARIO ORIGINALES */}
      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative">
          <form onSubmit={handleSubmit} className={`panel bg-black/40 border border-white/10 rounded-xl sticky top-24 space-y-5 p-8 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
            <h2 className="font-display text-xl uppercase tracking-widest border-b border-white/5 pb-4">
              {editingId ? "Editar Entrada" : "Nuevo Ingreso Manual"}
            </h2>

            <div className="space-y-4">
              <label className="block">
                <span className="text-[10px] uppercase font-bold text-muted">Título</span>
                <input required name="title" value={form.title} onChange={handleChange}
                  className="mt-1 w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-sm focus:border-neon outline-none transition-colors" />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] uppercase font-bold text-muted">Consola</span>
                  <select name="platform" value={form.platform} onChange={handleChange}
                    className="mt-1 w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-sm outline-none focus:border-neon transition-colors">
                    <option value="PS4">PlayStation 4</option>
                    <option value="PS5">PlayStation 5</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                    <option value="PS4 / PS5">PS4 / PS5 Dual</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase font-bold text-muted">Tipo</span>
                  <select name="type" value={form.type} onChange={handleChange}
                    className="mt-1 w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-sm outline-none focus:border-neon transition-colors">
                    <option value="Individual">Individual</option>
                    <option value="Pack">Pack</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] uppercase font-bold text-muted">Precio Actual/Oferta ($)</span>
                  <input required type="number" step="0.01" name="price" value={form.price} onChange={handleChange}
                    className="mt-1 w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-sm outline-none focus:border-neon transition-colors" />
                </label>
                
                {form.isOnSale ? (
                  <label className="block animate-in fade-in slide-in-from-top-2">
                    <span className="text-[10px] uppercase font-bold text-red-400">Precio Anterior Tachado ($)</span>
                    <input required type="number" step="0.01" name="originalPrice" value={form.originalPrice} onChange={handleChange}
                      className="mt-1 w-full bg-red-900/20 border border-red-500/50 rounded text-red-100 px-4 py-3 text-sm outline-none focus:border-red-500 transition-colors" />
                  </label>
                ) : (
                  <label className="block opacity-50 cursor-not-allowed">
                    <span className="text-[10px] uppercase font-bold text-muted">Precio Anterior ($)</span>
                    <input disabled type="text" className="mt-1 w-full bg-black/20 border border-white/5 rounded px-4 py-3 text-sm outline-none" placeholder="Inactivo" />
                  </label>
                )}
              </div>

              <label className="block">
                <span className="text-[10px] uppercase font-bold text-muted">Imagen URL</span>
                <input required type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange}
                  className="mt-1 w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-sm outline-none focus:border-neon transition-colors" />
              </label>

              <label className="block">
                <span className="text-[10px] uppercase font-bold text-muted">Descripción</span>
                <textarea required name="description" value={form.description} onChange={handleChange} rows="2"
                  className="mt-1 w-full bg-black/60 border border-white/10 rounded px-4 py-3 text-sm outline-none focus:border-neon transition-colors" />
              </label>

              <div className="grid grid-cols-2 gap-4 pt-2">
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

            <div className="flex gap-3 pt-4 border-t border-white/5">
              <button type="submit" className="flex-1 bg-neon hover:bg-neon/80 text-black py-3 rounded text-xs uppercase font-bold tracking-widest transition-colors">
                {editingId ? "Actualizar" : "Publicar"}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}
                  className="px-6 border border-white/10 rounded text-[10px] uppercase font-bold hover:bg-white/10 transition-colors">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-4 bg-black/40 border border-white/10 rounded-xl p-6">
            <h2 className="font-display text-xl uppercase tracking-widest">Inventario Manual</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input type="text" placeholder="Buscar nombre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/60 border border-white/10 rounded px-3 py-2 text-xs outline-none focus:border-neon transition-colors" />
              <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)}
                className="bg-black/60 border border-white/10 rounded px-3 py-2 text-xs outline-none transition-colors">
                <option value="All">Todas las Consolas</option>
                <option value="PS4">PS4</option>
                <option value="PS5">PS5</option>
                <option value="Nintendo Switch">Switch</option>
              </select>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                className="bg-black/60 border border-white/10 rounded px-3 py-2 text-xs outline-none transition-colors">
                <option value="All">Todos los Tipos</option>
                <option value="Individual">Individual</option>
                <option value="Pack">Packs</option>
              </select>
            </div>
          </div>

          <div className="grid gap-3">
            {filteredGames.length === 0 && !loading && (
              <div className="panel bg-black/40 border border-white/10 rounded-xl p-10 text-center opacity-50 italic text-sm">
                Sin resultados en el inventario...
              </div>
            )}
            
            {filteredGames.map((game) => (
              <div key={game.id} className={`group panel p-4 rounded-xl transition-all bg-black/40 border ${game.isOnSale ? 'border-red-500/20 hover:border-red-500/60' : 'border-white/5 hover:border-purple-500/40'}`}>
                <div className="flex items-start gap-4">
                  <div className="h-20 w-14 bg-white/5 flex-none relative border border-white/10 overflow-hidden rounded">
                    {game.isFeatured && <div className="absolute top-0 right-0 bg-yellow-500 text-[8px] p-0.5 z-10">⭐</div>}
                    <img src={game.imageUrl} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-display text-base truncate pr-2 uppercase flex items-center gap-2">
                        {game.title}
                        {game.isOnSale && <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[8px] tracking-widest animate-pulse">SALE</span>}
                      </h3>
                      
                      <div className="text-right">
                        {game.isOnSale && (
                          <span className="block text-[10px] text-muted line-through font-medium">${game.originalPrice}</span>
                        )}
                        <span className={`font-bold ${game.isOnSale ? 'text-red-400' : 'text-neon'}`}>${game.price}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-1">
                      <span className="text-[8px] px-1.5 py-0.5 rounded border border-purple-500/30 text-purple-400 font-bold uppercase">{game.platform}</span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded border border-white/10 text-muted font-bold uppercase">{game.type}</span>
                    </div>
                    
                    <div className="mt-3 flex gap-3">
                      <button onClick={() => startEditing(game)} className="text-[9px] font-bold text-white/70 hover:text-neon tracking-widest transition-colors">[EDITAR]</button>
                      <button onClick={() => handleDelete(game.id)} className="text-[9px] font-bold text-white/70 hover:text-red-400 tracking-widest transition-colors">[BORRAR]</button>
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