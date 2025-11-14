import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 })
  }

  const favorites = await prisma.favorite.findMany({ where: { userId } })
  return NextResponse.json(favorites)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { userId, pokemon } = body

  if (!userId || !pokemon) {
    return NextResponse.json({ error: "invalid data" }, { status: 400 })
  }

  const favorite = await prisma.favorite.create({
    data: {
      userId,
      pokemonId: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      notes: pokemon.notes,
    },
  })

  return NextResponse.json(favorite)
}
export async function PUT(req: Request) {
  const body = await req.json()
  const { userId, pokemonId, notes } = body

  if (!userId || !pokemonId) {
    return NextResponse.json({ error: "userId and pokemonId are required" }, { status: 400 })
  }

  const favorite = await prisma.favorite.updateMany({
    where: { userId, pokemonId },
    data: { notes },
  })

  if (favorite.count === 0) {
    return NextResponse.json({ error: "favorite not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true, message: "note updated successfully" })
}
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const pokemonId = searchParams.get("pokemonId")

  if (!userId || !pokemonId) {
    return NextResponse.json({ error: "parameters are required" }, { status: 400 })
  }

  await prisma.favorite.deleteMany({
    where: { userId, pokemonId: Number(pokemonId) },
  })

  return NextResponse.json({ success: true })
}