const statusColor = {
  "Planning": "bg-slate-700 text-slate-200",
  "In Progress": "bg-blue-600/30 text-blue-300",
  "On Hold": "bg-amber-600/30 text-amber-300",
  "Completed": "bg-emerald-600/30 text-emerald-300",
};

const priorityColor = {
  Low: "text-slate-400",
  Medium: "text-amber-400",
  High: "text-red-400",
};

export default function ProjectList({ projects, onEdit, onDelete }) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-xl">
        No projects yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 text-slate-400 text-left">
          <tr>
            <th className="px-4 py-3 font-medium">Client</th>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Start</th>
            <th className="px-4 py-3 font-medium">Due</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {projects.map((p) => (
            <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
              <td className="px-4 py-3 text-left">{p.client_name}</td>
              <td className="px-4 py-3 text-left">{p.project_name}</td>
              <td className="px-4 py-3 text-left">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor[p.status] || "bg-slate-700"}`}>
                  {p.status}
                </span>
              </td>
              <td className={`px-4 py-3 font-medium ${priorityColor[p.priority] || ""}`}>{p.priority}</td>
              <td className="px-4 py-3 text-slate-400">{p.start_date}</td>
              <td className="px-4 py-3 text-slate-400">{p.due_date}</td>
              <td className="px-4 py-3 text-right space-x-2">
                <button onClick={() => onEdit(p)} className="text-indigo-400 hover:text-indigo-300 text-xs font-medium">
                  Edit
                </button>
                <button onClick={() => onDelete(p.id)} className="text-red-400 hover:text-red-300 text-xs font-medium">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}