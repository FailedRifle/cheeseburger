export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 4, 4);

  try {
    const { results } = await env.database.prepare(
      `SELECT game_key,
              COUNT(DISTINCT user_id) AS players,
              SUM(minutes) AS total_minutes
       FROM playtime
       GROUP BY game_key
       ORDER BY players DESC, total_minutes DESC
       LIMIT ?`
    ).bind(limit).all();

    return json({ games: results });
  } catch (err) {
    return json({ error: "Something went wrong.", debug: err.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
