// functions/api/users.js
export async function onRequestGet(context) {
  const { env } = context;

  try {
const { results } = await env.database.prepare(
  "SELECT id, username, is_developer, is_early_access FROM users ORDER BY username ASC"
).all();
    
const users = results.map(u => ({
  userId: u.id,
  username: u.username,
  isDeveloper: !!u.is_developer,
  isEarlyAccess: !!u.is_early_access,
}));

    return json(users);
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
