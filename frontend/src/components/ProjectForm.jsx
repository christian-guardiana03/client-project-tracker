import { useState, useEffect } from "react";

const STATUS_OPTIONS = ["Planning", "In Progress", "On Hold", "Completed"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High"];

const EMPTY_FORM = {
    client_name: "",
    project_name: "",
    description: "",
    status: "Planning",
    priority: "Medium",
    start_date: "",
    due_date: "",
};

const inputClass = "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "text-sm font-medium text-slate-300 mb-1 block text-left";

export default function ProjectForm({ initialData, onSubmit, onCancel }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) setForm(initialData);
    }, [initialData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await onSubmit(form);
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            }
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
            <div>
                <label className={labelClass}>Client Name</label>
                <input name="client_name" value={form.client_name} onChange={handleChange} className={inputClass} />
                {errors.client_name && <p className="text-red-400 text-xs mt-1 text-left">{errors.client_name[0]}</p>}
            </div>

            <div>
                <label className={labelClass}>Project Name</label>
                <input name="project_name" value={form.project_name} onChange={handleChange} className={inputClass} />
                {errors.project_name && <p className="text-red-400 text-xs mt-1 text-left">{errors.project_name[0]}</p>}
            </div>

            <div className="sm:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} />
            </div>

            <div>
                <label className={labelClass}>Status </label>
                <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            <div>
                <label className={labelClass}>Priority </label>
                <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
                    {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>

            <div>
                <label className={labelClass}>Start Date </label>
                <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className={inputClass} />
                {errors.start_date && <p className="text-red-400 text-xs mt-1 text-left">{errors.start_date[0]}</p>}
            </div>

            <div>
                <label className={labelClass}>Due Date </label>
                <input type="date" name="due_date" value={form.due_date} onChange={handleChange} className={inputClass} />
                {errors.due_date && <p className="text-red-400 text-xs mt-1 text-left">{errors.due_date[0]}</p>}
            </div>

            <div className="sm:col-span-2 flex gap-3 mt-2">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
                    Save
                </button>
                <button type="button" onClick={onCancel} className="bg-slate-800 hover:bg-slate-700 transition-colors px-4 py-2 rounded-lg text-sm font-medium">
                    Cancel
                </button>
            </div>

        </form>
    );
}