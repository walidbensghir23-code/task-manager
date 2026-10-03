// ─────────────────────────────────────────────
// useTasks.js — Custom hook : gestion des tâches
// Persistance automatique via localStorage
// ─────────────────────────────────────────────
import { useState, useEffect } from "react";

const STORAGE_KEY = "wb-tasks";

const INITIAL_TASKS = [
  {
    id: "1",
    title: "Configurer l'environnement de développement",
    status: "done",
    priority: "haute",
    category: "Dev",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "2",
    title: "Créer les composants React principaux",
    status: "progress",
    priority: "haute",
    category: "Dev",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Rédiger la documentation du projet",
    status: "todo",
    priority: "normale",
    category: "Docs",
    createdAt: new Date().toISOString(),
  },
];

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function useTasks() {
  const [tasks, setTasks] = useState(loadTasks);

  // Auto-save on every change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (title, priority, category) => {
    if (!title.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      status: "todo",
      priority,
      category: category.trim() || "Général",
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "done" ? "todo" : "done" } : t
      )
    );
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((t) => t.status !== "done"));
  };

  return { tasks, addTask, deleteTask, updateTask, toggleDone, clearCompleted };
}
