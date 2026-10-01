"use client";

import { useEffect, useState } from "react";
import type { Session } from "./supabase-auth";
import { SKILLS, addTask, listTasks, setDone, type Skill, type Task } from "./supabase-tasks";

export default function TasksPanel({ session }: { session: Session }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [skill, setSkill] = useState<Skill>("Speaking");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    listTasks(session)
      .then(setTasks)
      .catch((e) => setError(e instanceof Error ? e.message : "Something went wrong."))
      .finally(() => setLoading(false));
  }, [session]);

  async function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed) return;
    setError("");
    setBusy(true);
    try {
      const task = await addTask(session, trimmed, skill);
      setTasks((current) => [...current, task]);
      setTitle("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
    setBusy(false);
  }

  async function handleToggle(task: Task) {
    setError("");
    try {
      const updated = await setDone(session, task.id, !task.done);
      setTasks((current) => current.map((t) => (t.id === updated.id ? updated : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  return (
    <div>
      <form
        className="task-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAdd();
        }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Study task"
          aria-label="Study task"
          required
        />
        <select value={skill} onChange={(e) => setSkill(e.target.value as Skill)} aria-label="Skill">
          {SKILLS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit" disabled={busy}>
          Add
        </button>
      </form>
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p>Loading tasks…</p>
      ) : tasks.length === 0 ? (
        <p className="placeholder-note">No tasks yet.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={task.done ? "task done" : "task"}>
              <label>
                <input type="checkbox" checked={task.done} onChange={() => handleToggle(task)} />
                <span className="task-title">{task.title}</span>
              </label>
              <span className="skill-label">{task.skill}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
