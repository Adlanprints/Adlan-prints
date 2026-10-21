import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Trash2,
  MessageSquare,
  X,
  Send,
  Loader2,
  Mail,
  Phone,
  Calendar,
  User,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { InquiryRecord, InquiryStatus } from '../../types';

export const AdminInquiries: React.FC = () => {
  const { authFetch, admin } = useAuth();
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Selected Detail Modal
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // In-app deletion and toast feedback
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; ref: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter !== 'all') params.append('category', categoryFilter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await authFetch(`/api/admin/inquiries?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
        if (selectedInquiry) {
          const updated = data.find((i: InquiryRecord) => i.id === selectedInquiry.id);
          if (updated) setSelectedInquiry(updated);
        }
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [categoryFilter, statusFilter, search]);

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    try {
      const res = await authFetch(`/api/admin/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchInquiries();
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !newNote.trim()) return;

    setSavingNote(true);
    try {
      const res = await authFetch(`/api/admin/inquiries/${selectedInquiry.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newNote.trim() })
      });
      if (res.ok) {
        setNewNote('');
        fetchInquiries();
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await authFetch(`/api/admin/inquiries/${deleteTarget.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('success', `Inquiry ${deleteTarget.ref} deleted successfully.`);
        if (selectedInquiry?.id === deleteTarget.id) setSelectedInquiry(null);
        setDeleteTarget(null);
        fetchInquiries();
      } else {
        const data = await res.json();
        showToast('error', data.error || 'Failed to delete inquiry');
      }
    } catch (err) {
      showToast('error', 'Network error deleting inquiry');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <AdminLayout activeTab="inquiries">
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
              <CheckCircle className="w-4 h-4" />
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
              Client Relationship Management
            </span>
            <h1 className="text-2xl font-heading font-extrabold text-slate-950 mt-1">
              Inquiries & Leads Hub
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Filter by service category, manage statuses, and record confidential internal notes.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Inquiries: <strong className="text-slate-900">{inquiries.length}</strong>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Ref #, client name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Service Categories</option>
              <option value="player-representation">Player Representation</option>
              <option value="sports-management">Sports Management</option>
              <option value="travel-tours">Travel & Tours</option>
              <option value="visa-consultation">Visa Consultation</option>
              <option value="flight-services">Flight Services</option>
              <option value="general">General Contact</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Awaiting Client Response">Awaiting Client Response</option>
              <option value="Completed">Completed</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Inquiries Table List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-2" />
              <span className="text-xs text-slate-500">Loading inquiries database...</span>
            </div>
          ) : inquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Ref Number</th>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inquiries.map((inq) => (
                    <tr
                      key={inq.id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedInquiry(inq)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                        {inq.referenceNo}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {inq.clientName}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold uppercase text-[10px]">
                          {inq.category.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                        <div>{inq.email}</div>
                        <div className="text-[11px] text-slate-400">{inq.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={inq.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                          className={`px-2 py-1 rounded text-xs font-bold border ${
                            inq.status === 'New'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : inq.status === 'In Progress'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : inq.status === 'Completed'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Awaiting Client Response">Awaiting Response</option>
                          <option value="Completed">Completed</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedInquiry(inq)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold transition-colors cursor-pointer text-[11px]"
                          >
                            Details ({inq.internalNotes?.length || 0})
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: inq.id, ref: inq.referenceNo })}
                            className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center text-slate-500 text-xs">
              No client inquiries match the current filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* Detail & Internal Notes Drawer Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-slate-950 text-white p-6 flex items-center justify-between border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {selectedInquiry.referenceNo}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-white text-[10px] font-bold uppercase">
                    {selectedInquiry.category}
                  </span>
                </div>
                <h3 className="text-xl font-heading font-bold text-white">
                  {selectedInquiry.clientName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
              {/* Contact bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block">Email Address</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-emerald-700 font-semibold hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block">Phone / WhatsApp</span>
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-900 font-semibold hover:text-emerald-700"
                  >
                    {selectedInquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block">Submission Date</span>
                  <strong className="text-slate-900">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </strong>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="flex items-center justify-between bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-900">
                  Update Processing Status:
                </span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value as InquiryStatus)}
                  className="px-3 py-1.5 text-xs font-bold bg-white border border-emerald-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Awaiting Client Response">Awaiting Client Response</option>
                  <option value="Completed">Completed</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Detailed Submitted Fields */}
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-sm text-slate-900">
                  Submitted Inquiry Details
                </h4>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2">
                  {selectedInquiry.subject && (
                    <div>
                      <strong className="text-slate-700">Subject: </strong>
                      <span>{selectedInquiry.subject}</span>
                    </div>
                  )}

                  {Object.entries(selectedInquiry.details || {}).map(([key, value]) => {
                    if (key === 'submittedAt' || key === 'requestedAt') return null;
                    return (
                      <div key={key} className="border-t border-slate-200/60 pt-1.5">
                        <strong className="text-slate-700 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:{' '}
                        </strong>
                        <span className="text-slate-900 break-words">{String(value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Confidential Internal Notes Thread (Never Public) */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-heading font-bold text-sm text-slate-900">
                    Confidential Internal Staff Notes
                  </h4>
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    Staff Only • Never Public
                  </span>
                </div>

                {/* Notes List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedInquiry.internalNotes && selectedInquiry.internalNotes.length > 0 ? (
                    selectedInquiry.internalNotes.map((note) => (
                      <div key={note.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                        <p className="text-slate-800">{note.text}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span>By: {note.author}</span>
                          <span>{new Date(note.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      No internal notes recorded for this inquiry yet.
                    </p>
                  )}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    required
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add private staff note (e.g. Called client, scheduled video evaluation)..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={savingNote}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5"
                  >
                    {savingNote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Post Note</span>
                  </button>
                </form>
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-6 py-2 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider rounded-md hover:bg-slate-800 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
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
                Are you sure you want to delete inquiry <strong>"{deleteTarget.ref}"</strong>? This action cannot be reversed.
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
