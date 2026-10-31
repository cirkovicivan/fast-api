"use client";

import { useEffect, useRef, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/shadcn/command";
import { DatabaseSelector } from "@/components/custom/database-selector";
import { MetricsGrid } from "@/components/custom/metrics-grid";
import { HeaderSection } from "@/components/custom/header-section";

type Database = "redis" | "postgres";

const DATABASE_ENDPOINTS: Record<Database, string> = {
  redis: "search",
  postgres: "search-postgres",
};

export interface LatencyDataPoint {
  timestamp: number | string;
  latency: number;
}

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState<string>("");
  const [db, setDb] = useState<Database>("redis");
  const [chartData, setChartData] = useState<LatencyDataPoint[]>([]);
  const [dbExecutionTime, setDbExecutionTime] = useState<number>();
  const [searchResults, setSearchResults] = useState<{
    results: string[];
    duration: number;
  }>();

  const latestRequest = useRef(0);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key == "Enter") {
        event.preventDefault();

        inputRef.current?.focus();
        setIsOpen(true);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Fetch search results
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
          `http://localhost:3000/api/${endpoint}`,
          // `https://fastapi.cirko007ivan.workers.dev/api/${endpoint}`,
        );

        url.searchParams.set("q", query);

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Search failed: ${res.status}`);
        }

        const data = (await res.json()) as {
          results: string[];
          duration: number;
          dbExecutionTime: number;
        };

        if (latestRequest.current === requestId) {
          setChartData((prev) => [
            ...prev,
            { timestamp: Date.now(), latency: data.duration },
          ]);
          setSearchResults({ results: data.results, duration: data.duration });
          setDbExecutionTime(data.dbExecutionTime);
          setIsOpen(true); // Open dropdown when data arrives
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
    <main className="min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-between py-12 px-4 sm:px-6">
      <div className="w-full max-w-4xl flex flex-col gap-8 duration-500 animate-in fade-in-5 slide-in-from-bottom-2.5">
        <HeaderSection />

        <section className="w-full flex flex-col gap-4">
          <div className="w-full mb-4">
            <DatabaseSelector
              selectedDb={db}
              onSelectDb={setDb}
              onChartData={setChartData}
            />
          </div>

          <div ref={searchRef} className="relative w-full">
            <Command className="overflow-visible bg-card rounded-xl shadow-inner">
              <CommandInput
                ref={inputRef}
                value={input}
                onValueChange={(val) => {
                  setInput(val);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={`Search countries using ${db.toUpperCase()}...`}
                className="text-sm placeholder:text-zinc-500 text-zinc-200"
              />

              {isOpen && searchResults?.results && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl border border-card bg-card p-1 shadow-2xl backdrop-blur-md overflow-hidden">
                  <CommandList className="max-h-60 overflow-y-auto">
                    {searchResults.results.length === 0 ? (
                      <CommandEmpty className="p-4 text-center text-xs text-zinc-500">
                        No matching results found.
                      </CommandEmpty>
                    ) : (
                      <CommandGroup heading="Results">
                        {searchResults.results.map((result) => (
                          <CommandItem
                            key={result}
                            value={result}
                            onSelect={(val) => {
                              setInput(val);
                              setIsOpen(false);
                            }}
                            className="cursor-pointer px-3 py-2 text-sm text-zinc-300 aria-selected:bg-emerald-950/40 aria-selected:text-emerald-400 rounded-md transition-colors"
                          >
                            {result}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>

                  <div className="shrink-0 border-t border-zinc-800/80 bg-zinc-900/40 px-3 py-2 flex items-center justify-between text-xs text-zinc-400 font-mono">
                    <span>
                      Returned{" "}
                      <strong className="text-zinc-200">
                        {searchResults.results.length}
                      </strong>{" "}
                      items
                    </span>
                    <span className="text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                      {searchResults.duration.toFixed(0)} ms
                    </span>
                  </div>
                </div>
              )}
            </Command>
          </div>
        </section>

        <section className="w-full pt-2">
          <MetricsGrid
            chartData={chartData}
            dbExecutionTime={dbExecutionTime}
          />
        </section>
      </div>

      <footer className="text-zinc-500 text-xs font-mono pt-8 pb-0 duration-500 animate-in fade-in-5 slide-in-from-bottom-2.5">
        Built with Hono &bull; Next.js &bull; Cloudflare Workers
      </footer>
    </main>
  );
}
