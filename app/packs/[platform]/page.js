import ProductGrid from "@/components/ProductGrid";
import PageHero from "@/components/PageHero";
import { getAllGames } from "@/lib/catalog";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export default async function PacksPage({ params }) {
  const resolvedParams = await params;
  const platformParam = resolvedParams.platform?.toLowerCase(); 
  
  // 1. Obtener catálogo manual
  const allManualGames = await getAllGames();

  // 2. Obtener packs de Telegram desde Firebase
  let telegramPacks = [];
  try {
    const packsRef = collection(db, "packs_pendientes");
    const q = query(
      packsRef,
      where("estado", "==", "publicado"),
      orderBy("fecha_creacion", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    // LOG DE CONTROL: Revisa tu terminal de VS Code para ver este número
    console.log(`🔎 Firebase: Encontrados ${querySnapshot.size} packs publicados`);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Limpiamos el precio: viene como "22" o "21,5"
      const cleanPrice = typeof data.precio_final === 'string' 
        ? parseFloat(data.precio_final.replace(',', '.')) 
        : data.precio_final;

      telegramPacks.push({
        id: doc.id,
        title: `Pack IDG${data.pack_id}`,
        type: "Pack",
        platform: "Nintendo Switch", // Forzamos este nombre para que coincida con tu filtro
        price: cleanPrice || 0,
        imageUrl: data.url_imagen,
        isOnSale: true,
        originalPrice: null,
        description: data.texto_telegram,
        isTelegram: true
      });
    });
  } catch (error) {
    console.error("❌ Error Firebase Packs:", error);
  }

  // 3. Fusionar
  const combinedGames = [...telegramPacks, ...allManualGames];

  // 4. Filtrar con lógica tolerante
  const products = combinedGames.filter((game) => {
    const isPack = game.type === "Pack";
    let isCorrectPlatform = false;

    // Convertimos a minúsculas para comparar sin errores
    const gamePlatform = game.platform?.toLowerCase();

    if (platformParam === "ps5") {
      isCorrectPlatform = gamePlatform.includes("ps5");
    } else if (platformParam === "ps4") {
      isCorrectPlatform = gamePlatform.includes("ps4");
    } else if (platformParam === "nintendo") {
      // Esta línea es la que probablemente estaba fallando:
      isCorrectPlatform = gamePlatform.includes("nintendo") || gamePlatform.includes("switch");
    }

    return isPack && isCorrectPlatform;
  });

  // LOG DE CONTROL FINAL
  console.log(`📦 Total de productos a mostrar en ${platformParam}: ${products.length}`);

  const titleName = platformParam === "nintendo" ? "Nintendo Switch" : platformParam?.toUpperCase();

  return (
    <main className="pb-24">
      <PageHero
        eyebrow="Ahorra Más"
        title={`Combos y Packs ${titleName}`}
        description={`Lleva más pagando menos. Nuestras colecciones de juegos para ${titleName} al mejor precio.`}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-10">
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-20 opacity-50">
            <p>No hay packs disponibles en este momento para {titleName}.</p>
          </div>
        )}
      </div>
    </main>
  );
}