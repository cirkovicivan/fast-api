import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const runtime = "edge";

type EnvConfig = {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  SUPABASE_URL: string;
  SUPABASE_SECRET_KEY: string;
};

const app = new Hono().basePath("/api");

app.use("/*", cors());

let cachedRedis: Redis | null = null;
let cachedSupabase: SupabaseClient | null = null;

function getRedisClient(config: EnvConfig): Redis {
  if (!cachedRedis) {
    cachedRedis = new Redis({
      url: config.UPSTASH_REDIS_REST_URL,
      token: config.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return cachedRedis;
}

function getSupabaseClient(config: EnvConfig): SupabaseClient {
  if (!cachedSupabase) {
    cachedSupabase = createClient(
      config.SUPABASE_URL,
      config.SUPABASE_SECRET_KEY,
    );
  }
  return cachedSupabase;
}

app.get("/search", async (c) => {
  try {
    const start = performance.now();
    const config = env<EnvConfig>(c);

    const redis = getRedisClient(config);

    const query = c.req.query("q")?.toUpperCase();
    if (!query) {
      return c.json({ message: "Invalid search query" }, 400);
    }

    const res: string[] = [];
    const dbExecutionStart = performance.now();

    const rank = await redis.zrank("terms", query);

    const dbExecutionEnd = performance.now();

    if (rank != null) {
      const temp = await redis.zrange<string[]>("terms", rank, rank + 100);

      for (const el of temp) {
        if (!el.startsWith(query)) break;
        if (el.endsWith("*")) {
          res.push(el.substring(0, el.length - 1));
        }
      }
    }

    const duration = performance.now() - start;
    const dbExecutionTime = dbExecutionEnd - dbExecutionStart;

    const responseBody = JSON.stringify({
      results: res,
      duration,
      dbExecutionTime,
    });
    const payloadBytes = new TextEncoder().encode(responseBody).length;

    return c.json({
      results: res,
      duration,
      dbExecutionTime,
      payloadBytes,
    });
  } catch (error) {
    console.error(error);
    return c.json({ results: [], message: "Something went wrong" }, 500);
  }
});

app.get("/search-postgres", async (c) => {
  try {
    const start = performance.now();
    const config = env<EnvConfig>(c);
    const supabase = getSupabaseClient(config);

    const query = c.req.query("q")?.trim();
    if (!query) {
      return c.json({ message: "Invalid search query" }, 400);
    }

    const dbExecutionStart = performance.now();

    const { data, error } = await supabase
      .from("countries")
      .select("name")
      .ilike("name", `${query}%`)
      .order("name")
      .limit(101);

    const dbExecutionEnd = performance.now();

    if (error) {
      console.error(error);
      return c.json({ results: [], message: "Something went wrong" }, 500);
    }

    const results = data.map((country: { name: string }) => country.name);
    const duration = performance.now() - start;
    const dbExecutionTime = dbExecutionEnd - dbExecutionStart;

    const responseBody = JSON.stringify({ results, duration, dbExecutionTime });
    const payloadBytes = new TextEncoder().encode(responseBody).length;

    return c.json({
      results,
      duration,
      dbExecutionTime,
      payloadBytes,
    });
  } catch (error) {
    console.error(error);
    return c.json({ results: [], message: "Something went wrong" }, 500);
  }
});

// For vercel integration
export const GET = handle(app);

// For cloudflare workers
export default app as never;
