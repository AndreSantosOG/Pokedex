"use client";

import { PokemonDetailModal } from "@/components/pokemon-detail-modal";
import { PokemonGrid } from "@/components/pokemon-grid";
import { SearchBar } from "@/components/search-bar";
import { Button } from "@/components/ui/button";
import { POKEMON_TYPES } from "@/constant/pokemon-types";
import { queryKeys } from "@/constant/query-keys";
import { getFavorites } from "@/data/actions/favorites";
import {
  fetchPokemonByType,
  fetchPokemonDetail,
  fetchPokemonList,
  searchPokemon,
} from "@/data/actions/pokemon-api";
import { Favorite } from "@/data/model/favorite";
import { PokemonBasic, PokemonDetail } from "@/data/model/pokemon";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [selectedType, setSelectedType] = useState("todos-tipos");
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null);
  const [isRedTheme, setIsRedTheme] = useState(true);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(200);

  const { data: pokemonData, isLoading: loading } = useQuery({
    queryKey: [queryKeys.pokemons, selectedType, offset],
    queryFn: async () => {
      if (selectedType === "todos-tipos") {
        return await fetchPokemonList(limit, offset);
      } else {
        const result = await fetchPokemonByType(selectedType, limit);
        return {
          results: result.results,
          count: result.results.length,
          hasMore: result.hasMore,
        };
      }
    },
  });

  const pokemonList = useMemo(() => pokemonData?.results || [], [pokemonData]);
  const totalPokemons = useMemo(() => pokemonData?.count || 0, [pokemonData]);
  const totalPages = Math.ceil(totalPokemons / limit);

  const { data: favorites = [], isLoading: favLoading } = useQuery({
    queryKey: [queryKeys.favorites],
    queryFn: getFavorites,
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return null;
      const result = await searchPokemon(searchQuery);
      return result ? [result] : [];
    },
    enabled: !!searchQuery,
  });

  const displayList =
    activeTab === "favorites"
      ? favorites.map((f: Favorite) => ({
          id: f.pokemonId,
          name: f.name,
          image: f.image,
          types: f.types || [],
        }))
      : searchQuery
      ? searchResults ?? []
      : pokemonList ?? [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectPokemon = async (pokemon: PokemonBasic) => {
    const detail = await fetchPokemonDetail(pokemon.id);
    if (detail) setSelectedPokemon(detail);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setIsRedTheme((prev) => !prev);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div
        style={{
          backgroundImage: `url('${isRedTheme ? "bg-red.svg" : "bg-blue.svg"}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="animate-smooth-fade relative w-full py-8 md:py-12 text-white overflow-hidden transition-all duration-1000"
      >
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <Image
              src="pokemon-title.svg"
              alt="Pokémon"
              width={150}
              height={150}
              className="h-8 md:h-10"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-center text-pretty mb-2">
            {isRedTheme ? "Who's that Pokémon?" : "Catch them all!"}
          </h1>
          <p className="text-center text-white/90 mb-12">
            The perfect guide for anyone who wants to hunt Pokémon around the worlds.
          </p>

          <div className="flex justify-center mb-4">
            <div className="relative w-68 h-68 md:w-64 md:h-64"></div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2",
          !isRedTheme ? "lg:-bottom-5 bottom-14" : "lg:-bottom-20 bottom-5"
        )}
      >
        <div className="w-70 h-70 lg:w-110 lg:h-100">
          {isRedTheme ? (
            <Image
              src="poke-red.svg"
              alt="Pokéball"
              width={1}
              height={1}
              className="w-full h-full drop-shadow-2xl object-contain transition-all animate-smooth-fade duration-5"
            />
          ) : (
            <Image
              src="poke-blue.svg"
              alt="Pokéball"
              width={1}
              height={1}
              className="w-full h-full drop-shadow-2xl object-contain transition-all animate-smooth-fade duration-5 "
            />
          )}
        </div>
      </div>
      <div>
        <div className="w-full flex flex-col gap-6 lg:flex-row justify-between items-center p-20 pl-25 pr-28 bg-[#EFF3F6]">
          <h2 className="text-3xl font-bold mt-4">Select your Pokémon</h2>
          <div className="w-full md:w-[400px] mt-4">
            {activeTab !== "favorites" && <SearchBar onSearch={handleSearch} loading={searchLoading} onClear={handleSearch} />}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div
            className="lg:col-span-1 block"
          >
            <div className="space-y-4">
              <div className="flex gap-2 mb-6">
                <Button
                  variant={activeTab === "browse" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("browse")}
                  className="flex-1"
                >
                  Explore
                </Button>
                <Button
                  variant={activeTab === "favorites" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("favorites")}
                  className="flex-1 gap-2"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">({favorites.length})</span>
                </Button>
              </div>

              {activeTab === "browse" && (
                <div className="space-y-1 border-t pt-4 max-h-96 overflow-y-auto">
                  {POKEMON_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 cursor-pointer ${
                        selectedType === type.id
                          ? "text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="text-base">{type.icon}</span>
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <PokemonGrid
              pokemon={displayList}
              loading={loading || favLoading}
              activeTab={activeTab}
              onSelectPokemon={handleSelectPokemon}
              favoriteList={favorites}
              page={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
                setOffset((newPage - 1) * limit);
              }}
            />
          </div>
        </div>
      </div>
      {selectedPokemon && (
        <PokemonDetailModal
          pokemon={selectedPokemon}
          loading={false}
          onClose={() => setSelectedPokemon(null)}
          isFav={favorites.some((fav: Favorite) => fav.pokemonId === selectedPokemon.id)}
          favoriteList={favorites}
        />
      )}
    </div>
  );
}
