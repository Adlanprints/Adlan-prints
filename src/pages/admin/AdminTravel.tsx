import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Search,
  CheckCircle,
  XCircle,
  Loader2,
  X,
  Save,
  MapPin
} from 'lucide-react';
import { TravelPackage } from '../../types';

export const AdminTravel: React.FC = () => {
  const { authFetch } = useAuth();
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<Partial<TravelPackage> | null>(null);
  const [inclusionInput, setInclusionInput] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);

  // In-app delete confirmation (no window.confirm)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/travel-packages');
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (err) {
      console.error('Failed to load travel packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const openNewModal = () => {
    setEditingPkg({
      title: '',
      destination: '',
      coverImageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80',
      description: '',
      duration: '7 Days / 6 Nights',
      inclusions: ['Airport Transfers', '4-Star Hotel Accommodation', 'Match & Excursion Logistics'],
      exclusions: ['International Flights', 'Personal Expenses'],
      price: '',
      currency: 'USD',
      datesOrAvailability: 'Year-Round Availability',
      terms: 'Standard Chamonvin Limited booking terms apply.',
      isPublished: true
    });
    setInclusionInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: TravelPackage) => {
    setEditingPkg({ ...pkg });
    setInclusionInput('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingCover(true);
    try {
      const res = await authFetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setEditingPkg((prev) => (prev ? { ...prev, coverImageUrl: data.url } : null));
        showToast('success', 'Cover image uploaded successfully.');
      } else {
        showToast('error', data.error || 'Upload failed');
      }
    } catch (err) {
      showToast('error', 'Upload error');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleAddInclusion = () => {
    if (!inclusionInput.trim() || !editingPkg) return;
    const current = editingPkg.inclusions || [];
    setEditingPkg({ ...editingPkg, inclusions: [...current, inclusionInput.trim()] });
    setInclusionInput('');
  };

  const handleRemoveInclusion = (idx: number) => {
    if (!editingPkg) return;
    const list = [...(editingPkg.inclusions || [])];
    list.splice(idx, 1);
    setEditingPkg({ ...editingPkg, inclusions: list });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg || !editingPkg.title?.trim()) {
      showToast('error', 'Package title is required.');
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingPkg.id;
      const url = isEdit ? `/api/admin/travel-packages/${editingPkg.id}` : '/api/admin/travel-packages';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPkg)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingPkg(null);
        showToast('success', isEdit ? 'Travel package updated successfully!' : 'Travel package created successfully!');
        fetchPackages();
      } else {
        const data = await res.json();
        showToast('error', data.error || 'Failed to save travel package');
      }
    } catch (err) {
      showToast('error', 'Error saving travel package');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    const targetTitle = deleteTarget.title;
    setDeleting(true);
    try {
      const res = await authFetch(`/api/admin/travel-packages/${targetId}`, { method: 'DELETE' });
      if (res.ok) {
        setPackages((prev) => prev.filter((p) => p.id !== targetId));
        showToast('success', `Travel package "${targetTitle}" deleted.`);
        setDeleteTarget(null);
        fetchPackages();
      } else {
        const data = await res.json();
        showToast('error', data.error || 'Failed to delete package');
      }
    } catch (err) {
      showToast('error', 'Network error deleting package.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = packages.filter(
    (p) =>
      (p?.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (p?.destination || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout activeTab="travel">
      <div className="space-y-6">
        {/* Toast Notifications */}
        {toastMessage && (
          <div
            className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold shadow-md transition-all ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            <span>{toastMessage.text}</span>
            <button onClick={() => setToastMessage(null)} className="p-1 hover:opacity-75">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Tours & Destination Products
            </span>
            <h1 className="text-2xl font-heading font-extrabold text-slate-950 mt-1">
              Travel Package Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create, edit, publish, and delete travel and sports tour packages.
            </p>
          </div>
          <button
            onClick={openNewModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Travel Package</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-500">
            Total Packages: <strong className="text-slate-900">{packages.length}</strong>
          </span>
        </div>

        {/* Packages List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
              <span className="text-xs text-slate-500">Loading travel packages...</span>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filtered.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                      <img
                        src={pkg.coverImageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80'}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white bg-slate-950/80 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{pkg.destination}</span>
                      </div>
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
                        pkg.isPublished ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}>
                        {pkg.isPublished ? 'Published' : 'Draft'}
                      </div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-heading font-bold text-base text-slate-950 mb-1">
                        {pkg.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                        {pkg.description}
                      </p>
                      <div className="text-[11px] text-slate-500 space-y-0.5">
                        <div><strong>Duration:</strong> {pkg.duration}</div>
                        {pkg.price && <div><strong>Price:</strong> {pkg.currency} {pkg.price}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditModal(pkg)}
                      className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: pkg.id, title: pkg.title })}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                      title="Delete package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs">
              No travel packages created yet. Click "Create Travel Package" above to publish a verified destination or sports tour package.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingPkg && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <h3 className="text-lg font-heading font-bold text-white">
                {editingPkg.id ? `Edit Package: ${editingPkg.title}` : 'Create Travel & Tour Package'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-4 text-xs">
              {/* Cover Photo */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={editingPkg.coverImageUrl || ''}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <span className="font-bold text-slate-900 block">Package Cover Image</span>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white font-bold rounded cursor-pointer">
                    {uploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{uploadingCover ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <input
                    type="url"
                    value={editingPkg.coverImageUrl || ''}
                    onChange={(e) => setEditingPkg({ ...editingPkg, coverImageUrl: e.target.value })}
                    placeholder="Or paste external image URL..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  />
                </div>
              </div>

              {/* Title & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Package Title *</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.title || ''}
                    onChange={(e) => setEditingPkg({ ...editingPkg, title: e.target.value })}
                    placeholder="e.g. European Football Tour & City Excursion"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    value={editingPkg.destination || ''}
                    onChange={(e) => setEditingPkg({ ...editingPkg, destination: e.target.value })}
                    placeholder="e.g. Madrid & Barcelona, Spain"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Duration & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingPkg.duration || ''}
                    onChange={(e) => setEditingPkg({ ...editingPkg, duration: e.target.value })}
                    placeholder="e.g. 7 Days / 6 Nights"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dates or Availability</label>
                  <input
                    type="text"
                    value={editingPkg.datesOrAvailability || ''}
                    onChange={(e) => setEditingPkg({ ...editingPkg, datesOrAvailability: e.target.value })}
                    placeholder="e.g. Summer 2026 / Year-Round"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* Price & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Indicative Price (Optional)</label>
                  <input
                    type="text"
                    value={editingPkg.price || ''}
                    onChange={(e) => setEditingPkg({ ...editingPkg, price: e.target.value })}
                    placeholder="e.g. 1,450 or Inquire for Quote"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={editingPkg.currency || 'USD'}
                    onChange={(e) => setEditingPkg({ ...editingPkg, currency: e.target.value })}
                    placeholder="USD / GBP / EUR"
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Package Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingPkg.description || ''}
                  onChange={(e) => setEditingPkg({ ...editingPkg, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Inclusions */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Inclusions</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={inclusionInput}
                    onChange={(e) => setInclusionInput(e.target.value)}
                    placeholder="e.g. Airport Transfer, Hotel Breakfast, City Tour"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddInclusion}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {(editingPkg.inclusions || []).map((inc, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-100 px-3 py-1 rounded text-[11px]">
                      <span>{inc}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publication toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPkg.isPublished || false}
                    onChange={(e) => setEditingPkg({ ...editingPkg, isPublished: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-900">Publish Immediately on Website</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Package</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal (Reliable in iframes) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-heading font-bold text-lg text-slate-950">
                Confirm Deletion
              </h3>
              <p className="text-xs text-slate-600 mt-2">
                Are you sure you want to permanently delete the travel package <strong>"{deleteTarget.title}"</strong>? This action cannot be reversed.
              </p>
            </div>

            <div className="pt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
              >
                {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{deleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
