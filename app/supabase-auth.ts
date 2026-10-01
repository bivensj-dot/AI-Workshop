// Talks to Supabase's sign-in service directly with fetch, so no new package is needed.
const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const STORAGE_KEY = "study-tasks-session";

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // seconds since 1970
  email: string;
};

export const isConfigured = Boolean(URL_BASE && KEY);

async function call(path: string, body: object, accessToken?: string) {
  const res = await fetch(`${URL_BASE}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: KEY as string,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      data.msg || data.error_description || data.message || "Something went wrong. Please try again."
    );
  }
  return data;
}

function toSession(data: {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: { email?: string };
}): Session {
  if (!data.access_token || !data.refresh_token || !data.user?.email) {
    throw new Error("Account created, but you could not be signed in. Try logging in.");
  }
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600),
    email: data.user.email,
  };
}

function save(session: Session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable; nothing to clear
  }
}

export async function signUp(email: string, password: string) {
  return save(toSession(await call("signup", { email, password })));
}

export async function logIn(email: string, password: string) {
  return save(toSession(await call("token?grant_type=password", { email, password })));
}

export async function logOut(session: Session) {
  try {
    await call("logout", {}, session.accessToken);
  } catch {
    // even if the server call fails, we still forget the session on this device
  }
  clearSession();
}

// Returns the saved session (renewing it if it is about to expire), or null if signed out.
export async function restoreSession(): Promise<Session | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as Session;
    if (saved.expiresAt - 60 > Date.now() / 1000) return saved;
    const data = await call("token?grant_type=refresh_token", { refresh_token: saved.refreshToken });
    return save(toSession(data));
  } catch {
    clearSession();
    return null;
  }
}
