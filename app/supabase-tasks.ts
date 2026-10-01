// Reads and writes the "tasks" table through Supabase's REST service with fetch, so no new package is needed.
// The signed-in user's token is sent with every request; row level security limits results to their own rows.
import type { Session } from "./supabase-auth";

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const SKILLS = ["Speaking", "Listening", "Reading", "Writing", "Vocabulary", "Grammar"] as const;
export type Skill = (typeof SKILLS)[number];

export type Task = {
  id: string;
  title: string;
  skill: Skill;
  done: boolean;
};

async function request(path: string, session: Session, init: RequestInit = {}) {
  const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      apikey: KEY as string,
      Authorization: `Bearer ${session.accessToken}`,
      Prefer: "return=representation",
      ...init.headers,
    },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((data && (data.message || data.hint)) || "Could not reach your task list. Please try again.");
  }
  return data;
}

export async function listTasks(session: Session): Promise<Task[]> {
  return request("tasks?select=id,title,skill,done&order=created_at.asc", session);
}

export async function addTask(session: Session, title: string, skill: Skill): Promise<Task> {
  const rows = await request("tasks?select=id,title,skill,done", session, {
    method: "POST",
    body: JSON.stringify({ title, skill }),
  });
  return rows[0];
}

export async function setDone(session: Session, id: string, done: boolean): Promise<Task> {
  const rows = await request(`tasks?id=eq.${encodeURIComponent(id)}&select=id,title,skill,done`, session, {
    method: "PATCH",
    body: JSON.stringify({ done }),
  });
  if (!rows[0]) throw new Error("Could not update that task.");
  return rows[0];
}
