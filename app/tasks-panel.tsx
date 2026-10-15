"use client";

import { useEffect, useState } from "react";
import type { Session } from "./supabase-auth";
import { SKILLS, addList, addTask, listLists, listTasks, setDone, type Skill, type Task, type TaskList } from "./supabase-tasks";

export default function TasksPanel({ session }: { session: Session }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<TaskList[]>([]);
  const [viewListId, setViewListId] = useState("");
  const [taskListId, setTaskListId] = useState("");
  const [creatingList, setCreatingList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [skill, setSkill] = useState<Skill>("Speaking");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([listLists(session), listTasks(session)])
      .then(([loadedLists, loadedTasks]) => {
        setLists(loadedLists);
        setTasks(loadedTasks);
        if (loadedLists[0]) {
          setViewListId(loadedLists[0].id);
          setTaskListId(loadedLists[0].id);
        }
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Something went wrong."))
      .finally(() => setLoading(false));
  }, [session]);

  function handleViewList(id: string) {
    setViewListId(id);
    setTaskListId(id);
  }

  async function handleAddList() {
    const trimmed = newListName.trim();
    if (!trimmed) return;
    setError("");
    setBusy(true);
    try {
      const list = await addList(session, trimmed);
      setLists((current) => [...current, list]);
      handleViewList(list.id);
      setNewListName("");
      setCreatingList(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
    setBusy(false);
  }

  async function handleAdd() {
    const trimmed = title.trim();
    if (!trimmed || !taskListId) return;
    setError("");
    setBusy(true);
    try {
      const task = await addTask(session, trimmed, skill, taskListId);
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

  const visibleTasks = tasks.filter((t) => t.list_id === viewListId);

  return (
    <div>
      <div className="list-bar">
        <label>
          List
          <select value={viewListId} onChange={(e) => handleViewList(e.target.value)} disabled={lists.length === 0}>
            {lists.length === 0 && <option value="">No lists yet</option>}
            {lists.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        {!creatingList && (
          <button type="button" onClick={() => setCreatingList(true)}>
            New list
          </button>
        )}
      </div>
      {creatingList && (
        <form
          className="task-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddList();
          }}
        >
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="List name"
            aria-label="List name"
            maxLength={100}
            required
          />
          <button type="submit" disabled={busy}>
            Save
          </button>
          <button type="button" onClick={() => setCreatingList(false)}>
            Cancel
          </button>
        </form>
      )}
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
        <select
          value={taskListId}
          onChange={(e) => setTaskListId(e.target.value)}
          aria-label="List for new task"
          disabled={lists.length === 0}
        >
          {lists.length === 0 && <option value="">No lists yet</option>}
          {lists.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={busy || lists.length === 0}>
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
      ) : lists.length === 0 ? (
        <p className="placeholder-note">Click New list to create your first list.</p>
      ) : visibleTasks.length === 0 ? (
        <p className="placeholder-note">No tasks in this list yet.</p>
      ) : (
        <ul className="task-list">
          {visibleTasks.map((task) => (
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
