"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, getDocs, where, limit, getCountFromServer } from "firebase/firestore";
import { db } from "../lib/firebase"; 
import { diccPlaystation } from "../lib/playstation";

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
  // ==========================================
  // 1. ESTADOS (MEMORIA DEL COMPONENTE)
  // ==========================================
  const [games, setGames] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ message: "Cargando catálogo...", type: "info" });
  const [loading, setLoading] = useState(true);
  
  // Estados para procesos de carga visuales
  const [isCleaning, setIsCleaning] = useState(false);
  const [isNuking, setIsNuking] = useState(false); 
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, active: false });
  
  // Estados de Telegram
  const [pendingPacks, setPendingPacks] = useState([]);
  const [totalPacksCount, setTotalPacksCount] = useState(0); 
  const [copiedId, setCopiedId] = useState(null);
  const [packsLimit, setPacksLimit] = useState(8);

  // Estados de Filtros e Inventario
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [inventoryLimit, setInventoryLimit] = useState(10);
  const [bulkText, setBulkText] = useState("");
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false); // 🔥 NUEVO ESTADO DE FILTRO VIP

  // ==========================================
  // 2. EFECTOS (PROCESOS EN SEGUNDO PLANO)
  // ==========================================

  const loadGames = useCallback(async () => {
    try {
      const response = await fetch("/api/games", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al conectar");
      setGames(data.games || []);
      setStatus({
        message: data.firebaseConfigured ? "Sincronizado con Firebase" : "Modo Local",
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

  useEffect(() => {
    const q = query(
      collection(db, "packs_pendientes"), 
      where("estado", "==", "pendiente"),
      orderBy("fecha_creacion", "desc"),
      limit(packsLimit)
    );
    
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const packsData = [];
      querySnapshot.forEach((doc) => {
        packsData.push({ id: doc.id, ...doc.data() });
      });
      setPendingPacks(packsData);
      
      try {
        const snapshot = await getCountFromServer(collection(db, "packs_pendientes"));
        setTotalPacksCount(snapshot.data().count);
      } catch (err) {
        console.error("Error al contar packs:", err);
      }
    }, (error) => {
      console.error("Error Firebase:", error);
    });

    return () => unsubscribe();
  }, [packsLimit]);

  useEffect(() => {
    setInventoryLimit(10);
  }, [searchTerm, filterPlatform, showOnlyFeatured]);


  // ==========================================
  // 3. CONTROLADORES (BOTONES Y ACCIONES)
  // ==========================================

  const handlePackTextChange = (packId, newText) => {
    setPendingPacks(prevPacks => prevPacks.map(pack => pack.id === packId ? { ...pack, texto_telegram: newText } : pack));
  };

  const copiarPack = async (packId, texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiedId(packId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      setStatus({ message: "Error al copiar", type: "error" });
    }
  };

  const publicarPackTelegram = async (packId, textoEditado) => {
    try {
      await updateDoc(doc(db, "packs_pendientes", packId), { estado: "publicado", texto_telegram: textoEditado });
      setStatus({ message: "¡Pack publicado!", type: "success" });
    } catch (error) {
      setStatus({ message: "Error al publicar", type: "error" });
    }
  };

  const eliminarPackTelegram = async (packId) => {
    if (!confirm("¿Eliminar pack?")) return;
    try {
      await deleteDoc(doc(db, "packs_pendientes", packId));
      setStatus({ message: "Pack eliminado.", type: "success" });
    } catch (error) {
      setStatus({ message: "Error al eliminar", type: "error" });
    }
  };

  const limpiarPacksVencidos = async () => {
    if (!confirm("Esto eliminará de Firebase todos los packs con más de 24 horas.")) return;
    setIsCleaning(true);
    try {
      const snapshot = await getDocs(query(collection(db, "packs_pendientes"), where("fecha_expiracion", "<", new Date())));
      if (snapshot.empty) {
        setStatus({ message: "Todo limpio. No se encontraron packs vencidos.", type: "success" });
      } else {
        await Promise.all(snapshot.docs.map(documento => deleteDoc(doc(db, "packs_pendientes", documento.id))));
        setStatus({ message: `¡Limpieza exitosa! Se eliminaron ${snapshot.size} packs antiguos.`, type: "success" });
      }
    } catch (error) {
      setStatus({ message: "Error al limpiar.", type: "error" });
    } finally {
      setIsCleaning(false);
    }
  };

  const eliminarTodosLosPacks = async () => {
    const confirmacion = prompt("⚠️ ¡ADVERTENCIA EXTREMA!\n\nEsto borrará TODOS los packs pendientes sin importar su fecha. Escribe 'BORRAR' para confirmar.");
    if (confirmacion !== "BORRAR") {
      alert("Operación cancelada.");
      return;
    }
    
    setIsNuking(true);
    try {
      const snapshot = await getDocs(collection(db, "packs_pendientes"));
      if (snapshot.empty) {
        setStatus({ message: "La base de datos ya está vacía.", type: "success" });
      } else {
        await Promise.all(snapshot.docs.map(documento => deleteDoc(doc(db, "packs_pendientes", documento.id))));
        setStatus({ message: `¡Exterminio completo! Se pulverizaron ${snapshot.size} packs.`, type: "success" });
        setTotalPacksCount(0);
      }
    } catch (error) {
      setStatus({ message: "Error al intentar borrar todo.", type: "error" });
    } finally {
      setIsNuking(false);
    }
  };

  const procesarCatalogoMasivo = async () => {
    if (!bulkText.trim()) return;
    if (!confirm("¿Iniciar escaneo masivo?")) return;

    const lines = bulkText.split('\n');
    const parsedGames = [];
    let currentPlatform = "PS5";
    const sortedDictKeys = Object.keys(diccPlaystation).sort((a, b) => b.length - a.length);

    for (let line of lines) {
      if (line.includes("EXCLUSIVOS DE PS5")) currentPlatform = "PS5";
      else if (line.includes("EXCLUSIVOS DE PS4")) currentPlatform = "PS4";
      else if (line.includes("COMPATIBLES CON PS4 Y PS5")) currentPlatform = "PS4 / PS5";

      const match = line.match(/(?:🕹️|🎮|🔥)\s*(.+?)\s*—\s*\$(\d+(?:\.\d+)?)/);
      if (match) {
        const title = match[1].trim();
        const price = parseFloat(match[2]);
        const type = title.toLowerCase().match(/pack|bundle|trilogy|collection/) ? "Pack" : "Individual";
        let imageUrl = "https://i.ibb.co/Nn7y455b/20.jpg"; 
        
        const titleLower = title.toLowerCase();
        for (const key of sortedDictKeys) {
          if (titleLower.includes(key)) { 
            imageUrl = diccPlaystation[key]; 
            break; 
          }
        }
        parsedGames.push({ title, price, platform: currentPlatform, type, imageUrl });
      }
    }

    setBulkProgress({ current: 0, total: parsedGames.length, active: true });
    for (let i = 0; i < parsedGames.length; i++) {
      const pGame = parsedGames[i];
      const existingGame = games.find(g => g.title.toLowerCase() === pGame.title.toLowerCase());
      try {
        if (existingGame) {
           await fetch(`/api/games/${existingGame.id}`, {
             method: "PUT",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ ...existingGame, price: pGame.price, platform: pGame.platform, imageUrl: pGame.imageUrl }) 
           });
        } else {
           await fetch(`/api/games`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
                title: pGame.title, type: pGame.type, platform: pGame.platform,
                price: pGame.price, imageUrl: pGame.imageUrl,
                description: "Juego digital original garantizado.",
                isFeatured: false, isOnSale: false
             })
           });
        }
      } catch (err) { console.error(err); }
      setBulkProgress(prev => ({ ...prev, current: i + 1 }));
    }
    setBulkProgress({ current: 0, total: 0, active: false });
    setBulkText("");
    loadGames();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => {
      const newForm = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'title') {
        const tituloBuscado = value.toLowerCase();
        let urlEncontrada = "";
        const sortedDictKeys = Object.keys(diccPlaystation).sort((a, b) => b.length - a.length);
        for (const key of sortedDictKeys) {
          if (tituloBuscado.includes(key)) { urlEncontrada = diccPlaystation[key]; break; }
        }
        if (urlEncontrada && (!prev.imageUrl || prev.imageUrl.includes('ibb.co'))) {
          newForm.imageUrl = urlEncontrada;
        }
      }
      return newForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/games/${editingId}` : "/api/games";
    
    // Formateamos los datos antes de enviar
    const payload = {
      ...form,
      price: parseFloat(form.price),
      originalPrice: form.isOnSale && form.originalPrice ? parseFloat(form.originalPrice) : null
    };

    try {
      await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setForm(emptyForm); setEditingId(null);
      loadGames();
    } catch (error) { setStatus({ message: error.message, type: "error" }); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este juego de forma manual?")) return;
    setLoading(true);
    try {
      await fetch(`/api/games/${id}`, { method: "DELETE" });
      setStatus({ message: "Eliminado con éxito.", type: "success" });
      loadGames();
    } catch (error) { setStatus({ message: error.message, type: "error" }); } finally { setLoading(false); }
  };

  const startEditing = (game) => {
    setForm({
      title: game.title,
      type: game.type || "Individual",
      platform: game.platform || "PS5",
      description: game.description || "Juego digital original garantizado.",
      price: String(game.price),
      imageUrl: game.imageUrl,
      isFeatured: game.isFeatured || false,
      isOnSale: game.isOnSale || false,
      originalPrice: game.originalPrice ? String(game.originalPrice) : ""
    });
    setEditingId(game.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  // 🔥 LÓGICA DE FILTRADO ACTUALIZADA 🔥
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesName = game.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPlatform = filterPlatform === "All" || game.platform === filterPlatform;
      const matchesFeatured = !showOnlyFeatured || game.isFeatured; 
      return matchesName && matchesPlatform && matchesFeatured;
    });
  }, [games, searchTerm, filterPlatform, showOnlyFeatured]);

  const visibleGames = filteredGames.slice(0, inventoryLimit);
  
  // Extraemos cuántos juegos están destacados actualmente para tu panel visual
  const featuredGamesCount = games.filter(g => g.isFeatured).length;

  // ==========================================
  // 4. INTERFAZ GRÁFICA (UI)
  // ==========================================
  return (
    <div className="space-y-10 animate-in fade-in duration-700 min-h-screen p-8">
      {/* HEADER */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="panel p-8 md:col-span-2 bg-black/40 border border-white/10 rounded-xl">
          <p className="font-display text-[10px] uppercase tracking-[0.4em] text-purple-400">Control Center</p>
          <h1 className="mt-2 font-display text-4xl tracking-tighter text-white">GAME OVER ADMIN</h1>
          <div className="mt-8 flex gap-8">
            <div><p className="text-[10px] text-muted uppercase">Manual</p><p className="text-3xl font-bold text-neon">{games.length}</p></div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-[10px] text-muted uppercase">Packs Base de Datos</p>
              <p className="text-3xl font-bold text-blue-500">{totalPacksCount}</p>
            </div>
          </div>
        </div>
        <div className={`panel rounded-xl border-l-4 p-8 flex flex-col justify-center bg-black/40 ${status.type === 'success' ? 'border-l-green-500' : status.type === 'error' ? 'border-l-red-500' : 'border-l-yellow-500'}`}>
          <p className="text-sm text-white/90">{status.message}</p>
        </div>
      </section>

      {/* BANDEJA DE TELEGRAM */}
      <section className="space-y-4 bg-blue-900/10 border border-blue-500/20 p-6 rounded-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-blue-500/20 pb-4 gap-4">
          <h2 className="font-display text-xl uppercase text-blue-400 flex items-center gap-3">
            Bandeja Telegram
          </h2>
          <div className="flex gap-2">
            <button onClick={limpiarPacksVencidos} disabled={isCleaning} className="text-[10px] font-bold uppercase border px-4 py-2 bg-yellow-600/20 border-yellow-500 text-yellow-100 hover:bg-yellow-600 rounded transition-colors">
              {isCleaning ? '...' : '🧹 Limpiar +24h'}
            </button>
            <button onClick={eliminarTodosLosPacks} disabled={isNuking} className="text-[10px] font-bold uppercase border px-4 py-2 bg-red-900/40 border-red-500 text-red-100 hover:bg-red-700 rounded transition-colors">
              {isNuking ? 'Borrando...' : '🔥 EXTERMINAR TODOS'}
            </button>
          </div>
        </div>

        <div className="max-h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500/40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pendingPacks.map((pack) => (
              <div key={pack.id} className="bg-black/60 border border-white/10 rounded-lg overflow-hidden group relative">
                <button onClick={() => eliminarPackTelegram(pack.id)} className="absolute top-2 left-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 z-10">X</button>
                <div className="aspect-square"><img src={pack.url_imagen} className="w-full h-full object-cover" /></div>
                <div className="p-4 space-y-3">
                  <textarea value={pack.texto_telegram} onChange={(e) => handlePackTextChange(pack.id, e.target.value)} className="w-full text-[10px] bg-black/40 border border-white/10 rounded p-2 h-24 outline-none" />
                  <div className="flex gap-2">
                    <button onClick={() => copiarPack(pack.id, pack.texto_telegram)} className="flex-1 text-[9px] font-bold uppercase border border-white/10 py-2">{copiedId === pack.id ? 'Listo' : 'Copiar'}</button>
                    <button onClick={() => publicarPackTelegram(pack.id, pack.texto_telegram)} className="flex-1 text-[9px] font-bold uppercase bg-blue-600/40 border border-blue-500/50 py-2">Publicar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="py-8 text-center">
            <button 
              onClick={() => setPacksLimit(prev => prev + 8)}
              className="px-8 py-3 bg-blue-500/10 border border-blue-500/50 text-blue-400 text-[10px] uppercase font-black tracking-widest hover:bg-blue-500 hover:text-white transition-all rounded-full"
            >
              Ver siguientes 8 packs
            </button>
            <p className="mt-2 text-[9px] text-gray-500 uppercase tracking-widest">
              Viendo {pendingPacks.length} de {totalPacksCount} packs en total
            </p>
          </div>
        </div>
      </section>

      {/* ESCÁNER MASIVO */}
      <section className="bg-purple-900/10 border border-purple-500/20 p-6 rounded-xl space-y-4">
        <h2 className="font-display text-xl uppercase text-purple-400">Escáner Masivo</h2>
        <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} placeholder="Pega el catálogo aquí..." className="w-full h-32 bg-black/40 border border-white/10 rounded p-4 text-xs" />
        <button onClick={procesarCatalogoMasivo} disabled={bulkProgress.active} className="bg-purple-600 border border-purple-500 text-white px-6 py-2 text-xs uppercase font-bold hover:bg-purple-500 transition-colors">
          {bulkProgress.active ? `Procesando ${bulkProgress.current}/${bulkProgress.total}` : '🚀 Iniciar Escaneo'}
        </button>
      </section>

      {/* FORMULARIO E INVENTARIO */}
      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        
        {/* LADO IZQUIERDO: FORMULARIO */}
        <form onSubmit={handleSubmit} className="panel bg-black/40 border border-white/10 rounded-xl p-8 space-y-4 sticky top-24 h-fit">
          <h2 className="font-display text-xl uppercase tracking-widest border-b border-white/5 pb-4">
            {editingId ? "Editar Juego" : "Nuevo Ingreso"}
          </h2>
          <input required name="title" value={form.title} onChange={handleChange} placeholder="Título" className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm outline-none focus:border-neon" />
          
          <div className="grid grid-cols-2 gap-4">
            <select name="platform" value={form.platform} onChange={handleChange} className="bg-black/60 border border-white/10 px-4 py-3 text-sm outline-none">
              <option value="PS5">PS5</option>
              <option value="PS4">PS4</option>
              <option value="Nintendo Switch">Switch</option>
              <option value="PS4 / PS5">PS4 / PS5</option>
            </select>
            <input required type="number" step="0.01" name="price" value={form.price} onChange={handleChange} placeholder="Precio" className="bg-black/60 border border-white/10 px-4 py-3 text-sm outline-none" />
          </div>
          
          <input required name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="URL Imagen" className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm outline-none" />
          
          {/* SECCIÓN DE BOTONES VIP / OFERTAS */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <label className={`flex justify-center items-center gap-2 cursor-pointer p-3 border rounded transition-colors ${form.isFeatured ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-black/60 border-white/10'}`}>
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="w-4 h-4 accent-yellow-500" />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${form.isFeatured ? 'text-yellow-400' : 'text-muted'}`}>⭐ Destacar</span>
            </label>
            
            <label className={`flex justify-center items-center gap-2 cursor-pointer p-3 border rounded transition-colors ${form.isOnSale ? 'bg-red-500/10 border-red-500/50' : 'bg-black/60 border-white/10'}`}>
              <input type="checkbox" name="isOnSale" checked={form.isOnSale} onChange={handleChange} className="w-4 h-4 accent-red-500" />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${form.isOnSale ? 'text-red-400' : 'text-muted'}`}>🔥 En Oferta</span>
            </label>
          </div>

          {/* Precio Tachado (Solo si está en oferta) */}
          {form.isOnSale && (
            <input 
              type="number" step="0.01" name="originalPrice" value={form.originalPrice} onChange={handleChange} 
              placeholder="Precio Anterior Tachado (Ej: 29.99)" 
              className="w-full bg-red-900/20 border border-red-500/50 px-4 py-3 text-sm text-red-100 outline-none focus:border-red-500 animate-in fade-in" 
            />
          )}

          <div className="flex gap-2 pt-2">
             <button type="submit" className="w-full bg-neon hover:bg-green-400 transition-colors text-black py-3 font-bold uppercase text-xs">
               {editingId ? "Actualizar" : "Guardar Juego"}
             </button>
             {editingId && (
               <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="w-1/3 bg-gray-600 hover:bg-gray-500 text-white py-3 font-bold uppercase text-xs rounded">
                 Cancelar
               </button>
             )}
          </div>
        </form>

        {/* LADO DERECHO: INVENTARIO Y FILTROS */}
        <div className="space-y-4">
          
          {/* 🔥 BARRA DE BÚSQUEDA Y BOTÓN VIP 🔥 */}
          <div className="flex flex-col xl:flex-row gap-2">
            <input type="text" placeholder="Buscar juego..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full xl:flex-1 bg-black/40 border border-white/10 p-3 text-sm outline-none focus:border-neon rounded-lg" />
            
            <div className="flex gap-2">
              <select value={filterPlatform} onChange={(e) => setFilterPlatform(e.target.value)} className="flex-1 xl:flex-none bg-black/40 border border-white/10 p-3 text-sm outline-none rounded-lg">
                <option value="All">Consolas</option>
                <option value="PS4">PS4</option>
                <option value="PS5">PS5</option>
                <option value="PS4 / PS5">Dual</option>
              </select>
              
              {/* BOTÓN INTELIGENTE PARA VER DESTACADOS */}
              <button 
                onClick={() => setShowOnlyFeatured(!showOnlyFeatured)}
                className={`flex items-center justify-center text-[10px] font-bold uppercase border px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-300 ${showOnlyFeatured ? 'bg-yellow-500 border-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20'}`}
              >
                {showOnlyFeatured ? `⭐ Viendo VIP (${featuredGamesCount})` : `⭐ Filtrar VIP (${featuredGamesCount})`}
              </button>
            </div>
          </div>
          
          <div className="grid gap-3">
            {visibleGames.map((game) => (
              <div key={game.id} className={`panel p-4 bg-black/40 border flex gap-4 items-center rounded-lg transition-colors ${game.isFeatured ? 'border-yellow-500/30 hover:border-yellow-500' : 'border-white/5 hover:border-purple-500/50'}`}>
                <img src={game.imageUrl} className="h-16 w-12 object-cover rounded" />
                <div className="flex-1">
                  {/* TÍTULO CON ETIQUETA VIP */}
                  <p className="font-display uppercase text-sm line-clamp-1 flex items-center gap-2">
                    {game.title}
                    {game.isFeatured && <span title="Destacado en Inicio" className="text-yellow-500 text-[10px] bg-yellow-500/20 px-1.5 py-0.5 rounded tracking-widest font-bold">⭐ VIP</span>}
                  </p>
                  
                  <div className="flex gap-3 mt-1 items-center">
                    <p className="text-neon font-bold text-xs">${game.price}</p>
                    <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-white/70">{game.platform}</span>
                    {game.isOnSale && <span className="text-[9px] text-red-400 border border-red-400/30 px-1.5 rounded">Oferta</span>}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                  <button onClick={() => startEditing(game)} className="text-[10px] font-bold text-muted hover:text-white transition-colors border border-white/10 md:border-none px-2 py-1 md:p-0 rounded">EDITAR</button>
                  <button onClick={() => handleDelete(game.id)} className="text-[10px] font-bold text-red-500 hover:text-red-400 transition-colors border border-red-500/20 md:border-none px-2 py-1 md:p-0 rounded">BORRAR</button>
                </div>
              </div>
            ))}
          </div>

          {inventoryLimit < filteredGames.length && (
            <div className="pt-4 pb-10 text-center">
              <button 
                onClick={() => setInventoryLimit(prev => prev + 10)}
                className="px-6 py-2 border border-white/20 text-white/70 text-[10px] uppercase font-bold hover:bg-white/10 transition-colors rounded-full"
              >
                Cargar más ({filteredGames.length - inventoryLimit} restantes)
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}