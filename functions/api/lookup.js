// functions/api/lookup.js
const ONLINE_THRESHOLD_MS = 90 * 1000;

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const rawUsername = url.searchParams.get("username") || "";
  const username = rawUsername.trim().toLowerCase();
  if (!username) {
    return json({ error: "Missing username." }, 400);
  }
  try {
const user = await env.database.prepare(
  "SELECT id, username, created_at, is_developer, is_early_access, is_banned, ban_reason, ban_public, last_seen, current_game FROM users WHERE username = ?"
).bind(username).first();
    if (!user) {
      return json({ error: "No account found with that username." }, 404);
    }
    const { results } = await env.database.prepare(
      "SELECT game_key, minutes FROM playtime WHERE user_id = ? ORDER BY minutes DESC LIMIT 3"
    ).bind(user.id).all();

    const lastSeen = user.last_seen || null;
    const isOnline = !!lastSeen && (Date.now() - lastSeen) < ONLINE_THRESHOLD_MS;
    // Only surface current_game while they're actually online -- otherwise
    // it'd show a stale "Playing X" from their last session before they closed the tab.
    const inGame = isOnline ? (user.current_game || null) : null;

    return json({
      username: user.username,
      userId: user.id,
      createdAt: user.created_at,
      isDeveloper: !!user.is_developer,
      isEarlyAccess: !!user.is_early_access,
      isBanned: !!user.is_banned,
      banReason: user.ban_reason || null,
      isBanPublic: user.ban_public === null || user.ban_public === undefined ? true : !!user.ban_public,
      isOnline,
      lastSeen,
      inGame,
      topGames: results,
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
