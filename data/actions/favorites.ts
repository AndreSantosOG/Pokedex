import { PokemonBasic } from "@/data/model/pokemon"
import { api } from "../../lib/axios"

const USER_ID_KEY = "pokedex_user_id"

function getOrCreateUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(USER_ID_KEY, id)
  }
  return id
}
export async function getFavorites() {
  const userId = getOrCreateUserId()
  const { data } = await api.get("/favorites", { params: { userId } })
  return data
}

export async function addFavorite(pokemon: PokemonBasic) {
  const userId = getOrCreateUserId()
  const { data } = await api.post("/favorites", { userId, pokemon })
  return data
}

export async function removeFavorite(pokemonId: number) {
  const userId = getOrCreateUserId()
  const { data } = await api.delete("/favorites", { params: { userId, pokemonId } })
  return data
}

export async function updateFavoriteNote(pokemonId: number, notes: string) {
  const userId = getOrCreateUserId()
  const { data } = await api.put("/favorites", { userId, pokemonId, notes })
  return data
}