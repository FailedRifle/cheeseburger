// functions/api/query.js
// Live at: yoursite.com/api/query
//
// Runs a single raw SQL statement against D1 and returns the rows/meta.
// No auth check here on purpose -- access to this endpoint is assumed to
// be gated some other way (e.g. the page that calls it isn't reachable by
// non-developers). Anyone who *can* reach this URL can run arbitrary SQL,
// including DROP/DELETE with no confirmation -- make sure that's covered
// upstream before this goes live.

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const sql = typeof body.sql === "string" ? body.sql.trim() : "";
  if (!sql) {
    return json({ error: "Missing SQL statement." }, 400);
  }

  // D1 only allows one statement per prepare() call -- reject batches
  // separated by semicolons (aside from one optional trailing semicolon)
  // so a mistake doesn't silently run something unintended.
  const trimmed = sql.replace(/;\s*$/, "");
  if (trimmed.includes(";")) {
    return json({ error: "Only one statement at a time is supported. Remove extra semicolons." }, 400);
  }

  try {
    const startedAt = Date.now();
    const result = await env.database.prepare(trimmed).run();
    const durationMs = Date.now() - startedAt;

    return json({
      success: true,
      rows: result.results || [],
      rowCount: Array.isArray(result.results) ? result.results.length : 0,
      meta: {
        changes: result.meta?.changes ?? 0,
        lastRowId: result.meta?.last_row_id ?? null,
        durationMs,
      },
    });
  } catch (err) {
    return json({ error: err.message || "Query failed." }, 400);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
