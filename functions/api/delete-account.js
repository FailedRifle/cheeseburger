// functions/api/delete-account.js
// Live at: yoursite.com/api/delete-account
// Deletes a user's account after re-verifying their password. Also cleans
// up their playtime rows so nothing orphaned is left behind.

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
    return json({ error: "Enter your password to confirm." }, 400);
  }

  try {
    const user = await env.database.prepare(
      "SELECT id, password_hash FROM users WHERE username = ?"
    ).bind(username).first();

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return json({ error: "Incorrect password." }, 401);
    }

    await env.database.prepare("DELETE FROM playtime WHERE user_id = ?").bind(user.id).run();
    await env.database.prepare("DELETE FROM users WHERE id = ?").bind(user.id).run();

    return json({ success: true });
  } catch (err) {
    return json({ error: "Something went wrong.", debug: err.message }, 500);
  }
}

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
