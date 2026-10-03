import { useState, useMemo } from "react";
import { Plus, Check, Trash2, Pencil, Save, X, ArrowUpDown, Search } from "lucide-react";
import { useTasks } from "./useTasks";

const STATUS_LABELS = { todo: "À faire", progress: "En cours", done: "Terminé" };
const STATUS_BADGE = { todo: "badge-status-todo", progress: "badge-status-progress", done: "badge-status-done" };
const PRIORITY_BADGE = { haute: "badge-priority-haute", normale: "badge-priority-normale", basse: "badge-priority-basse" };
const FILTERS = ["Toutes", "À faire", "En cours", "Terminées"];
const FILTER_MAP = { "Toutes": null, "À faire": "todo", "En cours": "progress", "Terminées": "done" };

function TaskCard({ task, onDelete, onUpdate, onToggle }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const saveEdit = () => {
    if (editTitle.trim()) onUpdate(task.id, { title: editTitle.trim() });
    setEditing(false);
  };
  const cancelEdit = () => { setEditTitle(task.title); setEditing(false); };

  const date = new Date(task.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

  return (
    <article
      className={`task-card priority-${task.priority} ${task.status === "done" ? "done" : ""}`}
      aria-label={`Tâche : ${task.title}`}
    >
      {/* Checkbox */}
      <button
        className={`task-check ${task.status === "done" ? "checked" : ""}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.status === "done" ? "Marquer comme à faire" : "Marquer comme terminé"}
        title={task.status === "done" ? "Marquer comme à faire" : "Marquer comme terminé"}
      >
        {task.status === "done" && <Check size={13} />}
      </button>

      {/* Body */}
      <div className="task-body">
        {editing ? (
          <input
            className="task-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }}
            autoFocus
            aria-label="Modifier le titre de la tâche"
          />
        ) : (
          <p className="task-title">{task.title}</p>
        )}
        <div className="task-meta">
          <span className={`task-badge ${STATUS_BADGE[task.status]}`}>{STATUS_LABELS[task.status]}</span>
          <span className={`task-badge ${PRIORITY_BADGE[task.priority]}`}>{task.priority}</span>
          <span className="task-category">#{task.category}</span>
          {/* Status changer */}
          {task.status !== "done" && (
            <select
              className="status-select"
              value={task.status}
              onChange={(e) => onUpdate(task.id, { status: e.target.value })}
              aria-label="Changer le statut"
            >
              <option value="todo">À faire</option>
              <option value="progress">En cours</option>
              <option value="done">Terminé</option>
            </select>
          )}
          <span className="task-date">{date}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions">
        {editing ? (
          <>
            <button className="action-btn save" onClick={saveEdit} aria-label="Sauvegarder" title="Sauvegarder"><Save size={14} /></button>
            <button className="action-btn" onClick={cancelEdit} aria-label="Annuler" title="Annuler"><X size={14} /></button>
          </>
        ) : (
          <button className="action-btn edit" onClick={() => setEditing(true)} aria-label="Modifier" title="Modifier"><Pencil size={14} /></button>
        )}
        <button className="action-btn delete" onClick={() => onDelete(task.id)} aria-label="Supprimer" title="Supprimer"><Trash2 size={14} /></button>
      </div>
    </article>
  );
}

export default function App() {
  const { tasks, addTask, deleteTask, updateTask, toggleDone, clearCompleted } = useTasks();

  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("normale");
  const [newCategory, setNewCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const handleAdd = (e) => {
    e.preventDefault();
    addTask(newTitle, newPriority, newCategory);
    setNewTitle("");
    setNewCategory("");
  };

  const filtered = useMemo(() => {
    let list = [...tasks];
    const statusFilter = FILTER_MAP[activeFilter];
    if (statusFilter) list = list.filter((t) => t.status === statusFilter);
    if (search.trim()) list = list.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "priority") {
      const order = { haute: 0, normale: 1, basse: 2 };
      list.sort((a, b) => order[a.priority] - order[b.priority]);
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return list;
  }, [tasks, activeFilter, search, sortBy]);

  const counts = useMemo(() => ({
    todo: tasks.filter((t) => t.status === "todo").length,
    progress: tasks.filter((t) => t.status === "progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  }), [tasks]);

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>✅ Gestionnaire de Tâches</h1>
        <p>Organisez vos tâches · Données sauvegardées localement</p>
      </header>

      {/* Stats */}
      <div className="stats-bar" role="status" aria-label="Résumé des tâches">
        <span className="stat-badge"><span className="stat-dot dot-todo" aria-hidden="true" />{counts.todo} à faire</span>
        <span className="stat-badge"><span className="stat-dot dot-progress" aria-hidden="true" />{counts.progress} en cours</span>
        <span className="stat-badge"><span className="stat-dot dot-done" aria-hidden="true" />{counts.done} terminées</span>
        {counts.done > 0 && (
          <button className="clear-btn" onClick={clearCompleted} aria-label="Supprimer les tâches terminées">
            <Trash2 size={13} /> Vider terminées
          </button>
        )}
      </div>

      {/* Add form */}
      <form className="add-form" onSubmit={handleAdd} aria-label="Ajouter une tâche">
        <h2>+ Nouvelle tâche</h2>
        <div className="form-row">
          <input
            id="task-title"
            className="task-input"
            type="text"
            placeholder="Description de la tâche..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            aria-label="Titre de la tâche"
          />
          <select
            id="task-priority"
            className="priority-select"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            aria-label="Priorité"
          >
            <option value="haute">🔴 Haute priorité</option>
            <option value="normale">🟣 Normale</option>
            <option value="basse">🟢 Basse</option>
          </select>
        </div>
        <div className="form-row">
          <input
            id="task-category"
            className="task-input category-input"
            type="text"
            placeholder="Catégorie (ex: Dev, Design, Cours...)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            aria-label="Catégorie"
          />
          <button
            id="add-task-btn"
            className="add-btn"
            type="submit"
            disabled={!newTitle.trim()}
            aria-label="Ajouter la tâche"
          >
            <Plus size={16} /> Ajouter
          </button>
        </div>
      </form>

      {/* Filter bar */}
      <div className="filter-bar" role="toolbar" aria-label="Filtres">
        <span className="filter-label">Filtre :</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-btn ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(f)}
            aria-pressed={activeFilter === f}
          >
            {f}
          </button>
        ))}
        <button
          className="sort-btn"
          onClick={() => setSortBy((s) => s === "date" ? "priority" : "date")}
          aria-label={`Tri : ${sortBy === "date" ? "par date" : "par priorité"}`}
          title="Changer le tri"
        >
          <ArrowUpDown size={13} /> {sortBy === "date" ? "Par date" : "Par priorité"}
        </button>
        <input
          className="filter-search"
          type="search"
          placeholder="🔍 Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Rechercher une tâche"
        />
      </div>

      {/* Task list */}
      <main>
        {filtered.length === 0 ? (
          <div className="task-empty" role="status">
            <div className="emoji">{search ? "🔍" : "🎉"}</div>
            <p>{search ? "Aucune tâche ne correspond à la recherche." : activeFilter === "Terminées" ? "Aucune tâche terminée." : "Aucune tâche pour le moment. Ajoutez-en une !"}</p>
          </div>
        ) : (
          <div className="tasks-list" aria-label={`${filtered.length} tâche(s)`}>
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={deleteTask}
                onUpdate={updateTask}
                onToggle={toggleDone}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        Développé par Walid Bensghir · React + localStorage
      </footer>
    </div>
  );
}
