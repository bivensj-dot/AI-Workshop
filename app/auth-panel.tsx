"use client";

import { useEffect, useState } from "react";
import {
  isConfigured,
  logIn,
  logOut,
  restoreSession,
  signUp,
  type Session,
} from "./supabase-auth";
import TasksPanel from "./tasks-panel";

export default function AuthPanel() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isConfigured) {
      setChecking(false);
      return;
    }
    restoreSession().then((s) => {
      setSession(s);
      setChecking(false);
    });
  }, []);

  async function submit(action: "login" | "signup") {
    setError("");
    setBusy(true);
    try {
      const s = action === "login" ? await logIn(email, password) : await signUp(email, password);
      setSession(s);
      setPassword("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
    setBusy(false);
  }

  async function handleLogOut() {
    if (session) await logOut(session);
    setSession(null);
    setEmail("");
  }

  if (!isConfigured) {
    return <p className="auth-error">Sign-in is not set up on this site yet.</p>;
  }
  if (checking) return <p>Loading…</p>;

  if (session) {
    return (
      <div>
        <p>Signed in as {session.email}</p>
        <button type="button" onClick={handleLogOut}>
          Log out
        </button>
        <h2 className="tasks-heading">Study tasks</h2>
        <TasksPanel session={session} />
      </div>
    );
  }

  return (
    <form
      className="auth-form"
      onSubmit={(e) => {
        e.preventDefault();
        submit("login");
      }}
    >
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          minLength={6}
          required
        />
      </label>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      <div className="auth-buttons">
        <button type="submit" disabled={busy}>
          Log in
        </button>
        <button type="button" disabled={busy || !email || password.length < 6} onClick={() => submit("signup")}>
          Sign up
        </button>
      </div>
    </form>
  );
}
