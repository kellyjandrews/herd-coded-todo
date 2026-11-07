"use client";

import { type FormEvent, useState } from "react";

type Task = {
  id: string;
  title: string;
  done: boolean;
};

type Filter = "all" | "active" | "done";

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Done", value: "done" },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const activeCount = tasks.filter((task) => !task.done).length;
  const allDone = tasks.length > 0 && activeCount === 0;
  const visibleTasks = tasks.filter((task) => {
    if (filter === "active") return !task.done;
    if (filter === "done") return task.done;
    return true;
  });

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTask.trim();
    if (!title) return;

    setTasks((currentTasks) => [...currentTasks, { id: crypto.randomUUID(), title, done: false }]);
    setNewTask("");
  }

  function toggleTask(id: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }

  function toggleAll() {
    setTasks((currentTasks) => currentTasks.map((task) => ({ ...task, done: !allDone })));
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">A calmer kind of to-do list</p>
        <h1>Make room for what matters.</h1>
        <p className="intro">Get it out of your head, then take it one step at a time.</p>
      </header>

      <section className="todo-card" aria-label="To-do list">
        <form className="add-task-form" onSubmit={addTask}>
          <label className="visually-hidden" htmlFor="new-task">
            New task
          </label>
          <input
            id="new-task"
            onChange={(event) => setNewTask(event.target.value)}
            placeholder="What needs to get done?"
            value={newTask}
          />
          <button className="add-button" type="submit">
            <span aria-hidden="true">+</span> Add task
          </button>
        </form>

        <div className="list-toolbar">
          <label className="toggle-all">
            <input
              aria-label={allDone ? "Mark all tasks active" : "Complete all tasks"}
              checked={allDone}
              disabled={tasks.length === 0}
              onChange={toggleAll}
              type="checkbox"
            />
            <span>Complete all</span>
          </label>
          <nav aria-label="Filter tasks" className="filters">
            {filters.map(({ label, value }) => (
              <button
                aria-pressed={filter === value}
                className={filter === value ? "filter-button selected" : "filter-button"}
                key={value}
                onClick={() => setFilter(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {visibleTasks.length > 0 ? (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li className={task.done ? "task-item completed" : "task-item"} key={task.id}>
                <input
                  aria-label={`Mark ${task.title} ${task.done ? "active" : "done"}`}
                  checked={task.done}
                  onChange={() => toggleTask(task.id)}
                  type="checkbox"
                />
                <span>{task.title}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state" role="status">
            <span aria-hidden="true" className="empty-icon">
              ✓
            </span>
            <p className="empty-title">
              {tasks.length === 0
                ? "Nothing on your list yet"
                : filter === "active"
                  ? "You’re all caught up"
                  : "No completed tasks"}
            </p>
            <p>
              {tasks.length === 0
                ? "Add a task above and give your mind a little more space."
                : filter === "active"
                  ? "Everything you added is done for now."
                  : "Tasks you finish will find a home here."}
            </p>
          </div>
        )}

        <footer className="list-footer">
          <span>
            {activeCount} {activeCount === 1 ? "task" : "tasks"} left
          </span>
          <span>{tasks.length} total</span>
        </footer>
      </section>

      <p className="page-note">Small steps still move you forward.</p>
    </main>
  );
}
