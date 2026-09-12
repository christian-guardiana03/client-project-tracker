import { useState, useEffect } from "react";
import ProjectList from "./components/ProjectList";
import ProjectForm from "./components/ProjectForm";
import { getProjects, createProject, updateProject, deleteProject } from "./api/projects";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ search: "", status: "", priority: "" });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data } = await getProjects(filters);
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleCreate = async (formData) => {
    await createProject(formData);
    setShowForm(false);
    loadProjects();
  };

  const handleUpdate = async (formData) => {
    await updateProject(editingProject.id, formData);
    setEditingProject(null);
    setShowForm(false);
    loadProjects();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    await deleteProject(id);
    loadProjects();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Client Project Tracker</h1>
          <button
            onClick={() => { setEditingProject(null); setShowForm(true); }}
            className="bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2 rounded-lg font-medium text-sm"
          >
            + New Project
          </button>
        </header>

        {showForm && (
          <div className="mb-8">
            <ProjectForm
              initialData={editingProject}
              onSubmit={editingProject ? handleUpdate : handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-4">
          <input
            name="search"
            placeholder="Search client or project..."
            value={filters.search}
            onChange={handleFilterChange}
            className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm flex-1 min-w-[200px]"
          />
          <select name="status" value={filters.status} onChange={handleFilterChange} className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm">
            <option value="">All Statuses</option>
            <option>Planning</option>
            <option>In Progress</option>
            <option>On Hold</option>
            <option>Completed</option>
          </select>
          <select name="priority" value={filters.priority} onChange={handleFilterChange} className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm">
            <option value="">All Priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <div className="relative min-h-[120px]">
          {loading && (
            <p className="text-slate-400 text-sm mb-3">Loading...</p>
          )}
          <ProjectList
            projects={projects}
            onEdit={(p) => { setEditingProject(p); setShowForm(true); }}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}