"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { typeColors } from "@/constant/pokemon-types-colors";
import {
  addFavorite,
  removeFavorite,
  updateFavoriteNote,
} from "@/data/actions/favorites";
import { Favorite } from "@/data/model/favorite";
import { PokemonDetail } from "@/data/model/pokemon";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { queryKeys } from "@/constant/query-keys";

interface PokemonDetailProps {
  pokemon: PokemonDetail | null;
  loading?: boolean;
  onClose: () => void;
  isFav: boolean;
  favoriteList?: Favorite[];
}

export function PokemonDetailModal({
  pokemon,
  loading,
  onClose,
  isFav,
  favoriteList,
}: PokemonDetailProps) {
  const [notes, setNotes] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const [favorited, setFavorited] = useState(isFav);

  useEffect(() => {
    setFavorited(isFav);
  }, [isFav]);

  useEffect(() => {
    if (!pokemon || !isFav) {
      setNotes("");
      return;
    }
    const fav = favoriteList?.find((f) => f.pokemonId === pokemon.id);
    setNotes(fav?.notes ?? "");
  }, [isFav, pokemon?.id, favoriteList]);

  const mutation = useMutation({
    mutationFn: async (newFav: boolean) => {
      if (newFav) {
        await addFavorite({
          id: pokemon!.id,
          name: pokemon!.name,
          image: pokemon!.image,
          types: pokemon!.types,
          notes: "",
        });
      } else {
        await removeFavorite(pokemon!.id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.favorites] });
    },
  });
  if (!pokemon && !loading) return null;

  if (!pokemon) return null;

  const handleSaveNotes = async () => {
    try {
      if (isFav) {
        await updateFavoriteNote(pokemon.id, notes);
        await queryClient.invalidateQueries({ queryKey: [queryKeys.favorites] });
      }

      toast.success(`Notes for ${pokemon.name} saved successfully!`);
      setIsEditing(false);
    } catch (e) {
      toast.error("Could not save notes. Try again!");
    }
  };

  function handleFavoriteClick() {
    const newFav = !favorited;
    setFavorited(newFav);
    mutation.mutate(newFav, {
      onSuccess: () => {
        toast.success(
          newFav
            ? `${pokemon!.name} added to favorites`
            : `${pokemon!.name} removed from favorites`
        );
      },
      onError: () => {
        toast.error("Error updating favorite.");
        setFavorited(!newFav);
      },
    });
  }

  const getStatColor = (value: number) => {
    if (value >= 130) return "bg-green-500";
    if (value >= 100) return "bg-blue-500";
    if (value >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Dialog open={!!pokemon || loading} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        {loading ? (
          <Card className="flex items-center justify-center w-full ">
            <Image
              src="loading.svg"
              alt="Loading"
              width={96}
              height={96}
              className="w-24 h-24 animate-spin-pokeball"
            />
          </Card>
        ) : (
          pokemon && (
            <ScrollArea className="h-[80vh]">
              <DialogTitle></DialogTitle>
              <button
                onClick={onClose}
                className="cursor-pointer absolute right-4 top-4 rounded-full bg-background hover:bg-muted p-2 z-10"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="p-6 pb-0">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      #{String(pokemon.id).padStart(3, "0")}
                    </p>
                    <h1 className="text-3xl font-bold capitalize">
                      {pokemon.name}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 items-center p-7 pb-0">
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Height</p>
                    <p className="text-lg font-semibold">{pokemon.height}m</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="text-lg font-semibold">{pokemon.weight}kg</p>
                  </div>
                </div>

                <div className="-mt-1">
                  <p className="text-sm font-semibold mb-1">Types</p>
                  <div className="flex flex-wrap gap-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className={`${
                          typeColors[type] || "bg-gray-400"
                        } rounded-full px-3 py-1 text-sm font-semibold text-white capitalize`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 p-6">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-square bg-linear-to-b from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg">
                    {pokemon.image ? (
                      <Image
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="h-full w-full object-contain p-6"
                        width={300}
                        height={300}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        No image available
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleFavoriteClick}
                    variant={favorited ? "default" : "outline"}
                    className="mt-4 w-full"
                  >
                    <Heart
                      className={`mr-2 h-4 w-4 ${
                        favorited ? "fill-current" : ""
                      }`}
                    />
                    {favorited ? "In Favorites" : "Add to Favorites"}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-2">Abilities</p>
                    <div className="flex flex-wrap gap-2 max-w-[200px]">
                      {pokemon.abilities.map((ability) => (
                        <span
                          key={ability}
                          className="rounded-full px-3 py-1 text-xs font-medium bg-gray-200 text-accent-foreground capitalize"
                        >
                          {ability}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm font-semibold mb-3">Stats</p>

                  <div className="space-y-2">
                    {[
                      { label: "HP", value: pokemon.stats.hp },
                      { label: "Attack", value: pokemon.stats.attack },
                      { label: "Defense", value: pokemon.stats.defense },
                      { label: "Sp. Attack", value: pokemon.stats.spAtk },
                      { label: "Sp. Defense", value: pokemon.stats.spDef },
                      { label: "Speed", value: pokemon.stats.speed },
                    ].map((stat) => (
                      <div key={stat.label} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{stat.label}</span>
                          <span>{stat.value}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full ${getStatColor(
                              stat.value
                            )} transition-all`}
                            style={{
                              width: `${Math.min(
                                (stat.value / 150) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {isFav && (
                <div className="w-full border-t p-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Notes</p>
                    <Button
                      variant="ghost"
                      className={cn(isEditing && "hidden")}
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      Edit
                    </Button>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add your notes about this Pokémon…"
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveNotes}
                          className="flex-1"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground rounded-md bg-muted p-2 min-h-16">
                      {notes || "No notes added"}
                    </p>
                  )}
                </div>
              )}
            </ScrollArea>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}
