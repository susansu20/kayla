import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Lazy Neon client. We avoid constructing the client at module load because
 * Next.js evaluates route modules during `next build` (no env vars present),
 * which would crash the build. Instead we instantiate on the first request,
 * which always runs with the Vercel-injected DATABASE_URL.
 */
let _sql: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Connect a Neon database in your Vercel project's Storage tab."
    );
  }
  _sql = neon(url);
  return _sql;
}

export type WishRow = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};
