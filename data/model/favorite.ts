export interface Favorite {
  createdAt: string;
  id: string;
  image: string;
  name: string;
  notes: string;
  pokemonId: number;
  updatedAt: string;
  userId: string;
  types?: string[];
}
