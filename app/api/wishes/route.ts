import { NextResponse } from "next/server";
import { getSql, type WishRow } from "@/lib/db";

// Don't cache — the wall should reflect new wishes immediately.
export const dynamic = "force-dynamic";

const NAME_MAX = 80;
const MESSAGE_MAX = 280;

export async function GET() {
  try {
    const sql = getSql();
    const rows = (await sql`
      select id, name, message, created_at
      from wishes
      order by created_at desc
      limit 200
    `) as WishRow[];
    return NextResponse.json({ wishes: rows });
  } catch (err) {
    console.error("[wishes GET]", err);
    return NextResponse.json({ wishes: [], error: "db_error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { name, message } =
    (body as { name?: unknown; message?: unknown }) ?? {};

  const cleanName = typeof name === "string" ? name.trim().slice(0, NAME_MAX) : "";
  const cleanMessage =
    typeof message === "string" ? message.trim().slice(0, MESSAGE_MAX) : "";

  if (!cleanName || !cleanMessage) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  try {
    const sql = getSql();
    const rows = (await sql`
      insert into wishes (name, message)
      values (${cleanName}, ${cleanMessage})
      returning id, name, message, created_at
    `) as WishRow[];
    return NextResponse.json({ wish: rows[0] }, { status: 201 });
  } catch (err) {
    console.error("[wishes POST]", err);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
}
