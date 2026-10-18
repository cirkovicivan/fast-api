
import postgres from "postgres";
import { countryList } from "./countries";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable");
}

const sql = postgres(databaseUrl, {
  max: 1,
  ssl: "require",
});

async function main(): Promise<void> {
  try {
    await sql.begin(async (tx) => {
      const countries = countryList.map((name) => ({ name }));

      await tx`
        INSERT INTO public.countries ${tx(countries, "name")}
        ON CONFLICT (name) DO NOTHING
      `;
    });

    const [{ count }] = await sql`
      SELECT COUNT(*)::int AS count
      FROM public.countries
    `;

    console.log(`Seed completed. Countries in database: ${count}`);
  } catch (error: unknown) {
    console.error("Country seed failed:", error);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

main();
