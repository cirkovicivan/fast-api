import { Badge } from "@/components/shadcn/badge";

export function HeaderSection() {
  return (
    <header className="w-full flex flex-col gap-3 text-left">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Apex
        </h1>

        {/* Badges Container - items-center ensures exact vertical centering */}
        <div className="flex items-center gap-2.5">
          {/* GitHub Star Badge */}
          <a
            href="https://github.com/cirkovicivan/fast-api"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center"
          >
            <Badge
              variant="outline"
              className="px-3.5 py-1 bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white gap-2 rounded-full font-mono text-xs transition-all duration-150 cursor-pointer shadow-sm inline-flex items-center"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 496 512"
                height="13px"
                width="13px"
                xmlns="http://www.w3.org/2000/svg"
                className="text-zinc-400 group-hover:text-white transition-colors"
              >
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path>
              </svg>
              <span>Star on GitHub</span>
            </Badge>
          </a>

          {/* Live Benchmark Badge */}
          <Badge
            variant="outline"
            className="px-3 py-1 bg-emerald-950/40 border-emerald-500/30 text-emerald-400 gap-2 rounded-full font-mono text-xs shadow-sm shadow-emerald-950/50 inline-flex items-center"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            live benchmark
          </Badge>
        </div>
      </div>

      <p className="text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
        Welcome to Apex. Select your target database, enter a search term below,
        and analyze real-time execution metrics in milliseconds.
      </p>
    </header>
  );
}
