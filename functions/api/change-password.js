// functions/api/change-password.js
// Live at: yoursite.com/api/change-password
// Re-verifies the user's current password (same PBKDF2 check used in
// login.js / delete-account.js), then hashes and stores the new one with
// a fresh random salt.
export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const username = (typeof body.username === "string" ? body.username : "").trim().toLowerCase();
  const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

  if (!username || !currentPassword || !newPassword) {
    return json({ error: "Fill in all fields." }, 400);
  }
  if (newPassword.length < 6) {
    return json({ error: "New password must be at least 6 characters." }, 400);
  }

  try {
    const user = await env.database.prepare(
      "SELECT id, password_hash FROM users WHERE username = ?"
    ).bind(username).first();

    if (!user || !(await verifyPassword(currentPassword, user.password_hash))) {
      return json({ error: "Current password is incorrect." }, 401);
    }

    const newHash = await hashPassword(newPassword);
    await env.database.prepare(
      "UPDATE users SET password_hash = ? WHERE id = ?"
    ).bind(newHash, user.id).run();

    return json({ success: true });
  } catch (err) {
    return json({ error: "Something went wrong.", debug: err.message }, 500);
  }
}

// Generates a fresh salt and derives a new hash in the same "salt:hash"
// hex format that verifyPassword() (here and in login.js) expects.
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
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
  return `${bufToHex(salt.buffer)}:${bufToHex(derivedBits)}`;
}

// Identical to the verifyPassword() in login.js / delete-account.js.
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
