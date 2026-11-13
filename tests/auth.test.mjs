import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  "agadez-plcda-super-secret-jwt-key-2026-anti-rumeur-paix-securite"
);

test("Authentication - Password hashing and verification", async () => {
  const plain = "Agadez2026!";
  const hash = await bcrypt.hash(plain, 10);
  assert.equal(typeof hash, "string");
  assert.ok(hash.startsWith("$2a$") || hash.startsWith("$2b$"));

  const isValid = await bcrypt.compare(plain, hash);
  assert.equal(isValid, true);

  const isInvalid = await bcrypt.compare("WrongPassword", hash);
  assert.equal(isInvalid, false);
});

test("Authentication - JWT Session creation and verification", async () => {
  const user = {
    id: "usr_test_123",
    name: "Ibrahim Moussa",
    email: "verificateur.ibrahim@plcda-agadez.ne",
    role: "VERIFIER",
    department: "Antenne Agadez Ville",
  };

  const token = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  assert.equal(typeof token, "string");
  assert.ok(token.split(".").length === 3);

  const { payload } = await jwtVerify(token, JWT_SECRET);
  assert.equal(payload.id, user.id);
  assert.equal(payload.name, user.name);
  assert.equal(payload.role, user.role);
});

test("Authentication - RBAC Role Privilege Checking", () => {
  const hasRole = (userRole, allowedRoles) => {
    if (userRole === "SUPER_ADMIN") return true;
    return allowedRoles.includes(userRole);
  };

  assert.equal(hasRole("SUPER_ADMIN", ["ADMIN"]), true);
  assert.equal(hasRole("ADMIN", ["ADMIN", "COMMUNICATION"]), true);
  assert.equal(hasRole("VERIFIER", ["ADMIN"]), false);
  assert.equal(hasRole("OBSERVER", ["ADMIN", "VERIFIER"]), false);
});
