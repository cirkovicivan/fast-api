"use client";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { useEffect, useRef, useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import Image from "next/image";

type Database = "redis" | "postgres";

const DATABASE_ENDPOINTS: Record<Database, string> = {
  redis: "search",
  postgres: "search-postgres",
};

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [db, setDb] = useState<Database>("redis");

  const [searchResults, setSearchResults] = useState<{
    results: string[];
    duration: number;
  }>();

  const latestRequest = useRef(0);

  useEffect(() => {
    const query = input.trim();
    const requestId = ++latestRequest.current;

    if (!query) {
      setSearchResults(undefined);
      return;
    }

    async function fetchData() {
      try {
        const endpoint = DATABASE_ENDPOINTS[db];
        const url = new URL(
          `https://fastapi.cirko007ivan.workers.dev/api/${endpoint}`,
        );

        url.searchParams.set("q", query);

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Search failed: ${res.status}`);
        }

        const data = (await res.json()) as {
          results: string[];
          duration: number;
        };

        if (latestRequest.current === requestId) {
          setSearchResults(data);
        }
      } catch (error) {
        if (latestRequest.current === requestId) {
          console.error("Search failed:", error);
        }
      }
    }

    void fetchData();
  }, [input, db]);

  return (
    <main className="h-screen w-screen white">
      <div className="flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <h1 className="text-5xl tracking-tight font-bold">SpeedSearch⚡</h1>
        <p className="text-zinc-600 text-lg max-w-prose text-center">
          A high-performance API built with Hono, Next.js and Cloudflare. <br />
          Type a query below and get your results in miliseconds.
        </p>

        <div className="mx-auto w-full max-w-2xl">
          <Command className="rounded-xl border shadow-sm">
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder="Search countries..."
              className="placeholder:text-zinc-500"
            />

            <CommandList className="max-h-80">
              {searchResults?.results.length === 0 ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : null}

              {searchResults?.results && (
                <CommandGroup heading="Results">
                  {searchResults.results.map((result) => (
                    <CommandItem
                      key={result}
                      value={result}
                      onSelect={setInput}
                    >
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>

            {searchResults?.results && (
              <div className="shrink-0">
                <div className="h-px w-full bg-zinc-200" />
                <p className="p-2 text-xs text-zinc-500">
                  Found {searchResults.results.length} results in{" "}
                  {searchResults.duration.toFixed(0)}ms
                </p>
              </div>
            )}
          </Command>
        </div>

        <ToggleGroup
          variant="outline"
          value={[db]}
          onValueChange={(values) => {
            const value = values[0];
            if (value === "redis" || value === "postgres") {
              setDb(value);
            }
          }}
          className="gap-3"
        >
          <ToggleGroupItem
            value="redis"
            aria-label="Select Redis"
            className="flex h-24 w-28 flex-col items-center justify-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 text-muted-foreground transition-all hover:border-red-500/50 hover:bg-red-500/10 data-pressed:border-red-500 data-pressed:bg-red-500/15 data-pressed:text-red-500"
          >
            <Image src="/redis-logo.svg" alt="Redis" width={30} height={30} />
            <span className="text-sm font-semibold">Redis</span>
          </ToggleGroupItem>

          <ToggleGroupItem
            value="postgres"
            aria-label="Select Postgres"
            className="flex h-24 w-28 flex-col items-center justify-center gap-3 rounded-xl border border-sky-500/20 bg-sky-500/5 text-muted-foreground transition-all hover:border-sky-500/50 hover:bg-sky-500/10 data-pressed:border-sky-500 data-pressed:bg-sky-500/15 data-pressed:text-sky-500"
          >
            <Image
              src="/postgres-logo.svg"
              alt="Postgres"
              width={30}
              height={30}
            />
            <span className="text-sm font-semibold">Postgres</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </main>
  );
}
