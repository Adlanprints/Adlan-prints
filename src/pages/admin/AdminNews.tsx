import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
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
  Calendar,
  User
} from 'lucide-react';
import { NewsArticle } from '../../types';

export const AdminNews: React.FC = () => {
  const { authFetch } = useAuth();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle> | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);

  // In-app delete confirmation (no window.confirm)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/news');
      if (res.ok) {
        const data = await res.json();
        setNews(data);
      }
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openNewModal = () => {
    setEditingArticle({
      title: '',
      category: 'Sports Management',
      coverImageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80',
      author: 'Chamonvin Media Desk',
      summary: '',
      content: '',
      isPublished: true,
      publishedAt: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const openEditModal = (article: NewsArticle) => {
    setEditingArticle({ ...article });
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
        setEditingArticle((prev) => (prev ? { ...prev, coverImageUrl: data.url } : null));
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editingArticle.title?.trim()) {
      showToast('error', 'Article title is required.');
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingArticle.id;
      const url = isEdit ? `/api/admin/news/${editingArticle.id}` : '/api/admin/news';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingArticle)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingArticle(null);
        showToast('success', isEdit ? 'News article updated successfully!' : 'News article published successfully!');
        fetchNews();
      } else {
        const data = await res.json();
        showToast('error', data.error || 'Failed to save news article');
      }
    } catch (err) {
      showToast('error', 'Error saving article');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await authFetch(`/api/admin/news/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', `Article "${deleteTarget.title}" deleted.`);
        setDeleteTarget(null);
        fetchNews();
      } else {
        const data = await res.json();
        showToast('error', data.error || 'Failed to delete article');
      }
    } catch (err) {
      showToast('error', 'Network error deleting article.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = news.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout activeTab="news">
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
              Press & Media Desk
            </span>
            <h1 className="text-2xl font-heading font-extrabold text-slate-950 mt-1">
              News & Announcements
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Publish football updates, scouting announcements, and travel advisory notices.
            </p>
          </div>
          <button
            onClick={openNewModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New Article</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search news..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-500">
            Total Articles: <strong className="text-slate-900">{news.length}</strong>
          </span>
        </div>

        {/* News List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
              <span className="text-xs text-slate-500">Loading news articles...</span>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                      <img
                        src={item.coverImageUrl || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=600&q=80'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white bg-slate-950/80">
                        {item.category}
                      </div>
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${
                        item.isPublished ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(item.publishedAt || item.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{item.author}</span>
                      </div>
                      <h4 className="font-heading font-bold text-base text-slate-950 mb-1 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-3">
                        {item.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: item.id, title: item.title })}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                      title="Delete article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs">
              No news articles published yet. Click "Publish New Article" above to create an announcement.
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <h3 className="text-lg font-heading font-bold text-white">
                {editingArticle.id ? `Edit: ${editingArticle.title}` : 'Write News Article'}
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
                    src={editingArticle.coverImageUrl || ''}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <span className="font-bold text-slate-900 block">Article Cover Photo</span>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white font-bold rounded cursor-pointer">
                    {uploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{uploadingCover ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <input
                    type="url"
                    value={editingArticle.coverImageUrl || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, coverImageUrl: e.target.value })}
                    placeholder="Or paste external image URL..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white"
                  />
                </div>
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Article Headline *</label>
                  <input
                    type="text"
                    required
                    value={editingArticle.title || ''}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    placeholder="Headline..."
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={editingArticle.category || 'Sports Management'}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-xs"
                  >
                    <option value="Sports Management">Sports Management</option>
                    <option value="Player Updates">Player Updates</option>
                    <option value="Travel & Tours">Travel & Tours</option>
                    <option value="Visa & Immigration">Visa & Immigration</option>
                    <option value="Company News">Company News</option>
                  </select>
                </div>
              </div>

              {/* Author */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Author Byline</label>
                <input
                  type="text"
                  value={editingArticle.author || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
                  placeholder="e.g. Chamonvin Editorial Desk"
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Excerpt / Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.summary || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  placeholder="A concise synopsis of the article displayed on news cards..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Article Body *</label>
                <textarea
                  rows={6}
                  required
                  value={editingArticle.content || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  placeholder="Write the full body text here..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs"
                />
              </div>

              {/* Publication toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingArticle.isPublished || false}
                    onChange={(e) => setEditingArticle({ ...editingArticle, isPublished: e.target.checked })}
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
                  <span>Save Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
