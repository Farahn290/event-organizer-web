import assert from "node:assert/strict";
import test from "node:test";
import { createAuthToken, verifyAuthToken } from "./auth.js";

const secret = "test-secret-with-at-least-32-characters";
const now = Date.UTC(2026, 0, 1);

test("auth tokens verify and return the user id and role", () => {
    const token = createAuthToken(42, "panitia", secret, now);

    assert.deepEqual(verifyAuthToken(token, secret, now), { userId: 42, role: "panitia" });
});

test("auth tokens reject a modified signature and a different secret", () => {
    const token = createAuthToken(42, "admin", secret, now);
    const [payload, signature] = token.split(".");
    const changedToken = `${payload}.${signature[0] === "a" ? "b" : "a"}${signature.slice(1)}`;

    assert.equal(verifyAuthToken(changedToken, secret, now), null);
    assert.equal(verifyAuthToken(token, `${secret}-different`, now), null);
});

test("auth tokens reject malformed, expired, and invalid-role values", () => {
    const token = createAuthToken(42, "peserta", secret, now);

    assert.equal(verifyAuthToken("not-a-token", secret, now), null);
    assert.equal(verifyAuthToken(token, secret, now + 8 * 60 * 60 * 1000), null);
    assert.throws(() => createAuthToken(42, "unknown", secret, now), TypeError);
});
