// functions/api/playtime.js
// Live at: yoursite.com/api/playtime
// Accumulates playtime minutes for a user + game. Called after a game
// session ends, in addition to the existing local addPlaytime() call.

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const userId = Number(body.userId);
  const gameKey = typeof body.game === "string" ? body.game.trim() : "";
  const minutes = Number(body.minutes);

  if (!Number.isInteger(userId) || userId <= 0) {
    return json({ error: "Invalid userId." }, 400);
  }
  if (!gameKey) {
    return json({ error: "Missing game key." }, 400);
  }
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return json({ error: "Invalid minutes." }, 400);
  }

  try {
    await env.database.prepare(
      `INSERT INTO playtime (user_id, game_key, minutes) VALUES (?, ?, ?)
       ON CONFLICT(user_id, game_key) DO UPDATE SET minutes = minutes + excluded.minutes`
    ).bind(userId, gameKey, minutes).run();

    return json({ success: true });
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
