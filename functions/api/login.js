// functions/api/login.js
// Live at: yoursite.com/api/login
// Verifies a username + password against the stored PBKDF2 hash. Rejects
// the attempt outright if the account is banned, so a banned user can't
// even establish a fresh session -- the site's own ban-check-on-load is a
// second layer of defense for anyone who already had a session before
// being banned.
export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }
  const username = (typeof body.username === "string" ? body.username : "").trim().toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";
  if (!username || !password) {
    return json({ error: "Enter a username and password." }, 400);
  }
  try {
const user = await env.database.prepare(
  "SELECT id, username, password_hash, is_developer, is_early_access, is_banned, ban_reason FROM users WHERE username = ?"
).bind(username).first();
    // Same generic message whether the username doesn't exist or the
    // password is wrong -- avoids leaking which usernames are registered.
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return json({ error: "Incorrect username or password." }, 401);
    }
    if (user.is_banned) {
      const reasonSuffix = user.ban_reason ? ` Reason: ${user.ban_reason}` : "";
      return json({ error: `This account has been permanently banned.${reasonSuffix}` }, 403);
    }
    return json({
      success: true,
      userId: user.id,
      username: user.username,
      isDeveloper: !!user.is_developer,
      isEarlyAccess: !!user.is_early_access,
    });
  } catch (err) {
    return json({ error: "Something went wrong.", debug: err.message }, 500);
  }
}
// Re-derives the hash using the salt stored alongside it, then compares.
async function verifyPassword(password, stored) {
  const [saltHex, hashHex] = String(stored).split(":");
  if (!saltHex || !hashHex) return false;
  const salt = hexToBuf(saltHex);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  return bufToHex(derivedBits) === hashHex;
}
function hexToBuf(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes.buffer;
}
function bufToHex(buf) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
