'use client';

import { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Construction, Plus, Edit2, Trash2, X, Save, FileText } from 'lucide-react';

interface ProjectOption {
  id: string;
  name: string;
}

interface DrawingRecord {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  category: string;
  revision: string;
  fileName: string;
  fileType: string;
  fileData: string;
}

const DRAWINGS_STORAGE_KEY = '4square-drawings';
const PROJECTS_STORAGE_KEY = '4square-projects';

const emptyForm = {
  projectId: '',
  title: '',
  category: 'Structural',
  revision: 'A',
  fileName: '',
  fileData: '',
  fileType: '',
};

export default function Page() {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [drawings, setDrawings] = useState<DrawingRecord[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (storedProjects) {
        const parsedProjects = JSON.parse(storedProjects) as Array<{ id?: string; name?: string }>;
        setProjects(parsedProjects.filter((item) => item.id && item.name).map((item) => ({ id: item.id!, name: item.name! })));
      }
    } catch {
      setProjects([]);
    }

    try {
      const storedDrawings = window.localStorage.getItem(DRAWINGS_STORAGE_KEY);
      if (storedDrawings) {
        setDrawings(JSON.parse(storedDrawings) as DrawingRecord[]);
      }
    } catch {
      setDrawings([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(DRAWINGS_STORAGE_KEY, JSON.stringify(drawings));
  }, [drawings]);

  const filteredDrawings = drawings.filter((drawing) => {
    const query = search.toLowerCase();
    return !query || drawing.title.toLowerCase().includes(query) || drawing.projectName.toLowerCase().includes(query) || drawing.category.toLowerCase().includes(query);
  });

  const openNewForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setIsFormOpen(true);
  };

  const openEditForm = (drawing: DrawingRecord) => {
    setEditingId(drawing.id);
    setFormData({
      projectId: drawing.projectId,
      title: drawing.title,
      category: drawing.category,
      revision: drawing.revision,
      fileName: drawing.fileName,
      fileData: drawing.fileData,
      fileType: drawing.fileType,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this drawing record?')) {
      setDrawings((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleFile = async (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, fileName: '', fileData: '', fileType: '' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setFormData((prev) => ({
        ...prev,
        fileName: file.name,
        fileData: result,
        fileType: file.type,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const selectedProject = projects.find((project) => project.id === formData.projectId);
    if (!selectedProject) {
      window.alert('Please select a project from the dropdown.');
      return;
    }

    const payload: DrawingRecord = {
      id: editingId || `DRAW-${Date.now()}`,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      title: formData.title.trim(),
      category: formData.category,
      revision: formData.revision.trim() || 'A',
      fileName: formData.fileName,
      fileData: formData.fileData,
      fileType: formData.fileType,
    };

    if (!payload.title) {
      window.alert('Please enter a drawing title.');
      return;
    }

    if (editingId) {
      setDrawings((prev) => prev.map((item) => (item.id === editingId ? payload : item)));
    } else {
      setDrawings((prev) => [payload, ...prev]);
    }

    setIsFormOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Drawings" subtitle="Manage drawing records with CRUD and file uploads" icon={<Construction size={18} />} action={
        <button onClick={openNewForm} className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-md shadow-orange-500/30">
          <Plus size={16} /> New Drawing
        </button>
      } />

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search drawings..."
          className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
        />
      </div>

      {isFormOpen && (
        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{editingId ? 'Edit Drawing' : 'Add Drawing'}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Store drawing details and upload a PDF or image.</p>
            </div>
            <button onClick={() => setIsFormOpen(false)} className="p-2 rounded-lg hover:bg-[var(--muted)]">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Project name</label>
              <select value={formData.projectId} onChange={(event) => setFormData((prev) => ({ ...prev, projectId: event.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" required>
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Drawing title</label>
              <input value={formData.title} onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" placeholder="e.g. Foundation Layout" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Category</label>
              <select value={formData.category} onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm">
                <option value="Structural">Structural</option>
                <option value="As-Built">As-Built</option>
                <option value="Extra">Extra</option>
                <option value="Next Revision">Next Revision</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Revision</label>
              <input value={formData.revision} onChange={(event) => setFormData((prev) => ({ ...prev, revision: event.target.value }))} className="w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" placeholder="A" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-sm font-medium">Drawing file (PDF or image)</label>
              <input type="file" accept="application/pdf,image/*" onChange={(event) => handleFile(event.target.files?.[0] || null)} className="w-full rounded-lg border border-dashed border-[var(--border)] bg-transparent px-3 py-2 text-sm" />
              {formData.fileName ? <p className="text-xs text-[var(--muted-foreground)]">Selected file: {formData.fileName}</p> : null}
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium">Cancel</button>
              <button type="submit" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold">
                <Save size={16} /> {editingId ? 'Update Drawing' : 'Save Drawing'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
              <tr>
                {['Project', 'Title', 'Category', 'Revision', 'File', 'Actions'].map((header) => (
                  <th key={header} className="text-left text-xs font-semibold text-[var(--muted-foreground)] px-4 py-3 whitespace-nowrap">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDrawings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-[var(--muted-foreground)]">No drawings found. Add one to start tracking revisions.</td>
                </tr>
              ) : (
                filteredDrawings.map((drawing) => (
                  <tr key={drawing.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--accent)] transition-colors">
                    <td className="px-4 py-3 text-xs text-[var(--muted-foreground)] whitespace-nowrap">{drawing.projectName}</td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <div className="font-medium text-[var(--foreground)] text-xs">{drawing.title}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted-foreground)] whitespace-nowrap">{drawing.category}</td>
                    <td className="px-4 py-3 text-xs text-[var(--muted-foreground)] whitespace-nowrap">{drawing.revision}</td>
                    <td className="px-4 py-3">
                      {drawing.fileData ? (
                        <a href={drawing.fileData} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-orange-600 font-medium text-xs">
                          <FileText size={14} /> {drawing.fileName || 'View file'}
                        </a>
                      ) : (
                        <span className="text-xs text-[var(--muted-foreground)]">No file</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEditForm(drawing)} className="p-1.5 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-600 transition-colors"><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(drawing.id)} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
