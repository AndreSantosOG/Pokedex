export interface PokemonBasic {
  id: number
  name: string
  image: string
  types: string[]
  notes?: string
}

export interface PokemonDetail extends PokemonBasic {
  height: number
  weight: number
  abilities: string[]
  stats: {
    hp: number
    attack: number
    defense: number
    spAtk: number
    spDef: number
    speed: number
  }
}

export interface PokemonType {
  slot: number
  type: {
    name: string
    url: string
  }
}
export interface PokemonAbility {
  ability: {
    name: string
    url: string
  }
  is_hidden: boolean
  slot: number
}
export interface PokemonSearchType {
  slot: number
  pokemon: {
    name: string
    url: string
  }
}
