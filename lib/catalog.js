import { getAdminDb, isFirebaseConfigured } from "@/lib/firebase-admin";
import { initialGames } from "@/lib/mock-data";

const COLLECTION_NAME = "games";
const TESTIMONIALS_COLLECTION = "testimonials"; // Nueva colección para las historias

function normalizeGame(doc) {
  const data = doc.data();

  return {
    id: doc.id,
    title: data.title,
    type: data.type,
    platform: data.platform,
    description: data.description,
    price: Number(data.price),
    imageUrl: data.imageUrl,
    isFeatured: Boolean(data.isFeatured),
    // NUEVOS CAMPOS DE OFERTA
    isOnSale: Boolean(data.isOnSale),
    originalPrice: data.originalPrice ? Number(data.originalPrice) : null
  };
}

function normalizeTestimonial(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    platform: data.platform || "WhatsApp",
    imageUrl: data.imageUrl,
    createdAt: data.createdAt
  };
}

export async function getAllGames() {
  if (!isFirebaseConfigured()) {
    return initialGames;
  }

  const db = getAdminDb();
  const snapshot = await db.collection(COLLECTION_NAME).orderBy("createdAt", "desc").get();
  return snapshot.docs.map(normalizeGame);
}

export async function getGamesByType(type) {
  const games = await getAllGames();
  return games.filter((game) => game.type === type);
}

export async function getGameById(id) {
  if (!isFirebaseConfigured()) {
    return initialGames.find((game) => game.id === id) ?? null;
  }

  const db = getAdminDb();
  const doc = await db.collection(COLLECTION_NAME).doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return normalizeGame(doc);
}

export async function createGame(payload) {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase no esta configurado.");
  }

  const db = getAdminDb();
  const docRef = await db.collection(COLLECTION_NAME).add({
    ...payload,
    price: Number(payload.price),
    originalPrice: payload.originalPrice ? Number(payload.originalPrice) : null, // NUEVO
    isFeatured: Boolean(payload.isFeatured),
    isOnSale: Boolean(payload.isOnSale), // NUEVO
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const doc = await docRef.get();
  return normalizeGame(doc);
}

export async function updateGame(id, payload) {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase no esta configurado.");
  }

  const db = getAdminDb();
  const ref = db.collection(COLLECTION_NAME).doc(id);
  const existing = await ref.get();

  if (!existing.exists) {
    return null;
  }

  await ref.update({
    ...payload,
    price: Number(payload.price),
    originalPrice: payload.originalPrice ? Number(payload.originalPrice) : null, // NUEVO
    isFeatured: Boolean(payload.isFeatured),
    isOnSale: Boolean(payload.isOnSale), // NUEVO
    updatedAt: new Date().toISOString()
  });

  const updated = await ref.get();
  return normalizeGame(updated);
}

export async function deleteGame(id) {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase no esta configurado.");
  }

  const db = getAdminDb();
  const ref = db.collection(COLLECTION_NAME).doc(id);
  const existing = await ref.get();

  if (!existing.exists) {
    return null;
  }

  const game = normalizeGame(existing);
  await ref.delete();
  return game;
}

// NUEVO: Función para obtener los testimonios de Firestore
export async function getTestimonials() {
  if (!isFirebaseConfigured()) {
    // Fallback visual si estás trabajando en local sin Firebase
    return [
      {
        id: "mock1",
        platform: "WhatsApp",
        imageUrl: "https://i.ibb.co/2cZT9P8/mock-whatsapp.jpg", 
        createdAt: new Date().toISOString()
      },
      {
        id: "mock2",
        platform: "Instagram",
        imageUrl: "https://i.ibb.co/L5hS0tG/mock-instagram.jpg",
        createdAt: new Date().toISOString()
      }
    ];
  }

  const db = getAdminDb();
  try {
    const snapshot = await db.collection(TESTIMONIALS_COLLECTION).orderBy("createdAt", "desc").get();
    return snapshot.docs.map(normalizeTestimonial);
  } catch (error) {
    console.error("Error al obtener testimonios:", error);
    return []; // Retorna un array vacío para evitar que la página se rompa si la colección no existe aún
  }
}