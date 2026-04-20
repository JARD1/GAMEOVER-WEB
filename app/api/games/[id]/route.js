import { deleteGame, getGameById, updateGame } from "@/lib/catalog";
import { isFirebaseConfigured } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

function validateGamePayload(payload) {
  if (!payload.title || !payload.type || !payload.platform || !payload.description || !payload.imageUrl) {
    return "Todos los campos son obligatorios.";
  }

  if (Number.isNaN(Number(payload.price))) {
    return "El precio debe ser numérico.";
  }

  return null;
}

export async function GET(_request, { params }) {
  // Desestructuramos params después de esperar la promesa
  const { id } = await params;
  const game = await getGameById(id);

  if (!game) {
    return NextResponse.json({ error: "Juego no encontrado." }, { status: 404 });
  }

  return NextResponse.json({ game });
}

export async function PUT(request, { params }) {
  const { id } = await params;
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

  const game = await updateGame(id, payload);

  if (!game) {
    return NextResponse.json({ error: "Juego no encontrado." }, { status: 404 });
  }

  return NextResponse.json({
    message: "Juego actualizado correctamente.",
    game
  });
}

export async function DELETE(_request, { params }) {
  const { id } = await params;

  if (!isFirebaseConfigured()) {
    return NextResponse.json(
      { error: "Firebase no esta configurado. Completa las variables del archivo .env.local." },
      { status: 500 }
    );
  }

  const deletedGame = await deleteGame(id);

  if (!deletedGame) {
    return NextResponse.json({ error: "Juego no encontrado." }, { status: 404 });
  }

  return NextResponse.json({
    message: "Juego eliminado correctamente.",
    game: deletedGame
  });
}