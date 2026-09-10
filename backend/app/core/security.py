"""Password hashing and token handling.

DELIBERATELY EMPTY. Authentication is Sakshi's to design — this module exists
so there is one obvious place for it, and so nothing else in the scaffold
invents a scheme that later has to be undone.

Two constraints the frontend already assumes, worth keeping:

1. **Argon2id for password hashing.** Add `argon2-cffi` to `pyproject.toml`
   when implementing; it is not a dependency yet because nothing uses it. The
   defaults from `argon2.PasswordHasher()` are current and appropriate — do
   not hand-tune the cost parameters without a benchmark. Never store, log or
   return a plaintext password.

2. **The session credential should be an HttpOnly cookie.** The frontend's
   API client sends `credentials: "include"` and never reads a token from
   JavaScript, so an XSS payload cannot exfiltrate the session. If a bearer
   token is chosen instead, say so — `frontend/src/lib/api/client.ts` and
   `frontend/src/types/auth.ts` both change, and the frontend must hold the
   token in memory rather than in localStorage.

   Cross-origin cookie note: in development, `localhost:3000` → `localhost:8000`
   is cross-origin but same-site, so `SameSite=Lax` works. In production the
   two must share a site, or the cookie needs `SameSite=None; Secure`.

`SECRET_KEY` in `app.core.config` is the slot for the signing key.
"""
