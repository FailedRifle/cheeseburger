// functions/api/register.js
// Cloudflare Pages Function -> becomes live at: yoursite.com/api/register
// Handles account creation: validates input, hashes the password, and
// inserts into D1. The UNIQUE constraint on username is the real backstop
// against duplicates -- this code just handles it gracefully when it fires.

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const rawUsername = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";
  const username = rawUsername.trim().toLowerCase();

  // Same rules as the client-side form -- enforced again here because the
  // client-side check can always be bypassed (devtools, curl, etc).
  if (username.length < 3 || username.length > 20) {
    return json({ error: "Username must be 3-20 characters." }, 400);
  }
  if (!/^[a-z0-9_]+$/.test(username)) {
    return json({ error: "Username can only contain letters, numbers, and _." }, 400);
  }
  if (password.length < 6) {
    return json({ error: "Password must be at least 6 characters." }, 400);
  }

  const passwordHash = await hashPassword(password);
  const createdAt = Date.now();

  try {
    const result = await env.database.prepare(
      "INSERT INTO users (username, password_hash, created_at) VALUES (?, ?, ?)"
    ).bind(username, passwordHash, createdAt).run();

    const userId = result.meta.last_row_id;
    return json({ success: true, userId, username });
  } catch (err) {
    // D1 throws when the UNIQUE constraint on username is violated.
    if (String(err.message).includes("UNIQUE")) {
      return json({ error: "That username is already taken." }, 409);
    }
    return json({ error: "Something went wrong. Try again.", debug: err.message }, 500);
  }
}

// PBKDF2 with a random per-user salt -- never store a raw or plain-hashed
// password. The salt is stored alongside the hash (salt:hash) so no extra
// database column is needed.
async function hashPassword(password) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));

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

  return `${bufToHex(salt.buffer)}:${bufToHex(derivedBits)}`;
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
