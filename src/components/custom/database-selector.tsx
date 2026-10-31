"use client";

import { LatencyDataPoint } from "@/app/page";
import { ToggleGroup, ToggleGroupItem } from "@/components/shadcn/toggle-group";
import Image from "next/image";

type Database = "redis" | "postgres";

interface DatabaseSelectorProps {
  selectedDb: Database;
  onSelectDb: (db: Database) => void;
  onChartData: (data: LatencyDataPoint[]) => void;
}

export function DatabaseSelector({
  selectedDb,
  onSelectDb,
  onChartData,
}: DatabaseSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <span className="text-xs font-medium text-zinc-400 px-1">
        Target Database
      </span>
      <ToggleGroup
        value={[selectedDb]}
        onValueChange={(values) => {
          // Prevent deselecting: if empty, keep current selectedDb
          const value = values.find((v) => v !== selectedDb) || values[0];
          if (value === "redis" || value === "postgres") {
            onSelectDb(value);
            onChartData([]);
          }
        }}
        className="grid grid-cols-2 gap-2 w-full"
      >
        {/* Redis Toggle */}
        <ToggleGroupItem
          value="redis"
          aria-label="Select Redis"
          className={`flex items-center justify-center gap-2 h-10 px-3 rounded-lg border text-xs font-semibold transition-all duration-150 ${
            selectedDb === "redis"
              ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-sm shadow-emerald-950/50"
              : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
          }`}
        >
          <Image
            src="/redis-logo.svg"
            alt="Redis"
            width={16}
            height={16}
            className={selectedDb === "redis" ? "opacity-100" : "opacity-60"}
          />
          <span>Redis</span>
        </ToggleGroupItem>

        {/* Postgres Toggle */}
        <ToggleGroupItem
          value="postgres"
          aria-label="Select Postgres"
          className={`flex items-center justify-center gap-2 h-10 px-3 rounded-lg border text-xs font-semibold transition-all duration-150 ${
            selectedDb === "postgres"
              ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-400 shadow-sm shadow-emerald-950/50"
              : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
          }`}
        >
          <Image
            src="/postgres-logo.svg"
            alt="Postgres"
            width={16}
            height={16}
            className={selectedDb === "postgres" ? "opacity-100" : "opacity-60"}
          />
          <span>Postgres</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
