import { Redis } from "@upstash/redis";
import { countryList } from "./countries";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  throw new Error("Missing Upstash Redis environment variables");
}

const redis = new Redis({ url, token });

async function main() {
  for (const country of countryList) {
    const term = country.toUpperCase();

    for (let i = 1; i <= term.length; i++) {
      await redis.zadd("terms", {
        score: 0,
        member: term.slice(0, i),
      });
    }

    await redis.zadd("terms", {
      score: 0,
      member: `${term}*`,
    });
  }

  console.log(
    `Seed completed. Unique terms in Redis: ${await redis.zcard("terms")}`
  );
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});