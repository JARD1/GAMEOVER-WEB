import { createGame, getAllGames } from "@/lib/catalog";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

function validateGamePayload(payload) {
  if (!payload.title || !payload.type || !payload.platform || !payload.description || !payload.imageUrl) {
    return "Todos los campos son obligatorios.";
  }

  if (Number.isNaN(Number(payload.price))) {
    return "El precio debe ser numerico.";
  }

  return null;
}

export async function GET() {
  return NextResponse.json({
    games: await getAllGames(),
    firebaseConfigured: isFirebaseConfigured()
  });
}

export async function POST(request) {
  const payload = await request.json();
  const validationError = validateGamePayload(payload);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  if (!isFirebaseConfigured()) {
    return NextResponse.json(
      { error: "Firebase no esta configurado. Completa las variables del archivo .env.local." },
      { status: 500 }
    );
  }

  const game = await createGame(payload);

  return NextResponse.json(
    {
      message: "Juego creado correctamente.",
      game
    },
    { status: 201 }
  );
}
