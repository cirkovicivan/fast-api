import { Redis } from "@upstash/redis/cloudflare";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const app = new Hono().basePath("/api");

type EnvConfig = {
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
  SUPABASE_URL: string;
  SUPABASE_SECRET_KEY: string;
};

app.use("/*", cors());

app.get("/search", async (c) => {
  try {
    const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
      env<EnvConfig>(c);

    const start = performance.now();
    // -------------------------------------------------

    const redis = new Redis({
      token: UPSTASH_REDIS_REST_TOKEN,
      url: UPSTASH_REDIS_REST_URL,
    });

    const query = c.req.query("q")?.toUpperCase();

    if (!query) {
      return c.json(
        {
          message: "Invalid search query",
        },
        { status: 400 }
      );
    }

    const res = [];

    // Rank of the first member that matches the query
    const rank = await redis.zrank("terms", query);

    if (!rank != null && rank != undefined) {
      const temp = await redis.zrange<string[]>("terms", rank, rank + 100);

      for (const el of temp) {
        if (!el.startsWith(query)) {
          break;
        }

        if (el.endsWith("*")) {
          res.push(el.substring(0, el.length - 1));
        }
      }
    }

    // -------------------------------------------------
    const end = performance.now();

    return c.json({
      results: res,
      duration: end - start,
    });
  } catch (error) {
    console.error(error);

    return c.json(
      {
        results: [],
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
});

app.get("/search-postgres", async (c) => {
  try {
    const { SUPABASE_URL, SUPABASE_SECRET_KEY } = env<EnvConfig>(c);

    const query = c.req.query("q")?.trim();

    if (!query) {
      return c.json({ message: "Invalid search query" }, 400);
    }

    const start = performance.now();
    console.log(query)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

    const { data, error } = await supabase
      .from("countries")
      .select("name")
      .ilike("name", `${query}%`)
      .order("name")
      .limit(101);

    if (error) {
      console.error(error);
      return c.json(
        { results: [], message: "Something went wrong" },
        500
      );
    }

    const duration = performance.now() - start;

    return c.json({
      results: data.map((country: { name: string }) => country.name),
      duration,
    });
  } catch (error) {
    console.error(error);

    return c.json(
      { results: [], message: "Something went wrong" },
      500
    );
  }
});

// For vercel integration
export const GET = handle(app);

// For cloudflare workers
export default app as never;
