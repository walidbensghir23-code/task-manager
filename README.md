# ✅ Gestionnaire de Tâches

Application de gestion de tâches développée avec **React** et **localStorage**.

Développée par **Walid Bensghir** — Étudiant en Développement Digital · ISTA NTIC 2 SM, Casablanca

---

## ✨ Fonctionnalités

- ➕ Ajouter des tâches avec titre, priorité et catégorie
- ✏️ Modifier le titre d'une tâche en ligne
- 🗑️ Supprimer des tâches individuellement ou en masse
- ✅ Marquer une tâche comme terminée
- 🔄 Changer le statut : À faire → En cours → Terminé
- 🔍 Recherche en temps réel dans les tâches
- 🎛️ Filtrage par statut (Toutes / À faire / En cours / Terminées)
- 🔢 Tri par date ou par priorité
- 💾 Persistance automatique via **localStorage** (sans backend)
- 📱 Interface 100% responsive

## 🛠️ Technologies utilisées

- **React** (Vite)
- **JavaScript ES6+** (hooks, useMemo, localStorage)
- **CSS** (custom design system, dark mode)
- **Lucide React** (icônes)

## 🚀 Démarrer le projet

```bash
# 1. Cloner le dépôt
git clone https://github.com/ton-username/task-manager.git
cd task-manager

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Aucune configuration supplémentaire nécessaire — le projet fonctionne immédiatement.

## 📁 Structure du projet

```
task-manager/
├── src/
│   ├── App.jsx        ← Composant principal + TaskCard
│   ├── useTasks.js    ← Hook custom (logique + localStorage)
│   ├── main.jsx
│   └── index.css
├── index.html
└── package.json
```

## 🏗️ Architecture

- **`useTasks.js`** — Custom hook qui centralise toute la logique métier (CRUD) et la synchronisation avec localStorage
- **`TaskCard`** — Composant réutilisable pour chaque tâche, avec mode édition inline
- **`App.jsx`** — Orchestration, filtres, recherche et tri via `useMemo`

---

© 2025 Walid Bensghir
