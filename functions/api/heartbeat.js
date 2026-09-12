export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }
  const userId = Number(body.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return json({ error: "Invalid userId." }, 400);
  }
  // game is optional -- null/undefined/"" all mean "not currently in a game"
  const game = typeof body.game === "string" && body.game.trim() ? body.game.trim() : null;
  try {
    await env.database.prepare(
      "UPDATE users SET last_seen = ?, current_game = ? WHERE id = ?"
    ).bind(Date.now(), game, userId).run();

    // Pick up any admin action queued from the dev console (force-close a
    // game/tab, or a username reset notice) and clear it so it fires once.
    const row = await env.database.prepare(
      "SELECT username, force_action, name_reset_notice FROM users WHERE id = ?"
    ).bind(userId).first();

    if (row && (row.force_action || row.name_reset_notice)) {
      await env.database.prepare(
        "UPDATE users SET force_action = NULL, name_reset_notice = 0 WHERE id = ?"
      ).bind(userId).run();
    }

    return json({
      success: true,
      username: row?.username ?? null,
      forceAction: row?.force_action || null,
      nameWasReset: !!row?.name_reset_notice,
    });
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
