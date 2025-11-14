"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Label } from "./ui/label";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  loading?: boolean;
  onClear: (query: string) => void;
}

export function SearchBar({
  onSearch,
  placeholder,
  loading,
  onClear,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-2 items-center lg:flex-row">
      <div className="flex flex-col gap-1 w-full sm:max-w-sm -mt-6">
        <Label
          htmlFor="search"
          className="text-sm font-medium text-muted-foreground"
        >
          Search by name or code
        </Label>

        <Input
          id="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || "Ex: Pikachu or 025"}
          className="p-3 text-sm"
        />
      </div>
      <Button type="submit" disabled={loading} className="pointer">
        <Search className="mr-1 h-4 w-4" />
        Search
      </Button>
      <Button
        onClick={() => {
          setQuery("");
          onClear("");
        }}
        variant="outline"
        className="pointer"
      >
        Clear
      </Button>
    </form>
  );
}
