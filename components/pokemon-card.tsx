"use client";

import { Card } from "@/components/ui/card";
import { typeColors } from "@/constant/pokemon-types-colors";
import { queryKeys } from "@/constant/query-keys";
import { addFavorite, removeFavorite } from "@/data/actions/favorites";
import { PokemonBasic } from "@/data/model/pokemon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PokemonCardProps {
  pokemon: PokemonBasic;
  isFav: boolean;
  onSelectPokemon: (pokemon: PokemonBasic) => void;
}

export function PokemonCard({
  pokemon,
  isFav,
  onSelectPokemon,
}: PokemonCardProps) {
  const queryClient = useQueryClient();
  const [favorited, setFavorited] = useState(isFav);

  useEffect(() => {
    setFavorited(isFav);
  }, [isFav]);

  const mutation = useMutation({
    mutationFn: async (newFav: boolean) => {
      if (newFav) {
        await addFavorite({
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.image,
          types: pokemon.types,
          notes: "",
        });
      } else {
        await removeFavorite(pokemon.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.favorites] });
    },
  });

  function handleFavoriteClick() {
    const newFav = !favorited;
    setFavorited(newFav);
    mutation.mutate(newFav, {
      onSuccess: () => {
        toast.success(
          newFav
            ? `${pokemon.name} added to favorites`
            : `${pokemon.name} removed from favorites`
        );
      },
      onError: () => {
        toast.error("Something went wrong while updating favorites.");
        setFavorited(!newFav);
      },
    });
  }

  return (
    <Card
      onClick={() => onSelectPokemon(pokemon)}
      className="group relative cursor-pointer overflow-hidden transition-all hover:shadow-lg"
    >
      <div className="relative aspect-square bg-linear-to-b from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <Image
          src={pokemon.image || "/placeholder.svg"}
          alt={pokemon.name}
          className="h-full w-full object-contain p-4"
          width={200}
          height={200}
        />

        <button
          className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-gray-200 cursor-pointer dark:bg-gray-800/90 dark:hover:bg-gray-700"
          onClick={(event) => {
            event.stopPropagation();
            handleFavoriteClick();
          }}
        >
          <Heart
            className={`h-4 w-4 transition-all ${
              favorited
                ? "fill-primary text-primary"
                : "text-muted-foreground group-hover:text-primary"
            }`}
          />
        </button>
      </div>

      <div className="space-y-2 p-3">
        <p className="truncate font-semibold text-sm">{pokemon.name}</p>
        <p className="text-xs text-muted-foreground">
          #{String(pokemon.id).padStart(3, "0")}
        </p>

        {pokemon.types.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {pokemon.types.slice(0, 2).map((type) => (
              <span
                key={type}
                className={`${
                  typeColors[type] || "bg-gray-400"
                } rounded-full px-2 py-0.5 text-xs font-semibold text-white capitalize`}
              >
                {type}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
