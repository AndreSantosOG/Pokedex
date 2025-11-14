import { PokemonAbility, PokemonBasic, PokemonDetail, PokemonSearchType, PokemonType } from "@/data/model/pokemon"

const POKE_API = "https://pokeapi.co/api/v2"

export async function fetchPokemonList(
  limit = 151,
  offset = 0
): Promise<{ results: PokemonBasic[]; count: number; hasMore: boolean }> {
  try {
    const res = await fetch(`${POKE_API}/pokemon?limit=${limit}&offset=${offset}`)
    const data = await res.json()

    const pokemons = await Promise.all(
      data.results.map(async (pokemon: { name: string; url: string }) => {
        const id = Number.parseInt(pokemon.url.split("/").filter(Boolean).pop() || "0")

        try {
          const detailRes = await fetch(`${POKE_API}/pokemon/${id}`)
          const detailData = await detailRes.json()
          const types = detailData.types.map((t: PokemonType) => t.type.name)

          return {
            id,
            name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            image: detailData.sprites.other?.["official-artwork"]?.front_default,
            types,
          }
        } catch {
          return {
            id,
            name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            types: [],
          }
        }
      })
    )

    const hasMore = data.next !== null
    const count = data.count ?? pokemons.length 

    return { results: pokemons, count, hasMore }
  } catch (error) {
    console.error("Error fetching Pokémon list:", error)
    return { results: [], count: 0, hasMore: false }
  }
}

export async function searchPokemon(query: string): Promise<PokemonBasic | null> {
  if (!query.trim()) return null;

  const searchTerm = isNaN(Number(query)) ? query.toLowerCase() : Number(query);

  try {
    const res = await fetch(`${POKE_API}/pokemon/${searchTerm}`);
    if (!res.ok) return null;

    const data = await res.json();
    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      image: data.sprites.other["official-artwork"].front_default,
      types: data.types.map((t: PokemonType) => t.type.name),
    };
  } catch (error) {
    console.error("Error searching Pokémon:", error);
    return null;
  }
}

export async function fetchPokemonDetail(idOrName: string | number): Promise<PokemonDetail | null> {
  try {
    const res = await fetch(`${POKE_API}/pokemon/${idOrName}`)
    if (!res.ok) return null

    const data = await res.json()
    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      image: data.sprites.other["official-artwork"].front_default,
      types: data.types.map((t: PokemonType) => t.type.name),
      height: data.height / 10,
      weight: data.weight / 10,
      abilities: data.abilities.map(
        (a: PokemonAbility) => a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)
      ),
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        spAtk: data.stats[3].base_stat,
        spDef: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
      },
    }
  } catch (error) {
    console.error("Error fetching Pokémon detail:", error)
    return null
  }
}

export async function fetchPokemonByType(
  type: string,
  limit = 151,
  offset = 0
): Promise<{ results: PokemonBasic[]; hasMore: boolean }> {
  try {
    const res = await fetch(`${POKE_API}/type/${type.toLowerCase()}`)
    if (!res.ok) return { results: [], hasMore: false }

    const data = await res.json()
    const allPokemons = data.pokemon.map((p: PokemonSearchType) => p.pokemon.name)
    const slice = allPokemons.slice(offset, offset + limit)

    const results = await Promise.all(
      slice.map(async (name: string) => {
        const detail = await fetchPokemonDetail(name)
        return (
          detail || {
            id: 0,
            name,
            image: "",
            types: [],
          }
        )
      })
    )

    const hasMore = offset + limit < allPokemons.length

    return { results, hasMore }
  } catch (error) {
    console.error("Error fetching Pokémon by type:", error)
    return { results: [], hasMore: false }
  }
}
