import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/shadcn/card";
import { Zap, Clock, HardDrive } from "lucide-react";
import { ChartLineDefault } from "../shadcn/chart-line-default";

export function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full items-stretch">
      {/* Left Column Stack: Metric Cards (Takes up 1 column on large screens) */}
      <div className="flex flex-col gap-4 lg:col-span-1">
        {/* Card 1: P50/P95 Latency */}
        <Card className="bg-zinc-900/50 border-zinc-800/80 hover:border-emerald-500/30 transition-all flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Response Latency
            </CardTitle>
            <Zap className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              3.2 <span className="text-sm font-normal text-zinc-500">ms</span>
            </div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <span>P95: 4.8ms</span>
            </p>
          </CardContent>
        </Card>

        {/* Card 2: DB Execution Time */}
        <Card className="bg-zinc-900/50 border-zinc-800/80 hover:border-emerald-500/30 transition-all flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zinc-400">
              DB Execution Time
            </CardTitle>
            <Clock className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              1.1 <span className="text-sm font-normal text-zinc-500">ms</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1 font-mono">
              Raw query processing speed
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Payload Size */}
        <Card className="bg-zinc-900/50 border-zinc-800/80 hover:border-emerald-500/30 transition-all flex-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Payload Size
            </CardTitle>
            <HardDrive className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              1.4 <span className="text-sm font-normal text-zinc-500">KB</span>
            </div>
            <p className="text-xs text-emerald-400 mt-1 font-mono flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Warm Cache Hit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Chart (Takes up 2 columns on large screens, spanning full height) */}
      <div className="lg:col-span-2 flex">
        <div className="w-full h-full">
          <ChartLineDefault />
        </div>
      </div>
    </div>
  );
}
