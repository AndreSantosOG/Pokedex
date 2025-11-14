"use client";


import Image from "next/image";
import { PokemonCard } from "./pokemon-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { PokemonBasic } from "@/data/model/pokemon";
import { Favorite } from "@/data/model/favorite";

interface PokemonGridProps {
  pokemon: PokemonBasic[];
  loading?: boolean;
  activeTab: string;
  onSelectPokemon: (pokemon: PokemonBasic) => void;
  favoriteList?: Favorite[]; 
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function PokemonGrid({
  pokemon,
  loading,
  onSelectPokemon,
  favoriteList,
  page,
  totalPages,
  onPageChange,
  activeTab
}: PokemonGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Image
          src="loading.svg"
          alt="Loading"
          width={64}
          height={64}
          className="w-16 h-16 animate-spin-pokeball"
        />
      </div>
    );
  }

  if (!pokemon.length) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No Pokémon found
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Image src="poke-icon.svg" alt="Pokeball" width={16} height={16} /> {pokemon.length === 151 ? totalPages! * 151 : pokemon.length} Pokémons
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pokemon.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            isFav={favoriteList!.some((f) => f.pokemonId === p.id)}
            onSelectPokemon={() => onSelectPokemon(p)}
          />
        ))}
      </div>
      {totalPages && totalPages > 1 && activeTab === "browse" && (
        <div className="justify-center items-center flex">
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                onClick={() => onPageChange?.(Math.max(1, (page ?? 1) - 1))}
              />
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => onPageChange?.(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                onClick={() =>
                  onPageChange?.(Math.min(totalPages, (page ?? 1) + 1))
                }
              />
            </PaginationContent>
          </Pagination>
          </div>
        )}
    </div>
  );
}
