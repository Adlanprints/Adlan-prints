import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Save,
  Video,
  Play
} from 'lucide-react';
import { PlayerProfile } from '../../types';
import { getYouTubeEmbedUrl } from '../PlayersPage';

export const AdminPlayers: React.FC = () => {
  const { authFetch } = useAuth();
  const [players, setPlayers] = useState<PlayerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Partial<PlayerProfile> | null>(null);
  const [achievementInput, setAchievementInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // In-app Delete Confirmation State (no window.confirm)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast / feedback messages
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const res = await authFetch('/api/admin/players');
      if (res.ok) {
        const data = await res.json();
        setPlayers(data);
      }
    } catch (err) {
      console.error('Failed to load players:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const openNewPlayerModal = () => {
    setModalError(null);
    setEditingPlayer({
      fullName: '',
      position: 'Center Back',
      nationality: '',
      playingLevel: 'Amateur',
      shortBio: '',
      careerAchievements: [],
      photoUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
      videoUrl: '',
      isFeatured: false,
      isPublished: true,
      currentClub: '',
      preferredFoot: 'Right',
      internalScoutingNotes: ''
    });
    setAchievementInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (player: PlayerProfile) => {
    setModalError(null);
    setEditingPlayer({ ...player });
    setAchievementInput('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadingPhoto(true);
    setModalError(null);
    try {
      const res = await authFetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setEditingPlayer((prev) => (prev ? { ...prev, photoUrl: data.url } : null));
      } else {
        setModalError(data.error || 'Failed to upload photo');
      }
    } catch (err) {
      setModalError('Photo upload error. Please check file format.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleAddAchievement = () => {
    if (!achievementInput.trim() || !editingPlayer) return;
    const currentList = editingPlayer.careerAchievements || [];
    setEditingPlayer({
      ...editingPlayer,
      careerAchievements: [...currentList, achievementInput.trim()]
    });
    setAchievementInput('');
  };

  const handleRemoveAchievement = (index: number) => {
    if (!editingPlayer) return;
    const list = [...(editingPlayer.careerAchievements || [])];
    list.splice(index, 1);
    setEditingPlayer({ ...editingPlayer, careerAchievements: list });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer || !editingPlayer.fullName?.trim()) {
      setModalError('Player full name is required.');
      return;
    }

    setSaving(true);
    setModalError(null);
    try {
      const isEdit = !!editingPlayer.id;
      const url = isEdit ? `/api/admin/players/${editingPlayer.id}` : '/api/admin/players';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPlayer)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingPlayer(null);
        showToast('success', isEdit ? 'Player profile updated successfully!' : 'New player created successfully!');
        fetchPlayers();
      } else {
        const data = await res.json();
        setModalError(data.error || 'Failed to save player');
      }
    } catch (err) {
      setModalError('Error connecting to server. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    const targetId = deleteTarget.id;
    const targetName = deleteTarget.name;
    setDeleting(true);
    try {
      const res = await authFetch(`/api/admin/players/${targetId}`, { method: 'DELETE' });
      if (res.ok) {
        setPlayers((prev) => prev.filter((p) => p.id !== targetId));
        showToast('success', `Player "${targetName}" deleted.`);
        setDeleteTarget(null);
        fetchPlayers();
      } else {
        const data = await res.json();
        showToast('error', data.error || 'Failed to delete player');
      }
    } catch (err) {
      showToast('error', 'Network error deleting player.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredPlayers = players.filter(
    (p) =>
      (p?.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p?.position || '').toLowerCase().includes(search.toLowerCase()) ||
      (p?.nationality || '').toLowerCase().includes(search.toLowerCase())
  );

  const previewEmbedUrl = editingPlayer?.videoUrl ? getYouTubeEmbedUrl(editingPlayer.videoUrl) : null;

  return (
    <AdminLayout activeTab="players">
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
            <div className="flex items-center gap-2">
              {toastMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{toastMessage.text}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="p-1 hover:opacity-75">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
              Roster & Scouting Management
            </span>
            <h1 className="text-2xl font-heading font-extrabold text-slate-950 mt-1">
              Football Players Directory
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add new footballers, upload photos, attach YouTube highlight reels, and manage publication.
            </p>
          </div>
          <button
            onClick={openNewPlayerModal}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Player</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search players..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <span className="text-xs text-slate-500">
            Total Records: <strong className="text-slate-900">{players.length}</strong>
          </span>
        </div>

        {/* Players Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
              <span className="text-xs text-slate-500">Loading roster...</span>
            </div>
          ) : filteredPlayers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 bg-slate-900 overflow-hidden">
                      <img
                        src={player.photoUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80'}
                        alt={player.fullName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          player.isPublished ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                        }`}>
                          {player.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {player.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-950 text-emerald-400">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[11px] font-bold">
                        {player.playingLevel}
                      </div>
                      {player.videoUrl && (
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow">
                          <Play className="w-3 h-3 fill-white" />
                          <span>Video</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                        {player.position} • {player.nationality}
                      </div>
                      <h4 className="font-heading font-bold text-lg text-slate-950 mt-0.5 mb-1">
                        {player.fullName}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                        {player.shortBio}
                      </p>
                      {player.videoUrl && (
                        <div className="text-[11px] text-emerald-700 flex items-center gap-1 mb-2 font-medium truncate">
                          <Video className="w-3 h-3 shrink-0" />
                          <span className="truncate">{player.videoUrl}</span>
                        </div>
                      )}
                      {player.internalScoutingNotes && (
                        <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 mb-2">
                          <strong className="block text-[10px] uppercase font-bold text-amber-700">Internal Scouting Note:</strong>
                          {player.internalScoutingNotes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-slate-200 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditModal(player)}
                      className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: player.id, name: player.fullName })}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                      title="Delete profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs">
              No players currently in database. Click "Add New Player" above to register and publish an athlete profile.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Player Modal */}
      {isModalOpen && editingPlayer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <h3 className="text-lg font-heading font-bold text-white">
                {editingPlayer.id ? `Edit Player: ${editingPlayer.fullName}` : 'Create New Player Profile'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto space-y-4 text-xs">
              {modalError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* Photo Preview & Upload */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                  <img
                    src={editingPlayer.photoUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80'}
                    alt="Player preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <span className="font-bold text-slate-900 block">Player Photograph</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded cursor-pointer flex items-center gap-1.5">
                      {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>{uploadingPhoto ? 'Uploading...' : 'Upload Image File'}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                  <input
                    type="url"
                    value={editingPlayer.photoUrl || ''}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, photoUrl: e.target.value })}
                    placeholder="Or paste external image URL..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Name & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingPlayer.fullName || ''}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Position *</label>
                  <input
                    type="text"
                    required
                    value={editingPlayer.position || ''}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, position: e.target.value })}
                    placeholder="e.g. Center Back / Winger / Midfield"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              {/* Nationality & Playing Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nationality *</label>
                  <input
                    type="text"
                    required
                    value={editingPlayer.nationality || ''}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, nationality: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Playing Level *</label>
                  <select
                    value={editingPlayer.playingLevel || 'Amateur'}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, playingLevel: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white focus:ring-1 focus:ring-emerald-500 text-xs"
                  >
                    <option value="Academy">Academy</option>
                    <option value="Amateur">Amateur</option>
                    <option value="Semi-Professional">Semi-Professional</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
              </div>

              {/* REQUIRED: PLAYER HIGHLIGHT REEL & VIDEO DOSSIER (YOUTUBE URL) */}
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-emerald-700" />
                  <label className="block font-bold text-slate-900 text-xs uppercase tracking-wide">
                    Player Highlight Reel & Video Dossier (YouTube Video URL)
                  </label>
                </div>
                <input
                  type="url"
                  value={editingPlayer.videoUrl || ''}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, videoUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  className="w-full px-3 py-2 border border-emerald-300 rounded bg-white text-xs focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-slate-500 block">
                  YouTube videos will automatically display in an interactive embedded player on the public player profile.
                </span>

                {previewEmbedUrl && (
                  <div className="mt-2 pt-2 border-t border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-800 block mb-1">Live Embed Preview:</span>
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-300 bg-black">
                      <iframe
                        src={previewEmbedUrl}
                        title="Video Preview"
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Club & Preferred Foot */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Club</label>
                  <input
                    type="text"
                    value={editingPlayer.currentClub || ''}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, currentClub: e.target.value })}
                    placeholder="e.g. Free Agent or Team"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-emerald-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Foot</label>
                  <select
                    value={editingPlayer.preferredFoot || 'Right'}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, preferredFoot: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-xs"
                  >
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={editingPlayer.age || ''}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, age: Number(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* Short Bio */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Biography *</label>
                <textarea
                  rows={3}
                  required
                  value={editingPlayer.shortBio || ''}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, shortBio: e.target.value })}
                  placeholder="Player career summary, attributes, and background..."
                  className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Verified Achievements</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    placeholder="e.g. League Top Scorer 2025, National Youth Team Call-up"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {(editingPlayer.careerAchievements || []).map((ach, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-100 px-3 py-1 rounded text-[11px]">
                      <span>{ach}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievement(idx)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal Scouting Notes (Private) */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <label className="block font-bold text-amber-900 text-[11px] uppercase tracking-wide">
                  Private Internal Scouting Notes (Staff Only)
                </label>
                <textarea
                  rows={2}
                  value={editingPlayer.internalScoutingNotes || ''}
                  onChange={(e) => setEditingPlayer({ ...editingPlayer, internalScoutingNotes: e.target.value })}
                  placeholder="Confidential technical evaluations, contract expiry details, agent notes (never visible to public)..."
                  className="w-full px-3 py-1.5 border border-amber-300 rounded text-xs bg-white focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Publication Controls */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlayer.isPublished || false}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, isPublished: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-900">Publish on Public Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlayer.isFeatured || false}
                    onChange={(e) => setEditingPlayer({ ...editingPlayer, isFeatured: e.target.checked })}
                    className="h-4 w-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="font-bold text-slate-900">Feature on Homepage</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
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
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer shadow"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>Save Player Profile</span>
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
                Are you sure you want to permanently delete the player profile for <strong>"{deleteTarget.name}"</strong>? This action cannot be reversed.
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
